from api.models.db import db

class Fixed(db.Model):
    __tablename__='fixed'
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.Float, nullable=False)
    fixedcategory_id = db.Column(db.Integer, db.ForeignKey('fixed_category.id'))
    fixedcategory = db.relationship('FixedCategory', backref='fixed')
    dateTime = db.Column(db.DateTime(), unique=False, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User', backref='fixed')

    def __repr__(self):
        return f'{self.value}'

    def serialize(self):
        return {
            "user": self.user.serialize(),
            "value": self.value,
            "fixedcategory": self.fixedcategory.serialize(),
            "dateTime": self.dateTime,
            "id": self.id,
        }