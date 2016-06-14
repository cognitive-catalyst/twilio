import json

import pymysql.cursors
from flask import Blueprint, request

blueprint = Blueprint("api", __name__)

connection = pymysql.connect(host='169.44.9.188',
                             user='SQL_USER',
                             password='12212xlk821',
                             db='twilio',
                             charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)


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
    def wrapper():
        global connection
        try:
            func()
        except pymysql.err.OperationalError:
            connection = pymysql.connect(host='169.44.9.188',
                                         user='SQL_USER',
                                         password='12212xlk821',
                                         db='twilio',
                                         charset='utf8mb4',
                                         cursorclass=pymysql.cursors.DictCursor)
            retval = func()
            return retval
        # print "committed"
    return wrapper


@reconnect
@blueprint.route('/create_db')
def create_db():
    with connection.cursor() as cursor:
        _drop_tables(cursor)
        sql = '''CREATE TABLE messages
                (id INT AUTO_INCREMENT,
                text VARCHAR(3000),
                phone_number VARCHAR(15),
                city VARCHAR(30),
                state VARCHAR(2),
                sentiment VARCHAR(15),
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                completed BOOL NOT NULL DEFAULT 0,
                PRIMARY KEY (id)); '''
        cursor.execute(sql)

        sql = '''CREATE TABLE relationships
                (message_id INT,
                text VARCHAR(50),
                type VARCHAR(25),
                relevance FLOAT,
                sentiment VARCHAR(12)); '''
        cursor.execute(sql)

    return json.dumps({'status': 'success'})


@reconnect
@blueprint.route('/message', methods=['POST'])
def message():
    message_body = request.form['Body']
    print message_body
    phone_number = request.form['From']
    city = request.form['FromCity']
    state = request.form['FromState']

    addOns = json.loads(request.form['AddOns'])
    try:
        sentiment = addOns['results']['ibm_watson_sentiment']['result']['docSentiment']['type']
    except:
        sentiment = 'Neutral'

    data = addOns['results']['ibm_watson_insights']['result']

    with connection.cursor() as cursor:
        parameters = [message_body, phone_number, city, state, sentiment]
        sql = '''INSERT INTO messages
        (text, phone_number, city, state, sentiment)
        VALUES(%s, %s, %s, %s, %s)'''
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

    connection.commit()

    # Emit the data via websocket
    # emit('data', get_messages());

    return json.dumps({'status': 'success'})


def _num_to_day(num):
    days = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"]
    return days[num]


# @reconnect
@blueprint.route('/get_messages')
def get_messages():
    with connection.cursor() as cursor:
        sql = '''
            SELECT  messages.text,
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
            JOIN relationships
            ON messages.id=relationships.message_id
            GROUP BY messages.id
            ORDER BY timestamp desc
            LIMIT 5
        '''
        cursor.execute(sql)
        result = cursor.fetchall()

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
            r_type = details[0]
            r[r_type][details[1]] = {
                'relevance': details[2],
                'sentiment': details[3]
            }
        r.pop('relationships')
    return json.dumps(result)


@reconnect
@blueprint.route('/get_relationships')
def get_relationships():

    with connection.cursor() as cursor:
        sql = '''SELECT * FROM relationships'''
        cursor.execute(sql)
        result = cursor.fetchall()
    return json.dumps(result)


@reconnect
@blueprint.route('/get_num_messages/<days>')
def get_num_messages(days):
    with connection.cursor() as cursor:
        sql = '''
            SELECT count(*) as num_messages FROM messages
            WHERE timestamp >= (now() - INTERVAL ''' + days + ''' DAY)
        '''
        cursor.execute(sql)
        result = cursor.fetchone()

    return json.dumps(result)

@reconnect
@blueprint.route('/get_sentiment_count/<days>')
def get_sentiment_count(days):
    with connection.cursor() as cursor:
        sql = '''
            SELECT CONCAT(UCASE(LEFT(sentiment, 1)), LCASE(SUBSTRING(sentiment, 2))) as label, count(sentiment) as value,
            case
                when LOWER(sentiment) = 'positive' then '#4A90E2'
                when LOWER(sentiment) = 'negative' then '#734199'
                when LOWER(sentiment) = 'neutral' then '#C7C7C6' end as color
            FROM messages
            WHERE timestamp >= (now() - INTERVAL ''' + days + ''' DAY)
            GROUP BY sentiment
        '''
        cursor.execute(sql)
        result = cursor.fetchall()



    return json.dumps(result)
