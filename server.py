import os

from flask import Flask, send_from_directory

import api

app = Flask(__name__)

app.register_blueprint(api.blueprint, url_prefix='/api')


@app.route('/')
def html():
    ''' Serves the index.html file for frontend views'''
    return send_from_directory(".", "index.html")


@app.route("/build/bundle.js")
def bundle():
    ''' Serves the bundle.js file that controls the frontend view'''
    return send_from_directory("build", "bundle.js")

port = int(os.getenv('VCAP_APP_PORT', '8888'))
app.run(host="0.0.0.0", port=port, debug=True)
