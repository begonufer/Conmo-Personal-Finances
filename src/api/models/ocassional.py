from api.models.db import db

class Ocassional(db.Model):
    __tablename__='ocassional'
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.Float, nullable=False)
    ocassionalcategory_id = db.Column(db.Integer, db.ForeignKey('ocassional_category.id'))
    ocassionalcategory = db.relationship('OcassionalCategory', backref='ocassional')
    dateTime = db.Column(db.DateTime(), unique=False, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User', backref='ocassional')

    def __repr__(self):
        return f'{self.value}'

    def serialize(self):
        return {
            "user": self.user.serialize(),
            "value": self.value,
            "ocassionalcategory": self.ocassionalcategory.serialize(),
            "dateTime": self.dateTime,
            "id": self.id,
        }