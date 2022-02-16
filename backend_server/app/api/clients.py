from app import db
from app.api import bp
from app.errors import error_response
from app.models import Client, User, Project
from flask import jsonify
from app.jwt_functions import admin_required, get_jwt_claims
from flask_jwt_extended import jwt_required, get_jwt_identity

@bp.route('/client', methods=['GET'])
@admin_required
def get_clients():
    client_list = Client.query.all()
    if not client_list:
        return error_response(404, 'Whoops! Could not find any clients')

    user_email_list = [user.email for user in User.query.all()]
    if not user_email_list:
        return error_response(404, 'Whoops! Could not find any users')
    contains = lambda x : x.notification_email not in user_email_list
    false = lambda x : False
    filtered_clients = filter(contains, client_list)
    if not filtered_clients:
        return jsonify({'client_list': []}), 204
    return jsonify({'client_list': [c.to_dict_minimal() for c in filtered_clients]})

@bp.route('/client/<int:id>', methods=['GET'])
@admin_required
def get_client(id):
    client = Client.query.get(id)
    if not client:
        return error_response(404, f'Whoops! Could not find client with id {id}')
    try:
        client_dict = client.to_dict()
    except:
        return error_response(404, 'Whoops! Something broke getting the client')
    return jsonify(client_dict), 200
