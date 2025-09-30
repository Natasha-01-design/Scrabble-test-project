from flask import Flask
from flask_migrate import Migrate
from flask_cors import CORS
from extensions import db, ma, bcrypt


def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

    db.init_app(app)
    ma.init_app(app)
    bcrypt.init_app(app)

    migrate = Migrate(app, db)
    CORS(app, resources={
         r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

    from routes.user_routes import users_bp
    app.register_blueprint(users_bp)

    @app.route('/')
    def index():
        return '<h1>Scrabble Game Backend</h1>'

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(port=5555, debug=True)
