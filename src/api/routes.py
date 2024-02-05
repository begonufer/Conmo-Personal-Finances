from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from datetime import datetime
from sqlalchemy import union_all

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


#Esta ruta obtiene las categorías de ingresos

@api.route('/incomecategories', methods=['GET'])
@jwt_required()
def get_incomecategories():
    user_id = get_jwt_identity()
    return jsonify([income_category.serialize() for income_category in IncomeCategory.query.filter_by(user_id=user_id).all()])

#Esta ruta obtiene las categorías de fijos

@api.route('/fixedcategories', methods=['GET'])
@jwt_required()
def get_fixedcategories():
    user_id = get_jwt_identity()
    return jsonify([fixed_category.serialize() for fixed_category in FixedCategory.query.filter_by(user_id=user_id).all()])

#Esta ruta obtiene las categorías de gastos ocasionales

@api.route('/ocassionalcategories', methods=['GET'])
@jwt_required()
def get_ocassionalcategories():
    user_id = get_jwt_identity()
    return jsonify([ocassional_category.serialize() for ocassional_category in OcassionalCategory.query.filter_by(user_id=user_id).all()])

#Añade un ingreso

@api.route('/income', methods=['POST'])
@jwt_required()
def add_income():
    income = Income()
    income.user_id = get_jwt_identity()
    income.value = request.json.get("value",None)    
    income.incomecategory_id = request.json.get("incomecategory_id",None)
    incomecategory = IncomeCategory.query.filter_by(id=income.incomecategory_id).first()
    income.incomecategory = incomecategory
    income.dateTime = datetime.strptime(request.json.get("dateTime"), "%Y-%m-%d").date()
    db.session.add(income)
    db.session.commit()
    return jsonify(income.serialize()),200

#Añade un ahorro 

@api.route('/save', methods=['POST'])
@jwt_required()
def add_saves():
    try:
        user_id = get_jwt_identity()

        value = request.json.get("value")
        ocassionalcategory_id = request.json.get("ocassionalcategory_id")
        datetime_str = request.json.get("dateTime")
        
        if value is None or ocassionalcategory_id is None or datetime_str is None:
            return jsonify({"error": "Campos incompletos"}), 400

        category = OcassionalCategory.query.get(ocassionalcategory_id)
        if not category:
            return jsonify({"error": "Categoría ocassional no encontrada"}), 404

        save = Save(
            user_id=user_id,
            value=value,
            category=category,
            dateTime=datetime.strptime(datetime_str, "%Y-%m-%d").date()
        )

        db.session.add(save)
        db.session.commit()

        return jsonify(save.serialize()), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/usage', methods=['POST'])
@jwt_required()
def add_usages():
    try:
        user_id = get_jwt_identity()

        value = request.json.get("value")
        ocassionalcategory_id = request.json.get("ocassionalcategory_id")
        datetime_str = request.json.get("dateTime")
        
        if value is None or ocassionalcategory_id is None or datetime_str is None:
            return jsonify({"error": "Campos incompletos"}), 400

        category = OcassionalCategory.query.get(ocassionalcategory_id)
        if not category:
            return jsonify({"error": "Categoría ocassional no encontrada"}), 404

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

#Añade un gasto ocasional

@api.route('/ocassional', methods=['POST'])
@jwt_required()
def add_ocassional():
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

#Obtiene los ingresos

@api.route('/income', methods=['GET'])
@jwt_required()
def get_incomes():
    user_id = get_jwt_identity() 
    incomes = Income.query.filter_by(user_id=user_id).order_by(Income.dateTime).all()
    return jsonify([income.serialize() for income in incomes])
    

@api.route('/save', methods= ['GET'])
@jwt_required()
def get_saves():
    user_id = get_jwt_identity() 
    saves = Save.query.filter_by(user_id=user_id).all()
    return jsonify([save.serialize() for save in saves])


@api.route('/usage', methods= ['GET'])
@jwt_required()
def get_usages():
    user_id = get_jwt_identity() 
    usages = Usage.query.filter_by(user_id=user_id).all()
    return jsonify([usage.serialize() for usage in usages])

#Obtiene los gastos fijos

@api.route('/fixed', methods=['GET'])
@jwt_required()
def get_fixes():
    user_id = get_jwt_identity()
    fixes = Fixed.query.filter_by(user_id=user_id).all()
    return jsonify([fixed.serialize() for fixed in fixes])

#Obtiene los gastos ocasionales

@api.route('/ocassional', methods=['GET'])
@jwt_required()
def get_ocassionals():
    user_id = get_jwt_identity() 
    ocassionals = Ocassional.query.filter_by(user_id=user_id).all()
    return jsonify([ocassional.serialize() for ocassional in ocassionals])

@api.route('/ocassionalcategory', methods=['POST'])
@jwt_required()
def add_ocassional_category():
    try:
        user_id = get_jwt_identity()
        category_name = request.json.get("value", None)

        if not category_name:
            return jsonify({"error": "Nombre de categoría necesario"}), 400

        new_category = OcassionalCategory(name=category_name, user_id=user_id)
        db.session.add(new_category)
        db.session.commit()

        return jsonify(new_category.serialize()), 201
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Error al agregar la categoría ocasional"}), 500


