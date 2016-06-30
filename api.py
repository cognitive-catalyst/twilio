import atexit
import json
import math
import os
import sys
import time
from functools import wraps

import pymysql.cursors
from flask import Blueprint, request

MESSAGES_PER_PAGE = 10


blueprint = Blueprint("api", __name__)
socketio = None
hostname = None
port = None
username = None
password = None
db = None

if 'VCAP_SERVICES' in os.environ:
    mysql_info = json.loads(os.environ['VCAP_SERVICES'])['cleardb'][0]
elif os.path.isfile('config.json'):
    with open('config.json') as json_data:
        try:
            mysql_info = json.loads(json_data.read())
        except:
            raise
            sys.exit('Database credentials are incorrect. Please update the config.json with the database credentials')
else:
    sys.exit('Database credentials not specified')

mysql_cred = mysql_info['credentials']
hostname = mysql_cred['hostname']
port = mysql_cred['port'] or 3306
username = mysql_cred['username']
password = mysql_cred['password']
db = mysql_cred['name']

try:
    connection = pymysql.connect(host=hostname,
                                 user=username,
                                 password=password,
                                 db=db,
                                 charset='utf8mb4',
                                 cursorclass=pymysql.cursors.DictCursor)
    connection.close()
except:
    sys.exit('Database credentials are incorrect. Please update the config.json with the database credentials')


def _drop_tables(cursor):
    try:
        sql = '''DROP TABLE messages;'''
        cursor.execute(sql)
    except:
        pass
    try:
        sql = '''DROP TABLE relationships;'''
        cursor.execute(sql)
    except:
        pass


