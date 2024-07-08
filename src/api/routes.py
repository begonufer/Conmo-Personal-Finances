from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from datetime import datetime, timedelta
from sqlalchemy import union_all
import json
import os

from api.models.db import db
from api.models.user import User
from api.models.income import Income
from api.models.incomecategory import IncomeCategory
from api.models.fixed import Fixed
from api.models.fixedcategory import FixedCategory
from api.models.ocassional import Ocassional
from api.models.ocassionalcategory import OcassionalCategory
from api.models.save import Save
from api.models.usage import Usage

api = Blueprint('api', __name__)

TEST_USER = "testuser"
TEST_USER_FILE = os.path.join(os.path.dirname(__file__), 'testuser.json')
TEMP_CHANGES_EXPIRATION_HOURS = 4

# Funciones para manejar json para el testuser
def load_test_user_data():
    if os.path.exists(TEST_USER_FILE):
        with open(TEST_USER_FILE, 'r') as file:
            return json.load(file)
    else:
        return {}

def save_test_user_data(data):
    with open(TEST_USER_FILE, 'w') as file:
        json.dump(data, file, default=str)

def is_test_user():
    user_id = get_jwt_identity()
    return user_id == 'testuser'

def apply_temporary_changes(data):
    current_time = datetime.now()
    groups = ['incomes', 'saves', 'usages', 'fixes', 'ocassionals']
    for group in groups:
        if group in data:
            updated_group = []
            for entry in data[group]:
                if 'timestamp' in entry:
                    change_time = datetime.fromisoformat(entry['timestamp'])
                    if current_time - change_time < timedelta(hours=TEMP_CHANGES_EXPIRATION_HOURS):
                        updated_group.append(entry)
                else:
                    updated_group.append(entry)
            data[group] = updated_group
    return data

def add_temporary_change(data, change, group):
    if group not in data:
        data[group] = []
    change['timestamp'] = datetime.now().isoformat()
    data[group].append(change)
    return data

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

    if email == TEST_USER and password == TEST_USER:
        access_token = create_access_token(identity=TEST_USER)
        return jsonify({ "token": access_token, "user_id": TEST_USER })

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


#Esta ruta obtiene las categorías de ingresos

@api.route('/incomecategories', methods=['GET'])
@jwt_required()
def get_incomecategories():
    user_id = get_jwt_identity()
    if is_test_user():
        data = load_test_user_data()
        return jsonify(data.get("income_categories", [])), 200
    return jsonify([income_category.serialize() for income_category in IncomeCategory.query.filter_by(user_id=user_id).all()])

#Esta ruta obtiene las categorías de fijos

@api.route('/fixedcategories', methods=['GET'])
@jwt_required()
def get_fixedcategories():
    user_id = get_jwt_identity()
    if is_test_user():
        data = load_test_user_data()
        return jsonify(data.get("fixed_categories", [])), 200
    return jsonify([fixed_category.serialize() for fixed_category in FixedCategory.query.filter_by(user_id=user_id).all()])

#Esta ruta obtiene las categorías de gastos ocasionales

@api.route('/ocassionalcategories', methods=['GET'])
@jwt_required()
def get_ocassionalcategories():
    user_id = get_jwt_identity()
    if is_test_user():
        data = load_test_user_data()
        return jsonify(data.get("ocassional_categories", [])), 200
    return jsonify([ocassional_category.serialize() for ocassional_category in OcassionalCategory.query.filter_by(user_id=user_id).all()])

# Añade un ingreso
@api.route('/income', methods=['POST'])
@jwt_required()
def add_income():
    user_id = get_jwt_identity()
    data = load_test_user_data()

    new_income = {
        "dateTime": request.json.get("dateTime", None),
        "id": len(data.get("incomes", [])) + 1,
        "incomecategory": {
            "id": int(request.json.get("incomecategory_id", None)),
            "name": request.json.get("incomecategory_name", None),
            "user": {
                "email": "testuser",
                "id": "testuser",
                "name": "testuser",
                "surname": "testuser"
            }
        },
        "user": {
            "email": "testuser",
            "id": "testuser",
            "name": "testuser",
            "surname": "testuser"
        },
        "value": float(request.json.get("value", None))
    }

    if is_test_user():
        data = apply_temporary_changes(data)
        data = add_temporary_change(data, new_income, 'incomes')
        save_test_user_data(data)
        return jsonify(new_income), 200

    income = Income()
    income.user_id = user_id
    income.value = request.json.get("value", None)
    income.incomecategory_id = request.json.get("incomecategory_id", None)
    incomecategory = IncomeCategory.query.filter_by(id=income.incomecategory_id).first()
    income.incomecategory = incomecategory
    income.dateTime = datetime.strptime(request.json.get("dateTime"), "%Y-%m-%d").date()
    db.session.add(income)
    db.session.commit()
    return jsonify(income.serialize()), 200

