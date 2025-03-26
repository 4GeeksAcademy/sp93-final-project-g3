"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from api.models import db, Users, Trips, Travelers, Favorites
from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import get_jwt
from datetime import datetime
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


# PUT /trips/{id} → Editar un viaje (solo anfitrión del viaje)
@api.route('/trips/<int:trip_id>', methods=['PUT'])
@jwt_required()
def update_trip(trip_id):
    response_body = {}
    data = request.json

    user_id = get_jwt()['user_id']
    
    row = Trips.query.get(trip_id)
    if not row:
        response_body = {
            "error": "Trip not found"
        }
        return jsonify(response_body), 404
    
    if row.host_id != user_id:
        response_body = {
            "error": "No tienes permiso para editar este viaje"
        }
        return jsonify(response_body), 403

    if 'destination' in data:
        row.destination = data['destination']
    if 'start_date' in data:
        try:
            row.start_date = datetime.strptime(data['start_date'], "%Y-%m-%d")
        except ValueError:
            response_body = {
                "error": "Formato de fecha inválido para start_date. Use YYYY-MM-DD"
            }
            return jsonify(response_body), 400
    if 'end_date' in data:
        try:
            row.end_date = datetime.strptime(data['end_date'], "%Y-%m-%d")
        except ValueError:
            response_body = {
                "error": "Formato de fecha inválido para end_date. Use YYYY-MM-DD"
            }
            return jsonify(response_body), 400
    if 'description' in data:
        row.description = data['description']
    if 'photo' in data:
        row.photo = data['photo']
    if 'budget' in data:
        row.budget = data['budget']
    if 'budget_currency' in data:
        row.budget_currency = data['budget_currency']
    if 'available_seats' in data:
        row.available_seats = data['available_seats']
    if 'status' in data:
        row.status = data['status']

    db.session.commit()

    response_body = {
        "message": "Viaje actualizado correctamente",
        "results": row.serialize()
    }
    return jsonify(response_body), 200


# POST /trips → Crear un viaje (solo anfitriones)
@api.route('/user/<int:user_id>/trips', methods=['POST'])
@jwt_required()
def post_trip(user_id):
    response_body = {}
   
    data = request.json
    user_id = get_jwt()['user_id']

    row = Trips(
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
        host_id = user_id
        
    )

    db.session.add(row)
    db.session.commit()  
    trip = row.serialize()
    claims = {'trip_id': trip['id']}
    response_body["message"] = "request created"
    response_body["results"] = trip

    return response_body, 200


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
def delete_trip(trip_id): #3
    response_body = {}
    user_id = get_jwt()['user_id']

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
    
    # traveler = Travelers.query.filter_by(trip_id = trip_id, authorization = 'approved')  
   
    
    traveler = db.session.execute(db.select(Travelers).where(Travelers.trip_id == int(trip_id),Travelers.authorization == 'approved')).scalar() 
   
    if  traveler :
        response_body = {
            "error": "You can't delete this trip because there are other travelers"
        }
        return jsonify (response_body), 405 
    
    Travelers.query.filter_by(trip_id=trip_id).delete()
    
    db.session.delete(trip)
    db.session.commit()

    response_body = {
        "message": "Trip deleted successfully"
    }
    return jsonify(response_body), 200


@api.route('/trips/<int:trip_id>/travelers', methods=['POST'])
@jwt_required()
def join_trip(trip_id):
    response_body = {}
    user_id = get_jwt()['user_id']
    trip = Trips.query.get(trip_id)
    if not trip:
        response_body['message'] = "Trip not found"
        return response_body, 404
    
    if trip.host_id == user_id:
        response_body['message'] = "Host cannot join their own trip as a traveler"  

    if trip.status == 'cancelled':
        response_body['message'] = "Cannot join a cancelled trip"
        
    existing_traveler = Travelers.query.filter_by(trip_id=trip_id, traveler_id=user_id).first()
    if existing_traveler:
        response_body['message'] = "User is already a traveler in this trip"
        return response_body, 400
    # data = request.json
    row = Travelers(trip_id=trip_id, traveler_id=user_id)
    db.session.add(row)
    db.session.commit()  
    response_body["message"] = "request created"
    response_body["results"] = row.serialize()

    return response_body, 200
    

@api.route('/trips/<int:trip_id>/travelers/<int:traveler_id>/approve', methods=['PUT'])
@jwt_required()
def approve_traveler(trip_id, traveler_id):
    response_body = {}
    user_id = get_jwt()['user_id']
    trip = Trips.query.get(trip_id)
    if not trip:
        response_body['message'] = "Trip not found"
        return response_body, 404
    
    if trip.host_id != user_id:
        response_body['message'] = "Only the host can approve travelers"
        response_body, 403

    traveler_request = Travelers.query.filter_by(trip_id=trip_id, traveler_id=traveler_id).first()
    if not traveler_request:
        response_body['message'] = "Traveler request not found"
        return response_body, 404
    
    if traveler_request.authorization != 'pending':
        response_body['message'] = "Traveler request is not pending"
        return response_body, 400
    
    traveler_request.authorization = 'approved'
    db.session.commit()
    response_body['message'] = "Traveler request approved successfully"
    response_body['results'] = traveler_request.serialize()
    return response_body, 200


