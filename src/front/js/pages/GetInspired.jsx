import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/getInspired.css";

export const GetInspired = () => {
  const { store, actions } = useContext(Context);
  const { finishedTrips, totalPages, currentPage, favorites, isLogged } = store;
  const { getFinishedTrips, getFavoriteTrips, toggleFavorite } = actions;

  useEffect(() => {
    getFinishedTrips(1); // Default to page 1
    getFavoriteTrips();
  }, [getFinishedTrips, getFavoriteTrips]);

  const handlePagination = (page) => {
    getFinishedTrips(page); // Load the trips for the selected page
    window.scrollTo(0, 0); // Scroll back to top when changing pages
  };

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

  const handleFavorite = async (e, tripId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!store.isLogged) {
      alert("You need to be logged in to add favorites!");
      return;
    }

    const success = await actions.toggleFavorite(tripId);
    if (!success) {
      alert("Error updating favorite status.");
    }
  };

  return (
    <div className="trips-container">
      <h2 className="page-title">Get Inspired</h2>
      <p className="page-description">
        Look at all the places our travelers have been, the hotels they have stayed at,
        and the things they have seen, and get inspired to create your new adventure
      </p>

      {!finishedTrips || finishedTrips.length === 0 ? (
        <div className="no-trips-message">
          <p>No finished trips found. Check back later for inspiration!</p>
        </div>
      ) : (
        <div className="trip-cards-container">
          {finishedTrips.map((trip, index) => (
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
                {/* <button
                  className={`favorite-btn ${trip.is_favorite ? "active" : ""}`}
                  onClick={(e) => handleFavorite(e, trip.id)}
                  title="Add to favorites"
                >
                  <i className="fas fa-heart"></i>
                </button> */}
                {favorites.find(fav => fav.trip_id === trip.id) ? (
                  <button
                    className="favorite-btn-liked"
                    onClick={(e) => handleFavorite(e, trip.id)}
                    title="Remove from favorites"
                  >
                    <i className="fas fa-heart"></i>
                  </button>
                ) : (
                  <button
                    className="favorite-btn"
                    onClick={(e) => handleFavorite(e, trip.id)}
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
                <Link to={`/trips/${trip.id}`} className="view-more-btn">
                  View Details <i className="fas fa-arrow-right"></i>
                </Link>
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
  );
};