# Añade un ahorro 

@api.route('/save', methods=['POST'])
@jwt_required()
def add_saves():
    user_id = get_jwt_identity()
    data = load_test_user_data()

    new_save = {
        "dateTime": request.json.get("dateTime"),
        "id": len(data.get("saves", [])) + 1,
        "category": {
            "id":  int(request.json.get("ocassionalcategory_id", None)),
            "name": request.json.get("ocassionalcategory_name", None),
            "user": {
                "email": "testuser",
                "id": "testuser",
                "name": "testuser",
                "surname": "testuser"
            }
        },
        "user": {
            "email": "testuser",
            "id": "testuser",
            "name": "testuser",
            "surname": "testuser"
        },
        "value": float(request.json.get("value", None))
    }

    if is_test_user():
        data = apply_temporary_changes(data)
        data = add_temporary_change(data, new_save, 'saves')
        save_test_user_data(data)
        return jsonify(new_save), 200

    value = request.json.get("value")
    ocassionalcategory_id = request.json.get("ocassionalcategory_id")
    datetime_str = request.json.get("dateTime")

    category = OcassionalCategory.query.get(ocassionalcategory_id)
    if not category:
        return jsonify({"error": "Categoría ocasional no encontrada"}), 404

    save = Save(
        user_id=user_id,
        value=value,
        category=category,
        dateTime=datetime.strptime(datetime_str, "%Y-%m-%d").date()
    )

    db.session.add(save)
    db.session.commit()

    return jsonify(save.serialize()), 200


# Añade un uso de reservado

@api.route('/usage', methods=['POST'])
@jwt_required()
def add_usages():
    try:
        user_id = get_jwt_identity()
        data = load_test_user_data()

        new_usage = {
            "dateTime": request.json.get("dateTime"),
            "id": len(data.get("usages", [])) + 1,
            "category": {
                "id":  int(request.json.get("ocassionalcategory_id", None)),
                "name": request.json.get("ocassionalcategory_name", None),
                "user": {
                    "email": "testuser",
                    "id": "testuser",
                    "name": "testuser",
                    "surname": "testuser"
                }
            },
            "user": {
                "email": "testuser",
                "id": "testuser",
                "name": "testuser",
                "surname": "testuser"
            },
            "value": float(request.json.get("value", None))
        }

        if is_test_user():
            data = apply_temporary_changes(data)
            data = add_temporary_change(data, new_usage, 'usages')
            save_test_user_data(data)
            return jsonify(new_usage), 200

        value = request.json.get("value")
        ocassionalcategory_id = request.json.get("ocassionalcategory_id")
        datetime_str = request.json.get("dateTime")

        category = OcassionalCategory.query.get(ocassionalcategory_id)
        if not category:
            return jsonify({"error": "Categoría ocasional no encontrada"}), 404

        usage = Usage(
            user_id=user_id,
            value=value,
            category=category,
            dateTime=datetime.strptime(datetime_str, "%Y-%m-%d").date()
        )

        db.session.add(usage)
        db.session.commit()

        return jsonify(save.serialize()), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/fixed', methods=['POST'])
