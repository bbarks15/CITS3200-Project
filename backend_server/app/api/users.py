from app import db
from app.api import bp
from app.errors import error_response
from app.models import Client, User, Project
from app.email.email import send_registration
from flask import jsonify, request, current_app
from app.jwt_functions import admin_required, get_jwt_claims
from flask_jwt_extended import jwt_required, get_jwt_identity
import string
import random
import jwt

def create_user_dict(user):
    client = Client.query.filter_by(id=user.client_id).first()
    return {
            'email': user.email,
            'notifications': user.notifications,
            'phone': client.phone,
            'address': client.address,
            'address2': client.address2,
            'ABN': client.abn,
            'company': client.company,
            'isAdmin': user.admin}

def create_user_dict_full(user):
    dict = create_user_dict(user)
    dict['id'] = user.id
    return dict

@bp.route('/user', methods=['GET'])
@admin_required
def get_users():
    user_list = User.query.all()
    if not user_list:
        return error_response(404, 'Whoops! Could not find any users')
    try:
        users_dict = [create_user_dict_full(u) for u in user_list]
    except:
        return error_response(404, 'Whoops! Could not find any clients')
    return jsonify(users_dict), 200

@bp.route('/user', methods=['PATCH'])
@jwt_required
def update_user():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()
    if not user:
        return error_response(404, 'Whoops! Could not find user')

    client = Client.query.filter_by(id=user.client_id).first()
    if not client:
        return error_response(404, 'Whoops! Could not find user')

    data = request.get_json() or {}
    user_fields = ['email', 'notifications', 'password']
    client_fields = ['phone', 'address', 'address2']
    for d in data:
        if d == 'password':
            user.set_password(data['password'])
        elif d == 'email':
            user.email = data[d]
            client.notification_email = data[d]
        elif d in user_fields:
            setattr(user, d, data[d])
        elif d in client_fields:
            setattr(client, d, data[d])
        else:
            pass
    try:
        db.session.commit()
    except:
        return error_response(400, 'Something broke with writing database')
    return jsonify({'success': True}), 200

@bp.route('/user/<int:id>', methods=['PATCH'])
@admin_required
def update_user_admin(id):
    user = User.query.filter_by(id=id).first()
    if not user:
        return error_response(404, 'Whoops! Could not find user')

    client = Client.query.filter_by(id=user.client_id).first()
    if not client:
        return error_response(404, 'Whoops! Could not find user')

    data = request.get_json() or {}
    user_fields = ['email', 'notifications', 'password', 'admin']
    client_fields = ['phone', 'address', 'address2']
    for d in data:
        if d == 'password':
            user.set_password(data['password'])
        elif d == 'email':
            user.email = data[d]
            client.notification_email = data[d]
        elif d in user_fields:
            setattr(user, d, data[d])
        elif d in client_fields:
            setattr(client, d, data[d])
        else:
            pass
    try:
        db.session.commit()
    except:
        return error_response(400, 'Something broke with writing database')
    return jsonify({'success': True}), 200

@bp.route('/user/<int:id>', methods=['DELETE'])
@admin_required
def delete_user(id):
    user = User.query.filter_by(id=id).first()
    if not user:
        return error_response(404, 'Whoops! Could not find user')
    try:
        db.session.delete(user)
        db.session.commit()
    except:
        return error_response(400, 'Something broke. Could not delete user')
    return jsonify({'success': True}), 200

@bp.route('/me', methods=['GET'])
@jwt_required
def get_me():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()
    if not user:
        return error_response(404, f'Whoops! Could not find me in the users')
    try:
        user_dict = create_user_dict(user)
    except:
        return error_response(404, 'Whoops! Something broke getting the client')
    return jsonify(user_dict), 200

@bp.route('/user/<int:id>', methods=['GET'])
@admin_required
def get_user(id):
    user = User.query.get(id)
    if not user:
        return error_response(404, f'Whoops! Could not find user with id {id}')
    try:
        user_dict = create_user_dict_full(user)
    except:
        return error_response(404, 'Whoops! Something broke getting the user')
    return jsonify(user_dict), 200

def check_token(token, password_hash):
    try:
        decoded = jwt.decode(token, password_hash)
    except jwt.ExpiredSignatureError:
        return -1
    except:
        return 0
    return decoded['id']

@bp.route('/user/register', methods=['POST'])
@admin_required
def register_user():
    email = request.json.get('email', None)
    callback = request.json.get('callback', None)
    if not email:
        return error_response(400, "Missing email parameter")
    if not callback:
        return error_response(400, "Missing callback parameter")

    user = User.query.filter_by(email=email).first()
    if not user:
        return error_response(404, f'Could not find user with email {email}')

    token = user.generate_token(48).decode('utf-8')
    send_registration(token, [email], callback)

    return jsonify({"Success": f"Registration sent to {email}"}), 200

@bp.route('/user/create', methods=['POST'])
@admin_required
def create_user():
    email = request.json.get('email', None)
    if not email:
        return error_response(400, "Missing email parameter")

    client = Client.query.filter_by(notification_email=email).first()
    if not client:
        client_parameter = ['address', 'address2', 'ABN', 'company', 'phone', 'email']
        data = request.get_json() or {}
        for p in client_parameter:
            if p not in data:
                return error_response(400, f"Missing {p} parameter")
        client = Client()
        for p in client_parameter:
            if p == 'email':
                setattr(client, 'notification_email', data[p])
            else:
                setattr(client, p, data[p])
        db.session.add(client)
    user = User.query.filter_by(email=email).first()
    if user:
        return error_response(400, f'User already exists with email {email}')
    user = User(email=email,client_id=client.id)
    password_characters = string.ascii_letters + string.digits
    password = ''.join(random.choice(password_characters) for i in range(32))
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return jsonify({"Success": f"Created user"}), 200

@bp.route('/user/password', methods=['PATCH'])
@jwt_required
def change_password():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()
    if not user:
        return error_response(404, 'Whoops! Could not find user')
    old_password = request.json.get('oldPassword', None)
    new_password = request.json.get('newPassword', None)
    if not old_password:
        return error_response(400, "Missing email parameter")
    if not new_password:
        return error_response(400, "Missing callback parameter")

    if user.check_password(old_password):
        user.set_password(new_password)
    else:
        return error_response(400, "Invalid Password")

    db.session.commit()
    return jsonify({"Success": "Password updated"}), 200

@bp.route('/user/<int:id>/password', methods=['PATCH'])
@admin_required
def change_password_admin(id):
    admin_email = get_jwt_identity()
    admin = User.query.filter_by(email=admin_email).first()
    if admin.id == id:
        return error_response(403, f"You can't change your own password with this end point")
    user = User.query.get(id)
    if not user:
        return error_response(404, f'Whoops! Could not find user with id {id}')
    new_password = request.json.get('newPassword', None)
    if not new_password:
        return error_response(400, "Missing callback parameter")
    user.set_password(new_password)
    db.session.commit()
    return jsonify({"Success": "Password updated"}), 200

@bp.route('/user/<int:id>/projects', methods=['GET'])
@admin_required
def get_client_projects(id):
    user = User.query.get(id)
    if not user:
        return error_response(404, f'Whoops! Could not find user with id {id}')
    client = Client.query.filter_by(notification_email=user.email).first()
    if not client:
        return error_response(404, f'Whoops! Could not find client for user {id}')
    projects = Project.query.filter_by(client_fk=client.id).all()
    if not projects:
        return error_response(204, f'Client {id} has no projects')
    project_list = [p.to_dict_minimal() for p in projects]
    return jsonify({'projects': project_list}), 200
