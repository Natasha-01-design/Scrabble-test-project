from extensions import db
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    country = db.Column(db.String(80), nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'