@jwt_required()
def add_fixed():
    try:
        user_id = get_jwt_identity()
        data = load_test_user_data()

        new_fixed = {
            "dateTime": request.json.get("dateTime", None),
            "id": len(data.get("fixes", [])) + 1,
            "fixedcategory": {
                "id": int(request.json.get("fixedcategory_id", None)),
                "name": request.json.get("fixedcategory_name", None),
                "user": {
                    "email": "testuser",
                    "id": "testuser",
                    "name": "testuser",
                    "surname": "testuser"
                }
            },
            "user": {
                "email": "testuser",
                "id": "testuser",
                "name": "testuser",
                "surname": "testuser"
            },
            "value": float(request.json.get("value", None))
        }

        if is_test_user():
            data = apply_temporary_changes(data)
            data = add_temporary_change(data, new_fixed, 'fixes')
            save_test_user_data(data)
            return jsonify(new_fixed), 200

        fixed = Fixed()
        fixed.user_id = get_jwt_identity()
        fixed.value = request.json.get("value",None)    
        fixed.fixedcategory_id = request.json.get("fixedcategory_id",None)
        fixedcategory = FixedCategory.query.filter_by(id=fixed.fixedcategory_id).first()
        fixed.fixedcategory = fixedcategory
        fixed.dateTime = datetime.strptime(request.json.get("dateTime"), "%Y-%m-%d").date()
        db.session.add(fixed)
        db.session.commit()
        return jsonify(fixed.serialize()),200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

#Añade un gasto ocasional

@api.route('/ocassional', methods=['POST'])
@jwt_required()
def add_ocassional():
    try:
        user_id = get_jwt_identity()
        data = load_test_user_data()

        new_ocassional = {
            "dateTime": request.json.get("dateTime", None),
            "id": len(data.get("ocassionals", [])) + 1,
            "ocassionalcategory": {
                "id": int(request.json.get("ocassionalcategory_id", None)),
                "name": request.json.get("ocassionalcategory_name", None),
                "user": {
                    "email": "testuser",
                    "id": "testuser",
                    "name": "testuser",
                    "surname": "testuser"
                }
            },
            "user": {
                "email": "testuser",
                "id": "testuser",
                "name": "testuser",
                "surname": "testuser"
            },
            "value": float(request.json.get("value", None))
        }

        if is_test_user():
            data = apply_temporary_changes(data)
            data = add_temporary_change(data, new_ocassional, 'ocassionals')
            save_test_user_data(data)
            return jsonify(new_ocassional), 200

        ocassional = Ocassional()
        ocassional.user_id = get_jwt_identity()
        ocassional.value = request.json.get("value",None)    
        ocassional.ocassionalcategory_id = request.json.get("ocassionalcategory_id",None)
        ocassionalcategory = OcassionalCategory.query.filter_by(id=ocassional.ocassionalcategory_id).first()
        ocassional.ocassionalcategory = ocassionalcategory
        ocassional.dateTime = datetime.strptime(request.json.get("dateTime"), "%Y-%m-%d").date()
        db.session.add(ocassional)
        db.session.commit()
        return jsonify(ocassional.serialize()),200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Obtiene los ingresos
@api.route('/income', methods=['GET'])
@jwt_required()
def get_incomes():
    user_id = get_jwt_identity()
    if is_test_user():
        data = load_test_user_data()
        incomes = data.get("incomes", [])
        return jsonify(incomes), 200
    
    incomes = Income.query.filter_by(user_id=user_id).order_by(Income.dateTime).all()
    return jsonify([income.serialize() for income in incomes]), 200
    
@api.route('/save', methods=['GET'])
@jwt_required()
def get_saves():
    user_id = get_jwt_identity()
    if is_test_user():
        data = load_test_user_data()
        saves = data.get("saves", [])
        return jsonify(saves), 200

    saves = Save.query.filter_by(user_id=user_id).all()
    return jsonify([save.serialize() for save in saves]), 200

@api.route('/usage', methods=['GET'])
@jwt_required()
def get_usages():
    user_id = get_jwt_identity()
    if is_test_user():
        data = load_test_user_data()
        usages = data.get("usages", [])
        return jsonify(usages), 200

    usages = Usage.query.filter_by(user_id=user_id).all()
    return jsonify([usage.serialize() for usage in usages]), 200

# Obtiene los gastos fijos
@api.route('/fixed', methods=['GET'])
@jwt_required()
def get_fixes():
    user_id = get_jwt_identity()
    if is_test_user():
        data = load_test_user_data()
        fixes = data.get("fixes", [])
        return jsonify(fixes), 200

    fixes = Fixed.query.filter_by(user_id=user_id).all()
    return jsonify([fixed.serialize() for fixed in fixes]), 200

# Obtiene los gastos ocasionales
@api.route('/ocassional', methods=['GET'])
@jwt_required()
def get_ocassionals():
    user_id = get_jwt_identity()
    if is_test_user():
        data = load_test_user_data()
        ocassionals = data.get("ocassionals", [])
        return jsonify(ocassionals), 200

    ocassionals = Ocassional.query.filter_by(user_id=user_id).all()
    return jsonify([ocassional.serialize() for ocassional in ocassionals]), 200

