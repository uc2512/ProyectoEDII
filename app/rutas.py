from flask import Blueprint, request, jsonify, render_template, redirect, url_for
from flask_login import login_user, logout_user, login_required, current_user
from app import db
from app.modelos import Paciente, Sesion, Usuario
from datetime import timedelta

rutas = Blueprint('rutas', __name__)

from app.arbol_busqueda import ArbolPacientes
arbol = ArbolPacientes()

@rutas.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        datos = request.json
        usuario = Usuario.query.filter_by(usuario=datos['usuario']).first()
        if usuario and usuario.password == datos['password']:
            login_user(usuario)
            return jsonify({'ok': True})
        return jsonify({'ok': False, 'mensaje': 'Usuario o contraseña incorrectos'}), 401
    return render_template('login.html')

@rutas.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('rutas.login'))

@rutas.route('/')
@login_required
def inicio():
    return render_template('inicio.html')

@rutas.route('/paciente', methods=['POST'])
@login_required
def registrar_paciente():
    datos = request.json
    if Paciente.query.get(datos['carnet']):
        return jsonify({'mensaje': 'Paciente ya existe'}), 400
    nuevo = Paciente(**datos)
    db.session.add(nuevo)
    db.session.commit()
    arbol.insertar(datos['carnet'], datos['nombre'], datos)
    return jsonify({'mensaje': 'Paciente registrado'}), 201

@rutas.route('/paciente/<carnet>', methods=['GET'])
@login_required
def buscar_paciente(carnet):
    paciente = Paciente.query.get(carnet)
    if not paciente:
        return jsonify({'mensaje': 'No encontrado'}), 404
    return jsonify({
        'nombre': paciente.nombre,
        'edad': paciente.edad,
        'contacto': paciente.contacto
    })

@rutas.route('/paciente/<carnet>/sesion', methods=['POST'])
@login_required
def agregar_sesion(carnet):
    datos = request.json
    sesion = Sesion(
        carnet=carnet,
        diagnostico=datos['diagnostico'],
        tratamiento=datos['tratamiento']
    )
    db.session.add(sesion)
    db.session.commit()
    return jsonify({'mensaje': 'Sesión registrada'}), 201

@rutas.route('/paciente/<carnet>/sesiones', methods=['GET'])
@login_required
def ver_sesiones(carnet):
    paciente = Paciente.query.get(carnet)
    if not paciente:
        return jsonify({'mensaje': 'Paciente no encontrado'}), 404

    sesiones = [{
        'fecha': (s.fecha - timedelta(hours=4)).strftime('%d/%m/%Y %H:%M'),
        'diagnostico': s.diagnostico,
        'tratamiento': s.tratamiento
    } for s in paciente.sesiones]

    return jsonify({
        'nombre': paciente.nombre,
        'sesiones': sesiones
    })

@rutas.route('/historial/<carnet>')
@login_required
def historial(carnet):
    return render_template('paciente.html', carnet=carnet)

@rutas.route('/paciente/<carnet>', methods=['DELETE'])
@login_required
def eliminar_paciente(carnet):
    paciente = Paciente.query.get(carnet)
    if not paciente:
        return jsonify({'mensaje': 'Paciente no encontrado'}), 404
    db.session.delete(paciente)
    db.session.commit()
    return jsonify({'mensaje': 'Paciente eliminado'})

@rutas.route('/paciente/<carnet>', methods=['PUT'])
@login_required
def editar_paciente(carnet):
    paciente = Paciente.query.get(carnet)
    if not paciente:
        return jsonify({'mensaje': 'Paciente no encontrado'}), 404
    datos = request.json
    paciente.edad = datos.get('edad', paciente.edad)
    paciente.contacto = datos.get('contacto', paciente.contacto)
    db.session.commit()
    return jsonify({'mensaje': 'Paciente actualizado'})