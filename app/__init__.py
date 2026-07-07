from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from dotenv import load_dotenv
import os

load_dotenv()

db = SQLAlchemy()
login_manager = LoginManager()

def crear_app():
    app = Flask(__name__,
                template_folder='../plantillas',
                static_folder='../estatico')

    app.config['SECRET_KEY'] = os.getenv('CLAVE_SECRETA')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:1234@localhost:5432/HerboTrack"
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = 'rutas.login'

    from app.modelos import Usuario

    @login_manager.user_loader
    def cargar_usuario(id):
        return Usuario.query.get(int(id))

    from app.rutas import rutas
    app.register_blueprint(rutas)

    return app