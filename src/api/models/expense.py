from api.models.db import db

class Expense(db.Model):
    __tablename__='expense'
    id = db.Column(db.Integer, primary_key=True)

    value = db.Column(db.Float, nullable=False)

    category_id = db.Column(db.Integer, db.ForeignKey('category.id'))
    category = db.relationship('Category', backref='expense')

    dateTime = db.Column(db.DateTime(), unique=False, nullable=False)

    type_id = db.Column(db.Integer, db.ForeignKey('type.id'))
    type = db.relationship('Type', backref='expense')

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User', backref='expense')

    def __repr__(self):
        return f'{self.value}'

    def serialize(self):
        return {
            "id": self.id,
            "value": self.value,
            "category": self.category.serialize(),
            "dateTime": self.dateTime,
            "type": self.type.serialize(),
            "user": self.user.serialize()
        }