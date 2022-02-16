from flask import request, jsonify, url_for
from app import db
from app.auth import bp
from app.models import User
from app.errors import error_response

@bp.route('/register', methods=['POST'])
def register_user():
    data = request.get_json() or {}
    if 'email' not in data or 'password' not in data:
        return error_response(400, 'must include email and password fields')
    if User.query.filter_by(email=data['email']).first():
        return error_response(400, 'please use a different email address')
    user = User()
    user.from_dict(data, new_user=True)
    db.session.add(user)
    db.session.commit()
    response = jsonify(user.to_dict()), 201
    response.headers['Location'] = url_for('auth.register_user')
    return response
