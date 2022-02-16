from app.auth import bp
from app.models import User
from app.errors import error_response
from app.jwt_functions import admin_required
from flask import jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_claims


@bp.route('/login', methods=['POST'])
def user_login():
    if not request.is_json:
        return error_response(400, "Missing JSON in request")

    username = request.json.get('username', None)
    password = request.json.get('password', None)
    if not username:
        return error_response(400, "Missing username parameter")
    if not password:
        return error_response(400, "Missing password parameter")

    user = User.query.filter_by(email=username).first()
    if not user or not user.check_password(password):
        return error_response(401, "Bad email or password")

    access_token = create_access_token(identity=user)
    return jsonify(access_token=access_token), 200
