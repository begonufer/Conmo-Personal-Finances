from api.models.db import db

class FixedExpense(db.Model):
    __tablename__='fixed_expense'
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User', backref='fixed_expense')
    value = db.Column(db.Float, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('fixed_category.id'))
    category = db.relationship('FixedCategory', backref='fixed_expense')
    dateTime = db.Column(db.DateTime(), unique=False, nullable=False)
    id = db.Column(db.Integer, primary_key=True)

    def __repr__(self):
        return f'{self.value}'

    def serialize(self):
        return {
            "user": self.user.serialize(),
            "value": self.value,
            "category": self.fixed_category.serialize(),
            "dateTime": self.dateTime,            
            "id": self.id,
        }