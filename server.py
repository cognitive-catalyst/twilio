import os

from flask import Flask, send_from_directory
from flask_socketio import SocketIO, emit

import api

app = Flask(__name__)

app.register_blueprint(api.blueprint, url_prefix='/api')

socketio = SocketIO(app)

api.socketio = socketio


@app.route('/')
@app.route('/<path:path>')
def html(path=1):
    ''' Serves the index.html file for frontend views'''
    return send_from_directory(".", "index.html")


@app.route("/build/bundle.js")
def bundle():
    ''' Serves the bundle.js file that controls the frontend view'''
    return send_from_directory("build", "bundle.js")


# @socketio.on('get init incoming data')
# def handle_init_data(page=1):
#     emit('incoming data', api.get_messages(page))
#
#
# @socketio.on('get init archived data')
# def handle_init_archive_data(page=1):
#     emit('archived data', api.get_archived_messages(page))

if __name__ == '__main__':
    host = os.getenv('VCAP_APP_HOST', '0.0.0.0')
    port = int(os.getenv('VCAP_APP_PORT', '8888'))
    socketio.run(app, host=host, port=port, debug=False)
