import os
from datetime import timedelta
basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY') or b'\x112\xcb{\x98W\xe3\xf4\xcc\xe5\x859k\xb6\x8a\x02/\x1b\xbfj\xa4|V\xc5'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = '${DB_URI}' 
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=3)
    MAIL_SERVER = '${MAIL_SERVER}'
    MAIL_PORT = 587
    MAIL_USE_TLS = 1
    MAIL_DEFAULT_SENDER = '${SYSTEM_EMAIL}'
    MAIL_USERNAME = '${SYSTEM_EMAIL}'
    MAIL_PASSWORD = '${SYSTEM_EMAIL_PASSWORD}'
    WEBSITE_URL = 'https://${DOMAIN_NAME}'
