from api.models.db import db

class FixedCategory(db.Model):
    __tablename__='fixed_category'
    name = db.Column(db.String(80))
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User', backref='fixed_category')

    def __repr__(self):
        return f'{self.name}'

    def serialize(self):
        return {
            "name": self.name,
            "id": self.id,
            "user": self.user.serialize(),
        }