@api.route('/ocassionalcategory', methods=['POST'])
@jwt_required()
def add_ocassional_category():
    try:
        user_id = get_jwt_identity()
        data = load_test_user_data()

        new_category = {
            "id": len(data.get("ocassional_categories", [])) + 1,
            "name": request.json.get("value", None),
            "user_id": "testuser"
        }

        if is_test_user():
            data = apply_temporary_changes(data)
            data = add_temporary_change(data, new_category, 'ocassional_categories')
            save_test_user_data(data)
            return jsonify(new_category), 200

        category_name = request.json.get("value", None)

        if not category_name:
            return jsonify({"error": "Nombre de categoría necesario"}), 400

        category = OcassionalCategory(name=category_name, user_id=user_id)
        db.session.add(category)
        db.session.commit()

        return jsonify(category.serialize()), 201
        
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Error al agregar la categoría ocasional"}), 500


@api.route('/fixedcategory', methods=['POST'])
@jwt_required()
def add_fixed_category():
    try:
        user_id = get_jwt_identity()
        data = load_test_user_data()

        new_category = {
            "id": len(data.get("fixed_categories", [])) + 1,
            "name": request.json.get("value", None),
            "user_id": "testuser"
        }

        if is_test_user():
            data = apply_temporary_changes(data)
            data = add_temporary_change(data, new_category, 'fixed_categories')
            save_test_user_data(data)
            return jsonify(new_category), 200

        category_name = request.json.get("value", None)

        if not category_name:
            return jsonify({"error": "Nombre de categoría necesario"}), 400

        category = FixedCategory(name=category_name, user_id=user_id)
        db.session.add(category)
        db.session.commit()

        return jsonify(category.serialize()), 201

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Error al agregar la categoría fijo"}), 500


@api.route('/incomecategory', methods=['POST'])
@jwt_required()
def add_income_category():
    try:
        user_id = get_jwt_identity()
        data = load_test_user_data()

        new_category = {
            "id": len(data.get("income_categories", [])) + 1,
            "name": request.json.get("value", None),
            "user_id": "testuser"
        }

        if is_test_user():
            data = apply_temporary_changes(data)
            data = add_temporary_change(data, new_category, 'income_categories')
            save_test_user_data(data)
            return jsonify(new_category), 200

        category_name = request.json.get("value", None)

        if not category_name:
            return jsonify({"error": "Nombre de categoría necesario"}), 400

        category = IncomeCategory(name=category_name, user_id=user_id)
        db.session.add(category)
        db.session.commit()

        return jsonify(category.serialize()), 201
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Error al agregar la categoría ingreso"}), 500


@api.route('/fixedcategory/<int:fixedcategory_id>', methods=['DELETE'])
@jwt_required()
def delete_fixed_category(fixedcategory_id):
    try:
        user_id = get_jwt_identity()

        if is_test_user():
            data = load_test_user_data()
            fixed_categories = data.get("fixed_categories", [])
            category_to_delete = next((category for category in fixed_categories if category["id"] == fixedcategory_id and "timestamp" in category), None)
            
            if not category_to_delete:
                return jsonify({"error": "Fixed category not found or does not have a timestamp"}), 404
            
            data["fixed_categories"] = [category for category in fixed_categories if category["id"] != fixedcategory_id or "timestamp" not in category]
            save_test_user_data(data)
            
            return jsonify({"message": "Category deleted successfully"}), 200

        category_to_delete = FixedCategory.query.filter_by(id=fixedcategory_id, user_id=user_id).first()
        if not category_to_delete:
            return jsonify({"error": "Fixed category not found"}), 404
        
        db.session.delete(category_to_delete)
        db.session.commit()

        return jsonify({"message": "Category deleted successfully"}), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@api.route('/ocassionalcategory/<int:ocassionalcategory_id>', methods=['DELETE'])
