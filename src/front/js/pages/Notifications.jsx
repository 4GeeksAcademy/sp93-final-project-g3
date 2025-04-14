import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/notifications.css";

export const Notifications = () => {
    const { store, actions } = useContext(Context);
    const { hostRequests } = store;
    const navigate = useNavigate();
    console.log("host requests", hostRequests)

    const handleApproveTrip = (tripId, travelerId) => {
        const dataToSend = { authorization: 'approved' };  // Asegúrate de incluir la autorización
        actions.approveTraveler(tripId, travelerId, dataToSend);  // Pasas los datos a la acción
    };
    const handleDeclineTrip = (tripId, travelerId) => {
        const dataToSend = { authorization: 'declined' };  // Asegúrate de incluir la autorización
        actions.declineTraveler(tripId, travelerId, dataToSend);  // Pasas los datos a la acción
    };
    useEffect(() => {
        actions.getHostRequests();
    }, []);

    return (
        <div className="trips-container">
            <h2 className="page-title">Notifications</h2>
            {!hostRequests || hostRequests.length === 0 ? (
                <div className="no-trips-message">
                    <p>You don't have any unseen notifications. Check again later</p>
                </div>
            ) : (
                <div className="trip-cards-container">
                    {hostRequests.map((request, index) => (
                        <ul className="list-group mb-3" key={index}>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                <span>
                                    The user {request.traveler?.first_name} {request.traveler?.last_name} has requested to join your trip to {request.trip?.destination}
                                </span>
                                <div className="notification-buttons">
                                    <button className="btn btn-sm approve-btn me-2" onClick={() => handleApproveTrip(request.trip_id, request.traveler_id)}>
                                        Approve
                                    </button>
                                    <button className="btn btn-sm decline-btn" onClick={() => handleDeclineTrip(request.trip_id, request.traveler_id)}>
                                        Decline
                                    </button>
                                </div>
                            </li>
                        </ul>
                    ))}
                </div>)}
        </div>
    );
};