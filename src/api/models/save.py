from api.models.db import db

class Save (db.Model):
    __tablename__='save'
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User', backref='save')
    value = db.Column(db.Float, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('ocassional_category.id'))
    category = db.relationship('OcassionalCategory', backref='save')
    dateTime = db.Column(db.DateTime(), unique=False, nullable=False)
    id = db.Column(db.Integer, primary_key=True)

    def __repr__(self):
        return f'<Reserved {self.value}>'

    def serialize(self):
        return {
            "user": self.user.serialize(),
            "value": self.value,
            "category": self.category.serialize(),
            "dateTime": self.dateTime,
            "id": self.id,
        }