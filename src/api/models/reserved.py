from api.models.db import db

class Reserved (db.Model):
    __tablename__='reserved'
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(80), unique=False, nullable=False)
    description = db.Column(db.String(80), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __repr__(self):
        return f'<Reserved {self.value}>'

    def serialize(self):
        return {
            "id": self.id,
            "value": self.value,
            "category": self.category,
            "description": self.description,
        }