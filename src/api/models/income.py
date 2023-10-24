from api.models.db import db
class Income(db.Model):
    __tablename__='income'
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User', backref='income')
    value = db.Column(db.Float, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('income_category.id'))
    category = db.relationship('IncomeCategory', backref='income')
    dateTime = db.Column(db.DateTime(), unique=False, nullable=False)
    id = db.Column(db.Integer, primary_key=True)

    def __repr__(self):
        return f'{self.value}'

    def serialize(self):
        return {
            "user": self.user.serialize(),
            "value": self.value,
            "category": self.income_category.serialize(),
            "dateTime": self.dateTime,
            "id": self.id,
        }