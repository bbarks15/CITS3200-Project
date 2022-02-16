from flask import request, jsonify, current_app
from app import db
from app.auth import bp
from app.models import User
from app.errors import error_response
from app.email.email import send_password_reset
from app.jwt_functions import admin_required
from app.api.users import check_token
from flask_jwt_extended import jwt_required, get_jwt_identity
from jwt import encode
import datetime

@bp.route('/reset_password', methods=['POST'])
def reset_password():
    user_email = request.json.get('email', None)
    callback = request.json.get('callback', None)
    if not user_email:
        return error_response(400, "Missing email parameter")
    if not callback:
        return error_response(400, "Missing callback parameter")

    user = User.query.filter_by(email=user_email).first()
    if not user:
        return error_response(404, f"Could not find user with email {user_email}")

    token = user.generate_token(24).decode('utf-8')
    # send email
    recipient = [user_email]
    send_password_reset(token, recipient, callback)

    return {'success': 'email sent'}, 200

@bp.route('/password', methods=['PATCH'])
def update_password():
    token = request.json.get('token', None)
    password = request.json.get('password', None)
    email = request.args.get('email', None)
    if not token:
        return error_response(400, "Missing token parameter")
    if not password:
        return error_response(400, "Missing password parameter")
    if not email:
        return error_response(400, "Missing email argument")

    user = User.query.filter_by(email=email).first()
    if not user:
        return error_response(404, f'Could not find user with email {email}')
    user_id = check_token(token, user.password_hash)
    if user_id == 0:
        return error_response(401, "Invalid Token")
    elif user_id == -1:
        return error_response(401, "Token has expired")

    user.set_password(password)
    db.session.commit()
    return jsonify({"Success": "Password has been updated"}), 200
