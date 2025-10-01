from extensions import db
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from datetime import datetime


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    country = db.Column(db.String(80), nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'


class Game(db.Model):
    __tablename__ = 'games'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    opponent_type = db.Column(db.String(20), nullable=False)  # 'human' or 'computer'
    opponent_name = db.Column(db.String(80), nullable=True)  # for human opponent
    game_state = db.Column(db.JSON, nullable=False)  # board, racks, scores, etc.
    status = db.Column(db.String(20), default='ongoing')  # 'ongoing' or 'completed'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('games', lazy=True))

    def __repr__(self):
        return f'<Game {self.id} by {self.user.username}>'
