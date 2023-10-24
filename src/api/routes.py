from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from datetime import datetime

from api.models.db import db
from api.models.user import User
from api.models.income import Income
from api.models.incomecategory import IncomeCategory
from api.models.fixedexpense import FixedExpense
from api.models.fixedcategory import FixedCategory
from api.models.ocassionalexpense import OcassionalExpense
from api.models.ocassionalcategory import OcassionalCategory
from api.models.save import Save

api = Blueprint('api', __name__)

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


#Registra a un usuario

@api.route('/user', methods= ['POST'])
def signup():
    user = User()
    user.name = request.json.get("name", None)
    user.surname = request.json.get("surname", None)
    user.email = request.json.get("email", None)
    user.password = request.json.get("password", None)
    db.session.add(user)
    db.session.commit()
    return jsonify(user.serialize()), 200


#Loguea a un usuario

@api.route('/user/login', methods= ['POST'])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    user = User.query.filter_by(email=email, password=password).first()
    if user is None:
        return jsonify({"msg": "Bad username or password"}), 401
    access_token = create_access_token(identity=user.id)
    return jsonify({ "token": access_token, "user_id": user.id })


#Esta ruta cambia el estado de logged

@api.route('/logged', methods=['GET'])
@jwt_required()
def is_logged():
    user_id = get_jwt_identity()
    if user_id:
        return jsonify({"Logged": True}), 200
    else:
        return jsonify({"Logged": False}), 401


# #Obtiene los datos del usuario
# @api.route('/user/id', methods= ['GET'])
# def get_user():


# #Elimina el usuario

# @api.route('/user/id', methods= ['PUT'])
# def update_user():


# #Actualiza los datos del usuario

# @api.route('/user/id', methods= ['DELETE'])
# def delete_user():


#Esta ruta obtiene las categorías de ingresos

@api.route('/incomecategories', methods=['GET'])
@jwt_required()
def get_incomecategories():
    return jsonify([incomecategory.serialize() for income_category in IncomeCategory.query.all()])


#Añade un ingreso

@api.route('/income', methods=['POST'])
@jwt_required()
def add_income():
    income = Income()
    income.user_id = get_jwt_identity()
    income.value = request.json.get("value",None)
    income.category_id = request.json.get("incomecategory_id",None)
    category = IncomeCategory.query.filter_by(id=income.category_id).first()
    income.category = category
    income.dateTime = datetime.strptime(request.json.get("dateTime"), "%Y-%m-%d").date()
    db.session.add(income)
    db.session.commit()
    return jsonify(income.serialize()),200


#Obtiene los ingresos

@api.route('/income', methods=['GET'])
@jwt_required()
def get_incomes():
    user_id = get_jwt_identity() 
    incomes = Income.query.filter_by(user_id=user_id).all()
    return jsonify([income.serialize() for income in incomes])


# #Actualiza los datos de un ingreso

# @api.route('/income/id', methods= ['PUT'])
# def update_income():


# #Elimina el ingreso

# @api.route('/income/id', methods= ['DELETE'])
# def delete_income():


# #Añade categorías de gastos fijos

# @api.route('/fixedcategories', methods=['POST'])
# @jwt_required()
# def add_fixed_categories():


#Obtiene las categorías de los gastos fijos

@api.route('/fixedcategories', methods=['GET'])
@jwt_required()
def get_fixed_categories():
    return jsonify([fixed_category.serialize() for fixed_category in FixedCategory.query.all()])

# #Elimina categorías de gastos fijos

# @api.route('/fixedcategories/id', methods=['DELETE'])
# @jwt_required()
# def delete_fixed_categories():


#Añade un gasto fijo

@api.route('/fixed/expense', methods=['POST'])
@jwt_required()
def add_fixed_expense():
    fixed_expense = FixedExpense()
    fixed_expense.user_id = get_jwt_identity()
    fixed_expense.value = request.json.get("value", None)
    fixed_expense.category_id = request.json.get("category_id", None)
    category = FixedExpense.query.filter_by(id=fixed_expense.category_id).first()
    fixed_expense.category = category
    fixed_expense.dateTime = datetime.strptime(request.json.get("dateTime"), "%Y-%m-%d").date()
    db.session.add(fixed_expense)
    db.session.commit()
    return jsonify(fixed_expense.serialize()),200


#Obtiene los gastos fijos

@api.route('/fixed/expense', methods=['GET'])
@jwt_required()
def get_fixed_expenses():
    user_id = get_jwt_identity()
    fixed_expenses = FixedExpense.query.filter_by(user_id = user_id).all()
    return jsonify([fixed_expense.serialize() for fixed_expense in fixed_expenses])


# #Actualiza los datos de un gasto fijo

# @api.route('/fixed/expense/id', methods= ['PUT'])
# def update_fixed_expense():


# #Elimina el gasto fijo

# @api.route('/fixed/expense/id', methods= ['DELETE'])
# def delete_fixed_expense():


# #Añade categorías de gastos ocasionales

# @api.route('/ocassionalcategories', methods=['POST'])
# @jwt_required()
# def add_ocassional_categories():


#Obtiene las categorías de los gastos ocasionales

@api.route('/ocassionalcategories', methods=['GET'])
@jwt_required()
def get_ocassional_categories():
    return jsonify([ocassional_category.serialize() for ocassional_category in OcassionalCategory.query.all()])

# #Elimina categorías de gastos ocasionales

# @api.route('/ocassionalcategories/id', methods=['DELETE'])
# @jwt_required()
# def delete_ocassional_categories():


#Añade un gasto ocasional

@api.route('/ocassional/expense', methods=['POST'])
@jwt_required()
def add_ocassional_expense():
    ocassional_expense = OcassionalExpense()
    ocassional_expense.user_id = get_jwt_identity()
    ocassional_expense.value = request.json.get("value", None)
    ocassional_expense.category_id = request.json.get("category_id", None)
    category = OcassionalExpense.query.filter_by(id=ocassional_expense.category_id).first()
    ocassional_expense.category = category
    ocassional_expense.dateTime = datetime.strptime(request.json.get("dateTime"), "%Y-%m-%d").date()
    db.session.add(ocassional_expense)
    db.session.commit()
    return jsonify(ocassional_expense.serialize()),200


#Obtiene los gastos ocasionales

@api.route('/ocassional/expense', methods=['GET'])
@jwt_required()
def get_ocassional_expenses():
    user_id = get_jwt_identity()
    ocassional_expenses = OcassionalExpense.query.filter_by(user_id = user_id).all()
    return jsonify([ocassional_expense.serialize() for ocassional_expense in ocassional_expenses])


# #Actualiza los datos de un gasto ocasional

# @api.route('/ocassional/expense/id', methods= ['PUT'])
# def update_ocassional_expense():


# #Elimina el gasto ocasional

# @api.route('/ocassional/expense/id', methods= ['DELETE'])
# def delete_ocassional_expense():


# #Añade un ahorro

# @api.route('/save', methods= ['POST'])
# def add_saves():


# #Obtiene los ahorros

# @api.route('/save', methods= ['GET'])
# def get_saves():








# @api.route('/types', methods=['GET'])
# @jwt_required()
# def get_types():
#     # all_types = Type.query.all()
#     # all_types_serialized = []
#     # for type in all_types: 
#     #     type.serialize()
#     #     all_types_serialized.append(type)
#     return jsonify([type.serialize() for type in Type.query.all()])