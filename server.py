import json
import os
from flask_socketio import SocketIO, emit
from flask import Flask, send_from_directory

import api

app = Flask(__name__)

app.register_blueprint(api.blueprint, url_prefix='/api')

socketio = SocketIO(app)

api.socketio = socketio;

@app.route('/')
def html():
    ''' Serves the index.html file for frontend views'''
    return send_from_directory(".", "index.html")


@app.route("/build/bundle.js")
def bundle():
    ''' Serves the bundle.js file that controls the frontend view'''
    return send_from_directory("build", "bundle.js")

@socketio.on('get init incoming data')
def handle_init_data():
    emit('incoming data', api.get_messages());

@socketio.on('get init archived data')
def handle_init_data():
    emit('archived data', api.get_archived_messages());

if __name__ == '__main__':
    port = int(os.getenv('VCAP_APP_PORT', '8888'))
    socketio.run(app, host="0.0.0.0", port=port, debug=True)