@jwt_required()
def delete_ocassional_category(ocassionalcategory_id):
    try:
        user_id = get_jwt_identity()

        if is_test_user():
            data = load_test_user_data()
            ocassional_categories = data.get("ocassional_categories", [])
            category_to_delete = next((category for category in ocassional_categories if category["id"] == ocassionalcategory_id and "timestamp" in category), None)
            
            if not category_to_delete:
                return jsonify({"error": "ocassional category not found or does not have a timestamp"}), 404
            
            data["ocassional_categories"] = [category for category in ocassional_categories if category["id"] != ocassionalcategory_id or "timestamp" not in category]
            save_test_user_data(data)
            
            return jsonify({"message": "Category deleted successfully"}), 200

        category_to_delete = OcassionalCategory.query.filter_by(id=ocassionalcategory_id, user_id=user_id).first()
        if not category_to_delete:
            return jsonify({"error": "Ocassional category not found"}), 404
        db.session.delete(category_to_delete)
        db.session.commit()

        return jsonify({"message": "Category delete succesfully"}), 200
    except Exception as e:
        traceback.print_exc()


@api.route('/incomecategory/<int:incomecategory_id>', methods=['DELETE'])
@jwt_required()
def delete_income_category(incomecategory_id):
    try:
        user_id = get_jwt_identity()

        if is_test_user():
            data = load_test_user_data()
            income_categories = data.get("income_categories", [])
            category_to_delete = next((category for category in income_categories if category["id"] == incomecategory_id and "timestamp" in category), None)
            
            if not category_to_delete:
                return jsonify({"error": "income category not found or does not have a timestamp"}), 404
            
            data["income_categories"] = [category for category in income_categories if category["id"] != incomecategory_id or "timestamp" not in category]
            save_test_user_data(data)
            
            return jsonify({"message": "Category deleted successfully"}), 200

        category_to_delete = IncomeCategory.query.filter_by(id=incomecategory_id, user_id=user_id).first()
        if not category_to_delete:
            return jsonify({"error": "Income category not found"}), 404
        db.session.delete(category_to_delete)
        db.session.commit()

        return jsonify({"message": "Category delete succesfully"}), 200
    except Exception as e:
        traceback.print_exc()

@api.route('/ocassionalcategory/<int:ocassionalcategory_id>', methods=['PUT'])
@jwt_required()
def modify_ocassional_category(ocassionalcategory_id):
    try:
        user_id = get_jwt_identity()

        if is_test_user():
            data = load_test_user_data()
            categories = data.get("ocassional_categories", [])
            category_to_modify = next((category for category in categories if category["id"] == ocassionalcategory_id and "timestamp" in category), None)
            
            if not category_to_modify:
                return jsonify({"error": "Ocassional category not found or does not have a timestamp"}), 404
            
            new_name = request.json.get("name")
            if not new_name:
                return jsonify({"error": "Name of category is required"}), 400
            
            category_to_modify["name"] = new_name
            save_test_user_data(data)
            
            return jsonify(category_to_modify), 200

        category_to_modify = OcassionalCategory.query.filter_by(id=ocassionalcategory_id, user_id=user_id).first()
        
        if not category_to_modify:
            return jsonify({"error": "Ocassional category not found"}), 404
        
        new_name = request.json.get("name")
        if not new_name:
            return jsonify({"error": "Name of category is required"}), 400
        
        category_to_modify.name = new_name
        db.session.commit()

        return jsonify(category_to_modify.serialize()), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@api.route('/fixedcategory/<int:fixedcategory_id>', methods=['PUT'])
@jwt_required()
def modify_fixed_category(fixedcategory_id):
    try:
        user_id = get_jwt_identity()

        if is_test_user():
            data = load_test_user_data()
            categories = data.get("fixed_categories", [])
            category_to_modify = next((category for category in categories if category["id"] == fixedcategory_id and "timestamp" in category), None)
            
            if not category_to_modify:
                return jsonify({"error": "Fixed category not found or does not have a timestamp"}), 404
            
            new_name = request.json.get("name")
            if not new_name:
                return jsonify({"error": "Name of category is required"}), 400
            
            category_to_modify["name"] = new_name
            save_test_user_data(data)
            
            return jsonify(category_to_modify), 200

        category_to_modify = FixedCategory.query.filter_by(id=fixedcategory_id, user_id=user_id).first()
        
        if not category_to_modify:
            return jsonify({"error": "Fixed category not found"}), 404
        
        new_name = request.json.get("name")
        if not new_name:
            return get_error_response("Name of category is required", 400)

        category_to_modify.name = new_name
        db.session.commit()

        return jsonify(category_to_modify.serialize()), 200

    except Exception as e:
        traceback.print_exc()
        return get_error_response("Error in modifying category", 500)

