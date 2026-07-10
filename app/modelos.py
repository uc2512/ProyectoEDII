from app import db
from datetime import datetime
from zoneinfo import ZoneInfo
from flask_login import UserMixin

class Paciente(db.Model):
    __tablename__ = 'pacientes'
    carnet      = db.Column(db.String(20), primary_key=True)
    nombre      = db.Column(db.String(100), nullable=False)
    edad        = db.Column(db.Integer)
    contacto    = db.Column(db.String(254))
    sesiones    = db.relationship('Sesion', backref='paciente', lazy=True, cascade='all, delete-orphan')

class Sesion(db.Model):
    __tablename__ = 'sesiones'
    id           = db.Column(db.Integer, primary_key=True)
    carnet       = db.Column(db.String(20), db.ForeignKey('pacientes.carnet'), nullable=False)
    fecha        = db.Column(db.DateTime, default=lambda: datetime.now(ZoneInfo("America/La_Paz")))
    diagnostico  = db.Column(db.Text)
    tratamiento  = db.Column(db.Text)

class Usuario(UserMixin, db.Model):
    __tablename__ = 'usuarios'
    id       = db.Column(db.Integer, primary_key=True)
    usuario  = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)