from flask import Blueprint, request, jsonify, session
from models import db, User
from schemas import user_schema, users_schema
from extensions import bcrypt

users_bp = Blueprint('users_bp', __name__)


@users_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    country = data.get('country')

    if not username or not password or not country:
        return jsonify({'error': 'Username, password, and country are required'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username,
                    password_hash=hashed_password, country=country)

    db.session.add(new_user)
    db.session.commit()

    result = user_schema.dump(new_user)
    return jsonify(result), 201


@users_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if user and bcrypt.check_password_hash(user.password_hash, password):
        session['user_id'] = user.id
        return jsonify(user_schema.dump(user))
    else:
        return jsonify({'error': 'Invalid username or password'}), 401


@users_bp.route('/check_session')
def check_session():
    user_id = session.get('user_id')
    if user_id:
        user = User.query.get(user_id)
        if user:
            return jsonify(user_schema.dump(user))
    return jsonify({'message': 'No user logged in'}), 401


@users_bp.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({'message': 'Successfully logged out'}), 200
