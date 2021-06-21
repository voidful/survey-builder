import argparse
import json
import os
import sys
from http.client import HTTPException

import nlp2
from gevent.pywsgi import WSGIServer
from flask import Flask, request, send_from_directory, send_file, jsonify, Response
from flask_cors import CORS
from pathlib import Path


class ServerError(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        error_dict = dict(self.payload or ())
        error_dict['message'] = self.message
        return error_dict


def make_app(static_dir: str = None) -> Flask:
    static_dir = os.path.abspath(static_dir)
    app = Flask(__name__, static_folder=static_dir)

    @app.route('/')
    def index() -> Response:  # pylint: disable=unused-variable
        if static_dir is not None:
            return send_file(os.path.join(static_dir, 'index.html'))

    @app.route('/<path:path>')
    def static_proxy(path: str) -> Response:
        if static_dir is not None:
            return send_from_directory(static_dir, path)
        else:
            return send_file(os.path.join(static_dir, 'index.html'))

    @app.route('/get_survey_list', methods=['GET'])
    def get_survey_list():
        surveys = []
        for file in nlp2.get_files_from_dir('./surveys/'):
            if ".json" in file:
                file_name = Path(file).stem
                surveys.append({"value": file_name, "label": file_name})
        return jsonify(surveys)

    @app.route('/get_survey', methods=['GET'])
    def get_survey():
        page_id = request.args.get("id")
        return jsonify(nlp2.read_json(f'./surveys/{page_id}.json'))

    @app.route('/result', methods=['POST'])
    def api():
        content = request.json
        output_dir = nlp2.get_dir_with_notexist_create("./result/")
        with open(f"./{output_dir}/{nlp2.random_string(10)}.json", 'w', encoding='utf8') as outfile:
            json.dump(content, outfile)
        return "Finish"

    @app.errorhandler(Exception)
    def handle_error(e):
        code = 500
        if isinstance(e, HTTPException):
            code = e.code
        return jsonify(error=str(e)), code

    return app


def main(args):
    parser = argparse.ArgumentParser(description='Serve up a simple model')
    parser.add_argument('--static-dir', default='./build', type=str, help='serve index.html from this directory')
    parser.add_argument('--port', type=int, default=80, help='port to serve the demo on')

    args = parser.parse_args(args)
    app = make_app(static_dir=args.static_dir)
    CORS(app)

    print("server started")
    http_server = WSGIServer(('0.0.0.0', args.port), app)
    http_server.serve_forever()


if __name__ == "__main__":
    main(sys.argv[1:])