@api.route('/incomecategory/<int:incomecategory_id>', methods=['PUT'])
@jwt_required()
def modify_income_category(incomecategory_id):
    try:
        user_id = get_jwt_identity()

        if is_test_user():
            data = load_test_user_data()
            categories = data.get("income_categories", [])
            category_to_modify = next((category for category in categories if category["id"] == incomecategory_id and "timestamp" in category), None)
            
            if not category_to_modify:
                return jsonify({"error": "Income category not found or does not have a timestamp"}), 404
            
            new_name = request.json.get("name")
            if not new_name:
                return jsonify({"error": "Name of category is required"}), 400
            
            category_to_modify["name"] = new_name
            save_test_user_data(data)
            
            return jsonify(category_to_modify), 200

        category_to_modify = IncomeCategory.query.filter_by(id=incomecategory_id, user_id=user_id).first()
        
        if not category_to_modify:
            return jsonify({"error": "Income category not found"}), 404
        
        new_name = request.json.get("name")
        if not new_name:
            return get_error_response("Name of category is required", 400)

        category_to_modify.name = new_name
        db.session.commit()

        return jsonify(category_to_modify.serialize()), 200

    except Exception as e:
        traceback.print_exc()
        return get_error_response("Error in modifying category", 500)

@api.route('/incomes/<int:incomecategory_id>', methods=['GET'])
@jwt_required()
def get_movements_by_incomecategory(incomecategory_id):
    try:
        user_id = get_jwt_identity()
        income_category = IncomeCategory.query.filter_by(id=incomecategory_id, user_id=user_id).first()
        if not income_category:
            return jsonify({"error": "Income category not found"}), 404
        movements = Income.query.filter_by(incomecategory_id=incomecategory_id, user_id=user_id).all()
        return jsonify([movement.serialize() for movement in movements]), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

@api.route('/fixed/<int:fixedcategory_id>', methods=['GET'])
@jwt_required()
def get_movements_by_fixedcategory(fixedcategory_id):
    try:
        user_id = get_jwt_identity()
        fixed_category = FixedCategory.query.filter_by(id=fixedcategory_id, user_id=user_id).first()
        if not fixed_category:
            return jsonify({"error": "Fixed category not found"}), 404
        movements = Fixed.query.filter_by(fixedcategory_id=fixedcategory_id, user_id=user_id).all()
        return jsonify([movement.serialize() for movement in movements]), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

@api.route('/ocassionals/<int:ocassionalcategory_id>', methods=['GET'])
@jwt_required()
def get_movements_by_ocassionalcategory(ocassionalcategory_id):
    try:
        user_id = get_jwt_identity()
        ocassional_category = OcassionalCategory.query.filter_by(id=ocassionalcategory_id, user_id=user_id).first()
        
        if not ocassional_category:
            return jsonify({"error": "Category not found"}), 404
        
        ocassional_movements = Ocassional.query.filter_by(ocassionalcategory_id=ocassionalcategory_id, user_id=user_id).all()
        saved_movements = Save.query.filter_by(category_id=ocassionalcategory_id, user_id=user_id).all()
        usage_movements = Usage.query.filter_by(category_id=ocassionalcategory_id, user_id=user_id).all()

        all_movements = []

        for movement in ocassional_movements:
            all_movements.append(movement.serialize())

        for movement in saved_movements:
            all_movements.append(movement.serialize())

        for movement in usage_movements:
            all_movements.append(movement.serialize())

        return jsonify(all_movements), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

@api.route('/income/<int:movement_id>', methods=['DELETE'])
@jwt_required()
def delete_income(movement_id):
    try:
        user_id = get_jwt_identity()

        if is_test_user():
            data = load_test_user_data()
            incomes = data.get("incomes", [])
            movement_to_delete = next((income for income in incomes if income["id"] == movement_id and "timestamp" in income), None)
            
            if not movement_to_delete:
                return jsonify({"error": "Income movement not found or does not have a timestamp"}), 404
            
            data["incomes"] = [income for income in incomes if income["id"] != movement_id or "timestamp" not in income]
            save_test_user_data(data)
            
            return jsonify({"message": "Income movement deleted successfully"}), 200

        movement_to_delete = Income.query.filter_by(id=movement_id, user_id=user_id).first()
        if not movement_to_delete:
            return jsonify({"error": "Income movement not found"}), 404
        
        db.session.delete(movement_to_delete)
        db.session.commit()

        return jsonify({"message": "Income movement deleted successfully"}), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@api.route('/saved/<int:movement_id>', methods=['DELETE'])
