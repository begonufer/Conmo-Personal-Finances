from api.models.db import db
class User(db.Model):
    __tablename__='user'
    name = db.Column(db.String, unique=False, nullable=False)
    surname = db.Column(db.String, unique=False, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    id = db.Column(db.Integer, primary_key=True)

    def __repr__(self):
        return f'{self.name}'

    def serialize(self):
        return {
            "name": self.name,
            "surname": self.surname,
            "email": self.email,
            "id": self.id,
        }
