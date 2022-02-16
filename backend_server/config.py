import os
from datetime import timedelta
basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY') or b'\x112\xcb{\x98W\xe3\xf4\xcc\xe5\x859k\xb6\x8a\x02/\x1b\xbfj\xa4|V\xc5'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, '../db/local.db')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=3)
    MAIL_PORT = 587
    MAIL_USE_TLS = 1
    MAIL_SERVER = 'smtp.googlemail.com'
    MAIL_DEFAULT_SENDER = 'EMAIL_ADDRESS'
    MAIL_USERNAME = 'EMAIL_ACCOUNT_USERNAME'
    MAIL_PASSWORD = 'EMAIL_ACCOUNT_PASSWORD'
    WEBSITE_URL = 'example.com'
