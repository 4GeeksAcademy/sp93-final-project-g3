import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "../../styles/profile.css";
import { Context } from "../store/appContext";
import { UploadImage } from "../component/UploadImage.jsx";

export const User = () => {
  const navigate = useNavigate();
  const { store, actions } = useContext(Context);
  const [activeTab, setActiveTab] = useState("profile"); // Estado para controlar la pestaña activa
  const { totalPages, currentPage, userTrips, user } = store;
  const { getUser, getUserTrips } = actions;
 /*  const { userId } = store.selectedUser; */
  const userId = store.selectedUser?.userId || store.selectedUser?.id;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  useEffect(() => {
    if (userId) {
      getUser(userId);
      getUserTrips(userId);
    }
  }, [userId]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    // Separar los valores de la fecha
    const parts = dateString.split(" ");
    if (parts.length !== 3) return "Invalid Date";

    let [day, month, year] = parts;

    // Asegurar que el año tiene 4 dígitos (asumimos que "25" es 2025)
    year = parseInt(year, 10) < 100 ? `20${year}` : year;

    // Crear la fecha en formato estándar YYYY-MM-DD
    const formattedDate = `${year}-${month}-${day}`;

    // Convertir a objeto Date y formatear en texto legible
    const date = new Date(formattedDate);
    if (isNaN(date.getTime())) return "Invalid Date";

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img
            src={store.selectedUser.photo || "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="}
            className="profile-image"
            alt="Profile" />
          <h2 className="profile-title">{store.selectedUser.first_name} {store.selectedUser.last_name}</h2>

        </div>
        <nav className="profile-tabs">
          <div className="nav nav-tabs" id="profile-tabs" role="tablist">
            <button
              className={`nav-link ${activeTab === "profile" ? "active" : ""}`}
              id="profile-tab"
              onClick={() => handleTabChange("profile")}
              type="button">
              User Profile
            </button>
            <button
              className={`nav-link ${activeTab === "trips" ? "active" : ""}`}
              id="trips-tab"
              onClick={() => handleTabChange("trips")}
              type="button">
              Trips
            </button>
          </div>
        </nav>
        <div className="tab-content profile-content">
          <div className={`tab-pane ${activeTab === "profile" ? "show active" : "fade"}`}
            id="profile"
            role="tabpanel"
            aria-labelledby="profile-tab">
            <div className="profile-info">
              <div className="info-group">
                <label className="info-label">First Name</label>
                <div className="info-value">{store.selectedUser.first_name}</div>
              </div>
              <div className="info-group">
                <label className="info-label">Last Name</label>
                <div className="info-value">{store.selectedUser.last_name}</div>
              </div>
              <div className="info-group">
                <label className="info-label">Age</label>
                <div className="info-value">{store.selectedUser.age || 'Not specified'}</div>
              </div>
              <div className="info-group">
                <label className="info-label">Gender</label>
                <div className="info-value">{store.selectedUser.gender || 'Not specified'}</div>
              </div>
              <div className="info-group">
                <label className="info-label">Biography</label>
                <div className="info-value bio">{store.selectedUser.biography || 'No biography yet'}</div>
              </div>
            </div>
          </div>
          <div className={`tab-pane ${activeTab === "trips" ? "show active" : "fade"}`}
            id="trips"
            role="tabpanel"
            aria-labelledby="trips-tab">
            {!userTrips|| userTrips.length === 0 ? (
              <div className="no-trips-message">
                <p>They don't have any past or upcoming trips.</p>
              </div>
            ) : (
              <div className="trip-cards-container">
                {userTrips.map((trip, index) => (
                  <div key={index} className="trip-card">
                    <div className="trip-card-image">
                      <img
                        src={trip.photo || trip.imageUrl || "https://placehold.co/600x400?text=No+Image"}
                        alt={trip.destination || "Trip"}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://placehold.co/600x400?text=No+Image";
                        }}
                      />
                    </div>
                    <div className="trip-card-content">
                      <h3 className="trip-destination">{trip.destination || "Unknown Destination"}</h3>
                      <div className="trip-details">
                        <p className="trip-dates">
                          {formatDate(trip.start_date || trip.startDate)} - {formatDate(trip.end_date || trip.endDate)}
                        </p>
                        <p><span className="insigniaVerde badge">{trip.status || "Tag"}</span></p>
                        <p className="trip-budget">
                          Budget: {trip.budget || "N/A"} {trip.budget_currency || ""}
                        </p>
                        {trip.description && (
                          <p className="trip-description">
                            {trip.description.length > 100
                              ? `${trip.description.substring(0, 100)}...`
                              : trip.description}
                          </p>
                        )}
                      </div>
                      <button onClick={() => navigate(`/trip-page/${trip.id}`)} className="view-more-btn">
                        View Details <i className="fas fa-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          
            {totalPages > 1 && (
              <div className="pagination-container">
                <button
                  className="pagination-btn"
                  disabled={currentPage <= 1}
                  onClick={() => handlePagination(currentPage - 1)}
                >
                  &laquo; Previous
                </button>

                <div className="page-numbers">
                  {[...Array(totalPages).keys()].map((num) => (
                    <button
                      key={num + 1}
                      className={`page-number ${currentPage === num + 1 ? "active" : ""}`}
                      onClick={() => handlePagination(num + 1)}
                    >
                      {num + 1}
                    </button>
                  ))}
                </div>

                <button
                  className="pagination-btn"
                  disabled={currentPage >= totalPages}
                  onClick={() => handlePagination(currentPage + 1)}
                >
                  Next &raquo;
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};