def reconnect(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        close_conn = False
        conn = kwargs.get('conn')

        if conn is None:
            close_conn = True
            conn = connect()

            kwargs['conn'] = conn
        retval = func(*args, **kwargs)

        if close_conn:
            conn.commit()
            conn.close()
        return retval

    return wrapper


def close_db(con):
    con.close()


def connect(a=0):
    if a == 30:
        return
    try:
        conn = pymysql.connect(host=hostname,
                               user=username,
                               password=password,
                               db=db,
                               charset='utf8mb4',
                               cursorclass=pymysql.cursors.DictCursor)
    except pymysql.err.InternalError:
        time.sleep(1)
        return connect(a=a + 1)
    return conn


# atexit.register(close_db, con=connection)


@reconnect
def create_db(conn=None):
    with conn.cursor() as cursor:
        sql = '''CREATE TABLE IF NOT EXISTS messages
                (id INT AUTO_INCREMENT,
                text VARCHAR(3000),
                phone_number VARCHAR(15),
                city VARCHAR(30),
                state VARCHAR(2),
                sentiment VARCHAR(15),
                timestamp DATETIME DEFAULT NULL,
                archived_timestamp DATETIME DEFAULT NULL,
                PRIMARY KEY (id)); '''
        cursor.execute(sql)

        sql = '''CREATE TABLE IF NOT EXISTS relationships
                (message_id INT,
                text VARCHAR(50),
                type VARCHAR(25),
                relevance FLOAT,
                sentiment VARCHAR(12)); '''
        cursor.execute(sql)

create_db()


@blueprint.route('/message', methods=['POST'])
@reconnect
def message(conn=None):
    phone_number = request.form['From']
    phone_number = phone_number[:-4] + "XXXX"  # obfuscate phone number

    message_body = request.form['Body']
    city = request.form['FromCity']
    state = request.form['FromState']

    addOns = json.loads(request.form['AddOns'])
    try:
        sentiment = addOns['results']['ibm_watson_sentiment']['result']['docSentiment']['type']
    except:
        sentiment = 'Neutral'

    data = addOns['results']['ibm_watson_insights']['result']

    with conn.cursor() as cursor:
        parameters = [message_body, phone_number, city, state, sentiment]
        sql = '''INSERT INTO messages
        (text, phone_number, city, state, sentiment, timestamp)
        VALUES(%s, %s, %s, %s, %s, NOW())'''
        cursor.execute(sql, parameters)

        parameters = []
        keywords = data['keywords']
        entities = data['entities']
        concepts = data['concepts']

        for keyword in keywords:
            param = keyword['text'], "keyword", keyword['relevance'], keyword['sentiment']['type']
            parameters.append(param)
        for entity in entities:
            param = entity['text'], "entity", entity['relevance'], entity['sentiment']['type']
            parameters.append(param)
        for concept in concepts:
            param = concept['text'], "concept", concept['relevance'], 0
            parameters.append(param)

        sql = '''INSERT INTO relationships
        (message_id, text, type, relevance, sentiment)
        VALUES(LAST_INSERT_ID(), %s, %s, %s, %s)'''
        cursor.executemany(sql, parameters)
    conn.commit()
    # Emit the data via websocket
    socketio.emit('incoming data', get_messages())
    return json.dumps({'status': 'success'})


def _num_to_day(num):
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    return days[num]


@blueprint.route('/get_messages')
@blueprint.route('/get_messages/<path:page_number>')
@reconnect
def get_messages(page_number=1, conn=None):
    page_offset = int(page_number) - 1
    with conn.cursor() as cursor:
        sql = '''
            SELECT  SQL_CALC_FOUND_ROWS
                    messages.id,
                    messages.text,
                    phone_number,
                    city,
                    state,
                    timestamp,
                    messages.sentiment,
                    GROUP_CONCAT(
                        CONCAT_WS(
                            ":",
                            relationships.type,
                            relationships.text,
                            relationships.relevance,
                            relationships.sentiment
                        )
                        separator "|"
                    ) as relationships
            FROM messages
            LEFT JOIN relationships
            ON messages.id=relationships.message_id
            WHERE messages.archived_timestamp is NULL
            GROUP BY messages.id
            ORDER BY timestamp desc
            LIMIT %s
            OFFSET %s
        '''

        cursor.execute(sql, [MESSAGES_PER_PAGE, page_offset * MESSAGES_PER_PAGE])
        result = cursor.fetchall()

        cursor.execute('SELECT FOUND_ROWS() as pages')
        pages = cursor.fetchone()
    for r in result:
        timestamp = r['timestamp']
        day_of_week = _num_to_day(timestamp.weekday())
        day = timestamp.strftime("{0} %B %d".format(day_of_week))
        time = str(timestamp.time())
        r.pop('timestamp')
        r['day'] = day
        r['time'] = time

        relationships = r['relationships'].split('|')
        r['keyword'] = {}
        r['entity'] = {}
        r['concept'] = {}
        for rel in relationships:
            details = rel.split(':')
            if len(details) > 2:
                r_type = details[0]
                r[r_type][details[1]] = {
                    'relevance': details[2],
                    'sentiment': details[3]
                }
        r.pop('relationships')
    return json.dumps({
        'messages': result,
        'totalPages': math.ceil(float(pages['pages']) / MESSAGES_PER_PAGE)
    })


@blueprint.route('/get_archived_messages')
@blueprint.route('/get_archived_messages/<path:page_number>')
@reconnect
def get_archived_messages(page_number=1, conn=None):
    page_offset = int(page_number) - 1

    with conn.cursor() as cursor:
        sql = '''
            SELECT  SQL_CALC_FOUND_ROWS
                    messages.id,
                    messages.text,
                    phone_number,
                    city,
                    state,
                    timestamp,
                    messages.sentiment,
                    messages.archived_timestamp,
                    GROUP_CONCAT(
                        CONCAT_WS(
                            ":",
                            relationships.type,
                            relationships.text,
                            relationships.relevance,
                            relationships.sentiment
                        )
                        separator "|"
                    ) as relationships
            FROM messages
            LEFT JOIN relationships
            ON messages.id=relationships.message_id
            WHERE messages.archived_timestamp is NOT NULL
            GROUP BY messages.id
            ORDER BY timestamp desc
            LIMIT %s
            OFFSET %s
        '''

        cursor.execute(sql, [MESSAGES_PER_PAGE, page_offset * MESSAGES_PER_PAGE])
        result = cursor.fetchall()

        cursor.execute('SELECT FOUND_ROWS() as pages')
        pages = cursor.fetchone()

    for r in result:
        timestamp = r['timestamp']
        day_of_week = _num_to_day(timestamp.weekday())
        day = timestamp.strftime("{0} %B %d".format(day_of_week))
        time = str(timestamp.time())
        r.pop('timestamp')
        r['day'] = day
        r['time'] = time

        archived_timestamp = r['archived_timestamp']
        archived_day_of_week = _num_to_day(archived_timestamp.weekday())
        archived_day = archived_timestamp.strftime("{0} %B %d".format(archived_day_of_week))
        archived_time = str(archived_timestamp.time())
        r.pop('archived_timestamp')
        r['archived_day'] = archived_day
        r['archived_time'] = archived_time

        relationships = r['relationships'].split('|')
        r['keyword'] = {}
        r['entity'] = {}
        r['concept'] = {}
        for rel in relationships:
            details = rel.split(':')
            r_type = details[0]
            r[r_type][details[1]] = {
                'relevance': details[2],
                'sentiment': details[3]
            }
        r.pop('relationships')

    return json.dumps({
        'messages': result,
        'totalPages': math.ceil(float(pages['pages']) / MESSAGES_PER_PAGE)
    })


@blueprint.route('/get_relationships')
@reconnect
def get_relationships(conn=None):

    with conn.cursor() as cursor:
        sql = '''SELECT * FROM relationships'''
        cursor.execute(sql)
        result = cursor.fetchall()
    return json.dumps(result)


@blueprint.route('/get_num_messages/<days>')
@reconnect
def get_num_messages(days, conn=None):
    with conn.cursor() as cursor:
        sql = '''
            SELECT count(*) as num_messages FROM messages
            WHERE timestamp >= (now() - INTERVAL %s DAY)
        '''
        cursor.execute(sql, [days])
        result = cursor.fetchone()

    return json.dumps(result)


@blueprint.route('/get_sentiment_count/<days>')
@reconnect
def get_sentiment_count(days, conn=None):
    with conn.cursor() as cursor:
        sql = '''
            SELECT CONCAT(UCASE(LEFT(sentiment, 1)), LCASE(SUBSTRING(sentiment, 2))) as label, count(sentiment) as value,
            case
                when LOWER(sentiment) = 'positive' then '#4A90E2'
                when LOWER(sentiment) = 'negative' then '#734199'
                when LOWER(sentiment) = 'neutral' then '#C7C7C6' end as color
            FROM messages
            WHERE timestamp >= (now() - INTERVAL %s DAY)
            GROUP BY sentiment
        '''
        cursor.execute(sql, [days])
        result = cursor.fetchall()

    return json.dumps(result)


@blueprint.route('/archive_message/<id>', methods=['POST'])
@reconnect
def archive_message(id, conn=None):
    with conn.cursor() as cursor:
        sql = '''
            UPDATE messages
            SET archived_timestamp = NOW()
            WHERE id = %s
        '''
        cursor.execute(sql, [id])
    conn.commit()
    socketio.emit('incoming data', get_messages())
    socketio.emit('archived data', get_archived_messages())
    return json.dumps({'status': 'success'})
