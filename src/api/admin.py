  
import os
from flask_admin import Admin
from api.models.user import User
from api.models.income import Income
from api.models.incomecategory import IncomeCategory
from api.models.fixed import Fixed
from api.models.fixedcategory import FixedCategory
from api.models.ocassional import Ocassional
from api.models.ocassionalcategory import OcassionalCategory
from api.models.save import Save
from api.models.usage import Usage
from api.models.db import db
from flask_admin.contrib.sqla import ModelView

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='Conmo Admin', template_mode='bootstrap3')

    
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Income, db.session))
    admin.add_view(ModelView(IncomeCategory, db.session))
    admin.add_view(ModelView(Fixed, db.session))
    admin.add_view(ModelView(FixedCategory, db.session))
    admin.add_view(ModelView(Ocassional, db.session))
    admin.add_view(ModelView(OcassionalCategory, db.session))
    admin.add_view(ModelView(Save, db.session))
    admin.add_view(ModelView(Usage, db.session))


    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))