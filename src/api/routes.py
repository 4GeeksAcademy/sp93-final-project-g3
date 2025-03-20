"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from api.models import db, Users
from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import get_jwt
import requests



api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {}
    response_body['message'] = "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    return response_body, 200

@api.route('/register', methods=['POST'])
def register_user():
    response_body = {}
    data = request.json


    row = Users(email=data['email'], password=data['password'])
    db.session.add(row)
    db.session.commit()

    user = row.serialize()
    claims = {'user_id': user['id']}

    print(claims)

    access_token = create_access_token(identity=user["email"], additional_claims=claims)
    response_body['message'] = 'User registered successfully'
    response_body['access_token'] = access_token
    response_body['results'] = user
    return jsonify(response_body), 200


@api.route("/login", methods=["POST"])
def login():
    response_body = {}
    data = request.json
    print("soy data de login", data)
    email = data.get("email", None)
    password = data.get("password", None)
    row = db.session.execute(db.select(Users).where(Users.email==email, Users.password==password, Users.is_active)).scalar()
    # if the request is successful, row should return something (therefore is true), ifnot it will return none
    if not row:
        response_body['message'] = "Bad email or password"
        return response_body, 401
    user = row.serialize()
    claims = {'user_id': user['id'],
              'is_admin': user['is_admin']}
    print(claims)

    access_token = create_access_token(identity=email, additional_claims=claims)
    response_body['message'] = 'User logged!'
    response_body['access_token'] = access_token
    response_body['results'] = user
    return response_body, 200

@api.route('/users/<int:user_id>', methods=['GET'])
def user_id(user_id):
   user = Users.query.get(user_id)
   response_body = { "message": "user successfully retrieved", "results": user.serialize()}
   return jsonify(response_body), 200
   

@api.route('/users', methods=['GET'])
def users():
    response_body = { }
    rows = db.session.execute(db.select(Users)).scalars() 
 
    results = [ row.serialize() for row in rows ]
    response_body["message"] = f'Listado de Usuarios'
    response_body["results"] = results
    return(response_body), 200

@api.route('/users', methods=['PUT'])
@jwt_required()
def edit_user():
    response_body = {}
    data = request.json
    user_id = get_jwt()['user_id']
    print("soy el data de edit user", data)
    print("soy el userid de edit", user_id)
    row = Users.query.get(user_id)
    print("soy el print de row serialize", row.serialize())
    if not row:
        response_body['message'] = 'User not found'
        return response_body, 404
    row.first_name = data.get('first_name', row.first_name)  # Use .get() to avoid KeyError
    row.last_name = data.get('last_name', row.last_name)
    row.email = data.get('email', row.email)
    row.password = data.get('password', row.password)
    row.gender = data.get('gender', row.gender)
    row.age = data.get('age', row.age)
    row.photo = data.get('photo', row.photo)
    row.biography = data.get('biography', row.biography)
    row.is_admin = data.get('is_admin', row.is_admin)

    db.session.commit()
    response_body['message'] = 'User edited'
    response_body['results'] = row.serialize()
    return response_body, 200




# PUT /trips/{id} → Editar un viaje (solo anfitrión del viaje) me falta  escrito por :Sarto


# POST /trips → Crear un viaje (solo anfitriones)
@api.route('/trips', methods=['POST'])
def post_trip():
    response_body = {}
    data = request.json
    # Crear una nueva instancia de Trips
    row = Trips(
        id = data['id'],
        destination=data['destination'],
        start_date=datetime.strptime(data['start_date'], "%Y-%m-%d"),
        end_date=datetime.strptime(data['end_date'], "%Y-%m-%d"),
        available_seats=data['available_seats'],
        description=data['description'],
        photo=data.get('photo',''),  
        budget=data['budget'],
        budget_currency=data['budget_currency'],
        age_min=data.get('age_min'),  
        age_max=data.get('age_max'), 
        status=data['status'],
        host_id=data['host_id']
    )
    # Añadir y commitear la nueva instancia a la base de datos
    db.session.add(row)
    db.session.commit()
    # Serializar el objeto Trips para la respuesta
    trip = row.serialize()
    claims = {'trip_id': trip['id']}
    print(claims)
    response_body['message'] = 'Trip created successfully'
    response_body['results'] = trip
    return jsonify(response_body), 200


# GET /trips/{id} → Ver detalles de un viaje
@api.route('/trips/<int:trip_id>', methods=['GET'])
def get_trip(trip_id):
    trip = Trips.query.get(trip_id)
    if not trip:
        response_body = {
            "error": "Trip not found"
        }
        return jsonify(response_body), 404

    response_body = {
        "message": "Trip retrieved successfully",
        "results": trip.serialize()
    }
    return jsonify(response_body), 200


# GET /trips → Listar todos los viajes disponibles (para viajeros)
@api.route('/trips', methods=['GET'])
def get_trips():
    trips = Trips.query.all()
    response_body = {
        "message": "Trips retrieved successfully",
        "results": [trip.serialize() for trip in trips]
    }
    return jsonify(response_body), 200

# DELETE /trips/{id} → Cancelar un viaje (solo anfitrión del viaje)
@api.route('/trips/<int:trip_id>', methods=['DELETE'])
@jwt_required()  
def delete_trip(trip_id):
   
    user_id = get_jwt_identity()

    trip = Trips.query.get(trip_id)
    if not trip:
        response_body = {
            "error": "Trip not found"
        }
        return jsonify(response_body), 404

    
    if trip.host_id != user_id: 
        response_body = {
            "error": "No tienes permiso para eliminar este viaje"
        }
        return jsonify(response_body), 403 

   
    db.session.delete(trip)
    db.session.commit()

    response_body = {
        "message": "Trip deleted successfully"
    }
    return jsonify(response_body), 200


#https://cloudinary.com/
#endpoint load image