@api.route('/trips/<int:trip_id>/travelers/<int:traveler_id>/decline', methods=['PUT'])
@jwt_required()
def decline_traveler(trip_id, traveler_id):
    response_body = {}
    user_id = get_jwt()['user_id']

    trip = Trips.query.get(trip_id)
    if not trip:
        response_body['message'] = "Trip not found"
        return response_body, 404
        
    if trip.host_id != user_id:
        response_body['message'] = "Only the host can decline travelers"
        return response_body, 403
    
    traveler_request = Travelers.query.filter_by(trip_id=trip_id, traveler_id=traveler_id).first()
    if not traveler_request:
        response_body['message'] = "Traveler request not found"
        return response_body, 404
        
    if traveler_request.authorization != 'pending':
        response_body['message'] = "Traveler request is not pending"
        return response_body, 400
    
    traveler_request.authorization = 'declined'
    db.session.commit()
    response_body['message'] = "Traveler request declined successfully"
    response_body['results'] = traveler_request.serialize()
    return response_body, 200


@api.route('/trips/<int:trip_id>/travelers/<int:traveler_id>/remove', methods=['DELETE'])
@jwt_required()
def remove_traveler(trip_id, traveler_id):
    response_body = {}
    user_id = get_jwt()['user_id']

    trip = Trips.query.get(trip_id)
    if not trip:
        response_body['message'] = "Trip not found"
        return response_body, 404
        
    if trip.host_id != user_id:
        response_body['message'] = "Only the host can remove travelers"
        return response_body, 403
    
    traveler_request = Travelers.query.filter_by(trip_id=trip_id, traveler_id=traveler_id).first()
    if not traveler_request:
        response_body['message'] = "Traveler request not found"
        return response_body, 404
        
    traveler_request.authorization = 'removed'
    db.session.delete(traveler_request)
    db.session.commit()
    response_body['message'] = "Traveler removed successfully"
    response_body['results'] = traveler_request.serialize()
    return response_body, 200


@api.route('/trips/<int:trip_id>/travelers', methods=['GET'])
@jwt_required()
def get_trip_travelers(trip_id):
    response_body = {}
    user_id = get_jwt()['user_id']

    trip = Trips.query.get(trip_id)
    if not trip:
        response_body['message'] = "Trip not found"
        return response_body, 404
    
    is_host = trip.host_id == user_id
    is_approved_traveler = Travelers.query.filter_by(trip_id=trip_id, traveler_id=user_id, authorization='approved').first() is not None

    if not (is_host or is_approved_traveler):
        response_body['message'] = "Only the host or approved travelers can view this list"
        return response_body, 403
    
    travelers = Travelers.query.filter_by(trip_id=trip_id, authorization='approved').all()

    if not travelers:
        response_body['message'] = "No approved travelers found for this trip"
        response_body['results'] = []
        return response_body, 200
        
    travelers_list = [traveler.serialize() for traveler in travelers]

    response_body['message'] = "List of travelers retrieved successfully"
    response_body['results'] = travelers_list
    return response_body, 200


@api.route('/trips/<int:trip_id>/leave', methods=['DELETE'])
@jwt_required()
def leave_trip(trip_id):
    response_body = {}
    user_id = get_jwt()['user_id']

    trip = Trips.query.get(trip_id)
    if not trip:
        response_body['message'] = "Trip not found"
        return response_body, 404
    
    traveler_request = Travelers.query.filter_by(trip_id=trip_id, traveler_id=user_id).first()
    if not traveler_request:
        response_body['message'] = "You are not a traveler in this trip"
        return response_body, 404
    
    if traveler_request.authorization == 'pending':
        db.session.delete(traveler_request)
        db.session.commit()
        response_body['message'] = "Traveler request removed successfully"
        return response_body, 200
    
    if traveler_request.authorization == 'approved':
        traveler_request.authorization = 'cancelled'
        db.session.commit()
        response_body['message'] = "Traveler status updated to cancelled"
        return response_body, 200
    
    response_body['message'] = "Cannot leave the trip in the current state"
    return response_body, 400


@api.route('/trips/<int:trip_id>/favorites', methods=['POST', 'DELETE'])
@jwt_required()
def favorites(trip_id):
    response_body= {}
    user_id = get_jwt()['user_id']
    if request.method == 'POST':
        existing_fav = Favorites.query.filter_by(user_id=user_id, trip_id=trip_id).first()
        if existing_fav:
            return jsonify({"message": "Favorite already exists"}), 400
        
        row = Favorites(user_id=user_id, trip_id=trip_id)
        db.session.add(row)
        db.session.commit()
        response_body['message'] = 'Favorite added successfully'
        response_body['results'] = row.serialize()
        return response_body, 200
    if request.method == 'DELETE':
        row = Favorites.query.filter_by(user_id=user_id, trip_id=trip_id).first()
        if not row:
            return {'message': 'Favorite trip not found'}, 404
        db.session.delete(row)
        db.session.commit()
        response_body['message'] = 'Favorite trip deleted successfully'
        response_body['results'] = row.serialize()
        return response_body, 200
    response_body ['message'] = 'unexpected error'
    return response_body, 400

    
#https://cloudinary.com/
#Endpoint load image