  
import os
from flask_admin import Admin
from api.models.user import User
from api.models.income import Income
from api.models.expense import Expense
from api.models.category import Category
from api.models.incomecategory import IncomeCategory
from api.models.type import Type
from api.models.db import db
from flask_admin.contrib.sqla import ModelView

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='Conmo Admin', template_mode='bootstrap3')

    
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Income, db.session))
    admin.add_view(ModelView(Expense, db.session))
    admin.add_view(ModelView(Category, db.session))
    admin.add_view(ModelView(IncomeCategory, db.session))
    admin.add_view(ModelView(Type, db.session))


    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))