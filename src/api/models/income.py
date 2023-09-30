from api.models.db import db
class Income(db.Model):
    __tablename__='income'
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.Float, nullable=False)
    incomecategory_id = db.Column(db.Integer, db.ForeignKey('incomecategory.id'))
    incomecategory = db.relationship('IncomeCategory', backref='income')
    dateTime = db.Column(db.DateTime(), unique=False, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User', backref='income')

    def __repr__(self):
        return f'{self.value}'

    def serialize(self):
        return {
            "id": self.id,
            "value": self.value,
            "incomecategory": self.incomecategory.serialize(),
            "dateTime": self.dateTime,
            "user": self.user.serialize()
        }