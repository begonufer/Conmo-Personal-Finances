from api.models.db import db

class Usage(db.Model):
    __tablename__='usage'
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.Float, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('ocassional_category.id'))
    category = db.relationship('OcassionalCategory', backref='usage')
    dateTime = db.Column(db.DateTime(), unique=False, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User', backref='usage')

    def __repr__(self):
        return f'{self.value}'

    def serialize(self):
        return {
            "user": self.user.serialize(),
            "value": self.value,
            "category": self.category.serialize(),
            "dateTime": self.dateTime,
            "id": self.id,
        }