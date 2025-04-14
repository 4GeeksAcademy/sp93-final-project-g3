import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/profile.css";
import { Context } from "../store/appContext";
import { UploadImage } from "../component/UploadImage.jsx";

export const Profile = () => {
  const navigate = useNavigate();
  const { store, actions } = useContext(Context);
  const [activeTab, setActiveTab] = useState("profile"); // Estado para controlar la pestaña activa
  const { totalPages, currentPage, favorites, myTrips, requests } = store;
  const { getFavoriteTrips, getMyTrips, getRequests } = actions;

  const handleUploadSuccess = (imageUrl) => {
    actions.updateProfilePhoto(imageUrl)
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    getMyTrips(1);
    getFavoriteTrips(1);
    getRequests(1) // Default to page 1
  }, [getMyTrips, getFavoriteTrips, getRequests]);

  const handlePagination = (page) => {
    getFavoriteTrips(page);
    getMyTrips(page); // Load the trips for the selected page
    window.scrollTo(0, 0); // Scroll back to top when changing pages
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const parts = dateString.split(" ");
    if (parts.length !== 3) return "Invalid Date";
    let [day, month, year] = parts;
    year = parseInt(year, 10) < 100 ? `20${year}` : year;
    const formattedDate = `${year}-${month}-${day}`;
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
            src={store.user.photo || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"}
            className="profile-image"
            alt="Profile" />
          <h2 className="profile-title">{store.user.first_name} {store.user.last_name}</h2>
          <UploadImage onUploadSuccess={handleUploadSuccess} />
          {activeTab === "profile" && (
            <button
              className="edit-profile-btn mt-2"
              onClick={() => navigate("/edit-profile")}>
              <i className="fas fa-edit"></i> Edit Profile
            </button>
          )}
          
        </div>
        <nav className="profile-tabs">
          <div className="nav nav-tabs" id="profile-tabs" role="tablist">
            <button
              className={`nav-link ${activeTab === "profile" ? "active" : ""}`}
              id="profile-tab"
              onClick={() => handleTabChange("profile")}
              type="button">
              My Profile
            </button>
            <button
              className={`nav-link ${activeTab === "trips" ? "active" : ""}`}
              id="trips-tab"
              onClick={() => handleTabChange("trips")}
              type="button">
              My Trips
            </button>
            <button
              className={`nav-link ${activeTab === "favorites" ? "active" : ""}`}
              id="favorites-tab"
              onClick={() => handleTabChange("favorites")}
              type="button">
              My Favorites
            </button>
            <button
              className={`nav-link ${activeTab === "requests" ? "active" : ""}`}
              id="requests-tab"
              onClick={() => handleTabChange("requests")}
              type="button">
              My requests
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
                <div className="info-value">{store.user.first_name}</div>
              </div>
              <div className="info-group">
                <label className="info-label">Last Name</label>
                <div className="info-value">{store.user.last_name}</div>
              </div>
              <div className="info-group">
                <label className="info-label">Email</label>
                <div className="info-value">{store.user.email}</div>
              </div>
              <div className="info-group">
                <label className="info-label">Date of Birth</label>
                <div className="info-value">{store.user.date_of_birth || 'Not specified'}</div>
              </div>
              <div className="info-group">
                <label className="info-label">Gender</label>
                <div className="info-value">{store.user.gender || 'Not specified'}</div>
              </div>
              <div className="info-group">
                <label className="info-label">Biography</label>
                <div className="info-value bio">{store.user.biography || 'No biography yet'}</div>
              </div>
            </div>
          </div>
          <div className={`tab-pane ${activeTab === "trips" ? "show active" : "fade"}`}
            id="trips"
            role="tabpanel"
            aria-labelledby="trips-tab">
            {!myTrips || myTrips.length === 0 ? (
              <div className="no-trips-message">
                <p>You don't have any past or upcoming trips. Create your own trip or join one, and start the aventure!</p>
              </div>
            ) : (
              <div className="trip-cards-container">
                {myTrips.map((trip, index) => (
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

                      {store.favorites.find(fav => fav.id === trip.id) ? (
                        <button
                          className="favorite-btn favorite-btnliked"
                          onClick={() => { actions.removeFavorite(trip.id) }}
                          title="Remove from favorites"
                        >
                          <i className="fas fa-heart"></i>
                        </button>
                      ) : (
                        <button
                          className="favorite-btn"
                          onClick={() => { actions.addFavorite(trip.id) }}
                          title="Add to favorites"
                        >
                          <i className="fas fa-heart"></i>
                        </button>
                      )}
                      <h3 className="trip-destination">{trip.destination || "Unknown Destination"}</h3>
                      <div className="trip-details">
                        <p className="trip-dates">
                          {formatDate(trip.start_date || trip.startDate)} - {formatDate(trip.end_date || trip.endDate)}
                        </p>
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
            {/* Pagination */}
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
          <div className={`tab-pane ${activeTab === "favorites" ? "show active" : "fade"}`}
            id="favorites"
            role="tabpanel"
            aria-labelledby="favorites-tab">
            {!favorites || favorites.length === 0 ? (
              <div className="no-trips-message">
                <p>You don't have any Trips added to your favorites. Explore some adventures and get inspired!</p>
              </div>
            ) : (
              <div className="trip-cards-container">
                {favorites.map((trip, index) => (
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
                      {store.favorites.find(fav => fav.id === trip.id) ? (
                        <button
                          className="favorite-btn favorite-btnliked"
                          onClick={() => { actions.removeFavorite(trip.id) }}
                          title="Remove from favorites"
                        >
                          <i className="fas fa-heart"></i>
                        </button>
                      ) : (
                        <button
                          className="favorite-btn"
                          onClick={() => { actions.addFavorite(trip.id) }}
                          title="Add to favorites"
                        >
                          <i className="fas fa-heart"></i>
                        </button>
                      )}
                      <h3 className="trip-destination">{trip.destination || "Unknown Destination"}</h3>
                      <div className="trip-details">
                        <p className="trip-dates">
                          {formatDate(trip.start_date || trip.startDate)} - {formatDate(trip.end_date || trip.endDate)}
                        </p>
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

            {/* Pagination */}
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
          <div className={`tab-pane ${activeTab === "requests" ? "show active" : "fade"}`}
            id="requests"
            role="tabpanel"
            aria-labelledby="requests-tab">
            {!requests || requests.length === 0 ? (
              <div className="no-trips-message">
                <p>You don't have any requests!</p>
              </div>
            ) : (
              <div className="trip-cards-container">
                {requests.map((request, index) => (
                  <ul className="list-group mb-3" key={index}>
                    <li className="list-group-item">
                      <p>
                        You have requested to join the trip to <strong>{request.destination}</strong> <span className="insigniaVerde badge text-end">{request.authorization || "Tag"}</span>
                      </p>
                    </li>
                  </ul>
                ))}
              </div>
            )}
            {/* Pagination */}
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