@jwt_required()
def delete_saved_(movement_id):
    try:
        user_id = get_jwt_identity()

        if is_test_user():
            data = load_test_user_data()
            saves = data.get("saves", [])
            movement_to_delete = next((save for save in saves if save["id"] == movement_id and "timestamp" in save), None)
            
            if not movement_to_delete:
                return jsonify({"error": "Save movement not found or does not have a timestamp"}), 404
            
            data["saves"] = [save for save in saves if save["id"] != movement_id or "timestamp" not in save]
            save_test_user_data(data)
            
            return jsonify({"message": "Save movement deleted successfully"}), 200

        movement_to_delete = Save.query.filter_by(id=movement_id, user_id=user_id).first()
        if not movement_to_delete:
            return jsonify({"error": "Movement not found"}), 404
        db.session.delete(movement_to_delete)
        db.session.commit()

        return jsonify({"message": "Movement delete succesfully"}), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@api.route('/usage/<int:movement_id>', methods=['DELETE'])
@jwt_required()
def delete_usage_(movement_id):
    try:
        user_id = get_jwt_identity()

        if is_test_user():
            data = load_test_user_data()
            usages = data.get("usages", [])
            movement_to_delete = next((usage for usage in usages if usage["id"] == movement_id and "timestamp" in usage), None)
            
            if not movement_to_delete:
                return jsonify({"error": "Usage movement not found or does not have a timestamp"}), 404
            
            data["usages"] = [usage for usage in usages if usage["id"] != movement_id or "timestamp" not in usage]
            save_test_user_data(data)
            
            return jsonify({"message": "Usage movement deleted successfully"}), 200

        movement_to_delete = Usage.query.filter_by(id=movement_id, user_id=user_id).first()
        if not movement_to_delete:
            return jsonify({"error": "Movement not found"}), 404
        db.session.delete(movement_to_delete)
        db.session.commit()

        return jsonify({"message": "Movement delete succesfully"}), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@api.route('/fixed/<int:movement_id>', methods=['DELETE'])
@jwt_required()
def delete_fixed_(movement_id):
    try:
        user_id = get_jwt_identity()

        if is_test_user():
            data = load_test_user_data()
            fixes = data.get("fixes", [])
            movement_to_delete = next((fixed for fixed in fixes if fixed["id"] == movement_id and "timestamp" in fixed), None)
            
            if not movement_to_delete:
                return jsonify({"error": "Fixed movement not found or does not have a timestamp"}), 404
            
            data["fixes"] = [fixed for fixed in fixes if fixed["id"] != movement_id or "timestamp" not in fixed]
            save_test_user_data(data)
            
            return jsonify({"message": "Fixed movement deleted successfully"}), 200

        movement_to_delete = Fixed.query.filter_by(id=movement_id, user_id=user_id).first()
        if not movement_to_delete:
            return jsonify({"error": "Movement not found"}), 404
        db.session.delete(movement_to_delete)
        db.session.commit()

        return jsonify({"message": "Movement delete succesfully"}), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@api.route('/ocassional/<int:movement_id>', methods=['DELETE'])
@jwt_required()
def delete_ocassional_(movement_id):
    try:
        user_id = get_jwt_identity()

        if is_test_user():
            data = load_test_user_data()
            ocassionals = data.get("ocassionals", [])
            movement_to_delete = next((ocassional for ocassional in ocassionals if ocassional["id"] == movement_id and "timestamp" in ocassional), None)
            
            if not movement_to_delete:
                return jsonify({"error": "Ocassional movement not found or does not have a timestamp"}), 404
            
            data["ocassionals"] = [ocassional for ocassional in ocassionals if ocassional["id"] != movement_id or "timestamp" not in ocassional]
            save_test_user_data(data)
            
            return jsonify({"message": "Ocassional movement deleted successfully"}), 200

        movement_to_delete = Ocassional.query.filter_by(id=movement_id, user_id=user_id).first()
        if not movement_to_delete:
            return jsonify({"error": "Movement not found"}), 404
        db.session.delete(movement_to_delete)
        db.session.commit()

        return jsonify({"message": "Movement delete succesfully"}), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