@api.route('/fixedcategory', methods=['POST'])
@jwt_required()
def add_fixed_category():
    try:
        user_id = get_jwt_identity()
        category_name = request.json.get("value", None)

        if not category_name:
            return jsonify({"error": "Nombre de categoría necesario"}), 400

        new_category = FixedCategory(name=category_name, user_id=user_id)
        db.session.add(new_category)
        db.session.commit()

        return jsonify(new_category.serialize()), 201
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Error al agregar la categoría fijo"}), 500


@api.route('/incomecategory', methods=['POST'])
@jwt_required()
def add_income_category():
    try:
        user_id = get_jwt_identity()
        category_name = request.json.get("value", None)

        if not category_name:
            return jsonify({"error": "Nombre de categoría necesario"}), 400

        new_category = IncomeCategory(name=category_name, user_id=user_id)
        db.session.add(new_category)
        db.session.commit()

        return jsonify(new_category.serialize()), 201
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Error al agregar la categoría ingreso"}), 500


@api.route('/fixedcategory/<int:fixedcategory_id>', methods=['DELETE'])
@jwt_required()
def delete_fixed_category(fixedcategory_id):
    try:
        user_id = get_jwt_identity()
        category_to_delete = FixedCategory.query.filter_by(id=fixedcategory_id, user_id=user_id).first()
        if not category_to_delete:
            return jsonify({"error": "Fixed category not found"}), 404
        db.session.delete(category_to_delete)
        db.session.commit()

        return jsonify({"message": "Category delete succesfully"}), 200
    except Exception as e:
        traceback.print_exc()


@api.route('/ocassionalcategory/<int:ocassionalcategory_id>', methods=['DELETE'])
@jwt_required()
def delete_ocassional_category(ocassionalcategory_id):
    try:
        user_id = get_jwt_identity()
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
        category_to_modify = OcassionalCategory.query.filter_by(id=ocassionalcategory_id, user_id=user_id).first()
        
        if not category_to_modify:
            return jsonify({"error": "Ocassional category not found"}), 404
        
        data = request.get_json()
        new_name = data.get("name")

        if not new_name:
            return get_error_response("Name of category is required", 400)

        category_to_modify.name = new_name
        db.session.commit()

        return jsonify(category_to_modify.serialize()), 200

    except Exception as e:
        traceback.print_exc()
        return get_error_response("Error in modifying category", 500)

@api.route('/fixedcategory/<int:fixedcategory_id>', methods=['PUT'])
@jwt_required()
def modify_fixed_category(fixedcategory_id):
    try:
        user_id = get_jwt_identity()
        category_to_modify = FixedCategory.query.filter_by(id=fixedcategory_id, user_id=user_id).first()
        
        if not category_to_modify:
            return jsonify({"error": "Fixed category not found"}), 404
        
        data = request.get_json()
        new_name = data.get("name")

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
        category_to_modify = IncomeCategory.query.filter_by(id=incomecategory_id, user_id=user_id).first()
        
        if not category_to_modify:
            return jsonify({"error": "Income category not found"}), 404
        
        data = request.get_json()
        new_name = data.get("name")

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
def delete_income_(movement_id):
    try:
        user_id = get_jwt_identity()
        movement_to_delete = Income.query.filter_by(id=movement_id, user_id=user_id).first()
        if not movement_to_delete:
            return jsonify({"error": "Movement not found"}), 404
        db.session.delete(movement_to_delete)
        db.session.commit()

        return jsonify({"message": "Movement delete succesfully"}), 200
    except Exception as e:
        traceback.print_exc()

@api.route('/saved/<int:movement_id>', methods=['DELETE'])
@jwt_required()
def delete_saved_(movement_id):
    try:
        user_id = get_jwt_identity()
        movement_to_delete = Save.query.filter_by(id=movement_id, user_id=user_id).first()
        if not movement_to_delete:
            return jsonify({"error": "Movement not found"}), 404
        db.session.delete(movement_to_delete)
        db.session.commit()

        return jsonify({"message": "Movement delete succesfully"}), 200
    except Exception as e:
        traceback.print_exc()

@api.route('/usage/<int:movement_id>', methods=['DELETE'])
@jwt_required()
def delete_usage_(movement_id):
    try:
        user_id = get_jwt_identity()
        movement_to_delete = Usage.query.filter_by(id=movement_id, user_id=user_id).first()
        if not movement_to_delete:
            return jsonify({"error": "Movement not found"}), 404
        db.session.delete(movement_to_delete)
        db.session.commit()

        return jsonify({"message": "Movement delete succesfully"}), 200
    except Exception as e:
        traceback.print_exc()

@api.route('/fixed/<int:movement_id>', methods=['DELETE'])
@jwt_required()
def delete_fixed_(movement_id):
    try:
        user_id = get_jwt_identity()
        movement_to_delete = Fixed.query.filter_by(id=movement_id, user_id=user_id).first()
        if not movement_to_delete:
            return jsonify({"error": "Movement not found"}), 404
        db.session.delete(movement_to_delete)
        db.session.commit()

        return jsonify({"message": "Movement delete succesfully"}), 200
    except Exception as e:
        traceback.print_exc()

@api.route('/ocassional/<int:movement_id>', methods=['DELETE'])
@jwt_required()
def delete_ocassional_(movement_id):
    try:
        user_id = get_jwt_identity()
        movement_to_delete = Ocassional.query.filter_by(id=movement_id, user_id=user_id).first()
        if not movement_to_delete:
            return jsonify({"error": "Movement not found"}), 404
        db.session.delete(movement_to_delete)
        db.session.commit()

        return jsonify({"message": "Movement delete succesfully"}), 200
    except Exception as e:
        traceback.print_exc()
