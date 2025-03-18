from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from enum import Enum
from sqlalchemy.orm import validates


db = SQLAlchemy()

ALLOWED_GENDERS = ["Male", "Female", "Non-Binary", "Other"]

class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False) 
    password = db.Column(db.String(80), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    gender = db.Column(db.String(50), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    photo = db.Column(db.String(255), nullable=True)  
    biography = db.Column(db.String(500), nullable=True) 
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    # Relación uno a muchos con el modelo Trip
    trips = db.relationship("Trip", backref="host", lazy=True)
    favorites = db.relationship("Favorites", backref="user", lazy=True)
    
    is_active = db.Column(db.Boolean(), nullable=False, default=True)
    is_admin = db.Column(db.Boolean(), nullable=False, default=False)


    @validates('gender')
    def validate_gender(self, key, value):
        if value not in ALLOWED_GENDERS:
            raise ValueError('Invalid gender')
        return value

    def __repr__(self):
        return f'<User {self.id} - {self.email}>'

    def serialize(self):
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'gender': self.gender,
            'age': self.age,
            'photo': self.photo,
            'biography': self.biography,
            'created_at': self.created_at.isoformat(),
            'is_active': self.is_active,
            'is_admin': self.is_admin,
            'trips': [trip.serialize() for trip in self.trips],
            'favorites': [favorite.serialize() for favorite in self.favorites] 
        }

# Función para validar el género antes de guardarlo
def validate_gender(value):
    if value not in ALLOWED_GENDERS:
        raise ValueError('Invalid gender')
    return value

# Definimos un Enum para los estados del viaje
class TripStatus(enum.Enum):
    PENDING = "Pending"
    CONFIRMED = "Confirmed"
    CANCELLED = "Cancelled"


class Trip(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    host_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)  # Clave foránea a Users
    destination = db.Column(db.String(50), nullable=False)
    start_date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    available_seats = db.Column(db.Integer, nullable=False)
    description = db.Column(db.String(200), nullable=False)
    photo = db.Column(db.String(255), nullable=True)  # Imagen opcional
    budget = db.Column(db.Integer, nullable=False)
    age_range = db.Column(db.String(10), nullable=False)  # Por ejemplo, "18-25" o "30-40"
    status = db.Column(db.Enum(TripStatus), nullable=False, default=TripStatus.PENDING)  # Enum con estado inicial

    # 🔹 Constructor para crear un objeto Trip fácilmente
    def __init__(self, host_id, destination, start_date, end_date, available_seats, description, budget, age_range, status=TripStatus.PENDING, photo=None):
        self.host_id = host_id
        self.destination = destination
        self.start_date = start_date
        self.end_date = end_date
        self.available_seats = available_seats
        self.description = description
        self.photo = photo
        self.budget = budget
        self.age_range = age_range
        self.status = status

    def __repr__(self):
        return f'<Trip {self.id} - {self.destination} ({self.status.value})>'

    
    def serialize(self):
        return {
            'id': self.id,
            'host_id': self.host_id,
            'destination': self.destination,
            'start_date': self.start_date.isoformat(),
            'end_date': self.end_date.isoformat(),
            'available_seats': self.available_seats,
            'description': self.description,
            'photo': self.photo,
            'budget': self.budget,
            'age_range': self.age_range,
            'status': self.status.value  # Convertimos el Enum a string
        }


class Favorites(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    trip_id = db.Column(db.Integer, db.ForeignKey("trip.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    # Constructor para crear un objeto Favorite fácilmente
    def __init__(self, trip_id, user_id):
        self.trip_id = trip_id
        self.user_id = user_id

    def __repr__(self):
        return f'<Favorite {self.id} - User {self.user_id} - Trip {self.trip_id}>'

    def serialize(self):
        return {
            'id': self.id,
            'trip_id': self.trip_id,
            'user_id': self.user_id
        }


class Notifications(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    message = db.Column(db.String(200), nullable=False)
    read = db.Column(db.Boolean(), nullable=False, default=False)
    date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Constructor para crear un objeto Notification fácilmente
    def __init__(self, user_id, message, read=False, date=None):
        self.user_id = user_id
        self.message = message
        self.read = read
        self.date = date or datetime.utcnow()

    def __repr__(self):
        return f'<Notification {self.id} - User {self.user_id} - Read {self.read}>'

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'message': self.message,
            'read': self.read,
            'date': self.date.isoformat()
        }


class Travelers(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    trip_id = db.Column(db.Integer, db.ForeignKey("trip.id"), nullable=False)
    traveler_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)  # Corregido "user.id" a "users.id"
    status = db.Column(db.Enum(TripStatus), nullable=False, default=TripStatus.PENDING)
    approved_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=True)  # Puede ser nulo si no ha sido aprobado
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Constructor para crear un objeto Traveler fácilmente
    def __init__(self, trip_id, traveler_id, status=TripStatus.PENDING, approved_at=None, created_at=None):
        self.trip_id = trip_id
        self.traveler_id = traveler_id
        self.status = status
        self.approved_at = approved_at
        self.created_at = created_at or datetime.utcnow()

    def __repr__(self):
        return f'<Traveler {self.id} - Trip {self.trip_id} - Traveler {self.traveler_id} - Status {self.status}>'

    # Método serialize para convertir el objeto a un formato JSON
    def serialize(self):
        return {
            'id': self.id,
            'trip_id': self.trip_id,
            'traveler_id': self.traveler_id,
            'status': self.status.value,  # Retorna el valor del Enum
            'approved_at': self.approved_at.isoformat() if self.approved_at else None,
            'created_at': self.created_at.isoformat()
        }


