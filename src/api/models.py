from flask_sqlalchemy import SQLAlchemy
from datetime import datetime


db = SQLAlchemy()


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False) 
    password = db.Column(db.String(80), nullable=False)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    gender = db.Column(db.Enum("male", "female", "non_binary", "other", name='gender'))
    age = db.Column(db.Integer)
    photo = db.Column(db.String(300))  
    biography = db.Column(db.String(500)) 
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    is_active = db.Column(db.Boolean(), nullable=False, default=True)
    is_admin = db.Column(db.Boolean(), nullable=False, default=False)

 
   
    def __repr__(self):
        return f'<User {self.id} - {self.email}>'

    def serialize(self):
        return {'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'gender': self.gender,
            'age': self.age,
            'photo': self.photo,
            'biography': self.biography,
            'created_at': self.created_at.strftime("%d %m %y"),
            'is_active': self.is_active,
            'is_admin': self.is_admin}


class Trips(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    destination = db.Column(db.String(50), nullable=False)
    start_date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    end_date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    available_seats = db.Column(db.Integer)
    description = db.Column(db.String(200), nullable=False)
    photo = db.Column(db.String(255))  # Imagen opcional
    budget = db.Column(db.Integer, nullable=False)
    budget_currency = db.Column(db.String(), nullable=False)
    age_min = db.Column(db.Integer)
    age_max = db.Column(db.Integer)
    status = db.Column(db.Enum('planning', 'finished', 'ongoing', 'cancelled', name='status'), nullable=False) # Enum con estado inicial
    host_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)  # Clave foránea a Users
    host_to = db.relationship('Users', foreign_keys=[host_id], backref=db.backref('host_to', lazy='select'))
   
    def __repr__(self):
        return f'<Trip {self.id} - {self.destination} ({self.start_date})>'

    def serialize(self):
        return {'id': self.id,
            'host_id': self.host_id,
            'destination': self.destination,
            'start_date': self.start_date.strftime("%d %m %y"),
            'end_date': self.end_date.strftime("%d %m %y"),
            'available_seats': self.available_seats,
            'description': self.description,
            'photo': self.photo,
            'budget': self.budget,
            'budget_currency': self.budget_currency,
            'age_min': self.age_min,
            'age_max': self.age_max,
            'status': self.status}


class Favorites(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    trip_id = db.Column(db.Integer, db.ForeignKey("trips.id"))
    trip_to = db.relationship("Trips", foreign_keys=[trip_id], backref=db.backref('favorite_to', lazy='select'))
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    user_to = db.relationship("Users", foreign_keys=[user_id], backref=db.backref('favorite_to', lazy='select'))

    def __repr__(self):
        return f'<Favorite {self.id} - User {self.user_id} - Trip {self.trip_id}>'

    def serialize(self):
        return {'id': self.id,
            'trip_id': self.trip_id,
            'user_id': self.user_id}


class Notifications(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.String(200), nullable=False)
    read = db.Column(db.Boolean(), nullable=False, default=False)
    date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user_to = db.relationship("Users", foreign_keys=[user_id], backref=db.backref('notification_to', lazy='select'))

    def __repr__(self):
        return f'<Notification {self.id} - User {self.user_id} - Read {self.read}>'

    def serialize(self):
        return {'id': self.id,
            'user_id': self.user_id,
            'message': self.message,
            'read': self.read,
            'date': self.date.strftime()}


class Travelers(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.Enum('approved', 'declined', 'pending', 'cancelled', name='status'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    trip_id = db.Column(db.Integer, db.ForeignKey("trips.id"), nullable=False)
    trip_to = db.relationship("Trips", foreign_keys=[trip_id], backref=db.backref('traveler_to', lazy='select'))
    traveler_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False) 
    traveler_to = db.relationship("Users", foreign_keys=[traveler_id], backref=db.backref('traveler_to', lazy='select'))

    def __repr__(self):
        return f'<Traveler {self.id} - Trip {self.trip_id} - Traveler {self.traveler_id} - Status {self.status}>'
    # Método serialize para convertir el objeto a un formato JSON
    def serialize(self):
        return {'id': self.id,
            'trip_id': self.trip_id,
            'traveler_id': self.traveler_id,
            'status': self.status, 
            'created_at': self.created_at.strftime()}


