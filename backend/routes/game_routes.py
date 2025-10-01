from flask import Blueprint, request, jsonify, session
from models import db, Game, User
import json

game_bp = Blueprint('game_bp', __name__)

def get_current_user():
    user_id = session.get('user_id')
    if not user_id:
        return None
    return User.query.get(user_id)

@game_bp.route('/save_game', methods=['POST'])
def save_game():
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    data = request.get_json()
    game_state = data.get('game_state')
    opponent_type = data.get('opponent_type')
    opponent_name = data.get('opponent_name', None)
    status = data.get('status', 'ongoing')

    if not game_state or not opponent_type:
        return jsonify({'error': 'Missing game state or opponent type'}), 400

    # Check if there is an ongoing game for this user
    game = Game.query.filter_by(user_id=user.id, status='ongoing').first()
    if game:
        game.game_state = game_state
        game.opponent_type = opponent_type
        game.opponent_name = opponent_name
        game.status = status
    else:
        game = Game(
            user_id=user.id,
            game_state=game_state,
            opponent_type=opponent_type,
            opponent_name=opponent_name,
            status=status
        )
        db.session.add(game)

    db.session.commit()
    return jsonify({'message': 'Game saved successfully'}), 200

@game_bp.route('/load_game', methods=['GET'])
def load_game():
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    game = Game.query.filter_by(user_id=user.id, status='ongoing').first()
    if not game:
        return jsonify({'message': 'No ongoing game found'}), 404

    return jsonify({
        'game_state': game.game_state,
        'opponent_type': game.opponent_type,
        'opponent_name': game.opponent_name,
        'status': game.status
    }), 200

@game_bp.route('/complete_game', methods=['POST'])
def complete_game():
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    data = request.get_json()
    game_id = data.get('game_id')
    if not game_id:
        return jsonify({'error': 'Missing game id'}), 400

    game = Game.query.get(game_id)
    if not game or game.user_id != user.id:
        return jsonify({'error': 'Game not found or unauthorized'}), 404

    game.status = 'completed'
    db.session.commit()
    return jsonify({'message': 'Game marked as completed'}), 200
