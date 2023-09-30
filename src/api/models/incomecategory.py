from api.models.db import db

class IncomeCategory(db.Model):
    __tablename__='incomecategory'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80))

    def __repr__(self):
        return f'{self.name}'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name
        }