from flask_jwt_extended import verify_jwt_in_request, get_jwt_claims
from flask import current_app
from app.errors import error_response
from app import jwt
from functools import wraps

@jwt.user_identity_loader
def user_identity_lookup(user):
    return user.email

@jwt.user_claims_loader
def add_claims_to_access_token(user):
    return {'admin': user.is_admin()}

def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        claims = get_jwt_claims()
        if claims['admin']:
            return fn(*args, **kwargs)
        else:
            return error_response(403, "You do not have access to this!")
    return wrapper
