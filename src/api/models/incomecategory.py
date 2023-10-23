from api.models.db import db

class IncomeCategory(db.Model):
    __tablename__='income_category'
    name = db.Column(db.String(80))
    id = db.Column(db.Integer, primary_key=True)

    def __repr__(self):
        return f'{self.name}'

    def serialize(self):
        return {
            "name": self.name,
            "id": self.id,
        }