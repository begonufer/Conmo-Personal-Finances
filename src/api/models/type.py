from api.models.db import db

class Type(db.Model):
    __tablename__='type'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)

    def __repr__(self):
        return f'{self.name}'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name
        }