from flask import jsonify
from werkzeug.http import HTTP_STATUS_CODES


def error_response(status_code, message=None):
    error = {'error': HTTP_STATUS_CODES.get(status_code, 'Unknown Error')}
    if message:
        error['message'] = message
    response = jsonify(error)
    response.status_code = status_code
    return response
