from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_mail import Mail
from config import Config

db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()
mail = Mail()

def create_app(config_class=Config):
    app = Flask(__name__)

    CORS(app)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)

    jwt.init_app(app)

    mail.init_app(app)

    from app.api import bp as api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    from app.auth import bp as auth_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')

    return app

from app import models
from app.jwt_functions import user_identity_lookup
