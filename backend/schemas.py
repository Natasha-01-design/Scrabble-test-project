from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from models import User
from extensions import ma


class UserSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        exclude = ('password_hash',)


user_schema = UserSchema()
users_schema = UserSchema(many=True)
