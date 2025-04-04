import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/getInspired.css";

export const Community = () => {
  const { store, actions } = useContext(Context);
  const { totalPages, currentPage, users } = store;
  const { getUsers } = actions;

  useEffect(() => {
    getUsers(1); // Default to page 1
  }, [getUsers]);

  const handlePagination = (page) => {
    getUsers(page); // Load the trips for the selected page
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

  return (
    <div className="trips-container">
      <h2 className="page-title">Community</h2>
      <p className="page-description">
        Look at all the people that enjoy travelling as much as you do! Reach out to them and start a converstation or look at their trips and join them in their next adventure.
      </p>

      {!users || users.length === 0 ? (
        <div className="no-trips-message">
          <p>It seems that noone has join our community yet. Please check it again later.</p>
        </div>
      ) : (
        <div className="trip-cards-container">
          {users.map((user, index) => (
            <div key={index} className="trip-card">
              <div className="trip-card-image">
                <img
                  src={user.photo || user.imageUrl || "https://placehold.co/600x400?text=No+Image"}
                  alt={user.face || "Profile"}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/600x400?text=No+Image";
                  }}
                />
              </div>
              <div className="trip-card-content">
              
                {/* {store.favorites.find(fav => fav.id === trip.id) ? (
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
                  </button> */}
                
                <h3 className="trip-destination">{user.first_name|| "Unknown Name"} {user.last_name|| "Unknown Name"}</h3>
                <div className="trip-details">
                  <p className="trip-dates">
                   Age: {user.age || "Unknown age"}
                  </p>
                  <p className="trip-budget">
                    Gender: {user.gender || "N/A"}
                  </p>
                  {user.biography && (
                    <p className="trip-description">
                      {user.biography.length > 100
                        ? `${user.biography.substring(0, 100)}...`
                        : user.biography}
                    </p>
                  )}
                </div>
                <Link to={`/user/${user.id}`} className="view-more-btn">
                  View Profile <i className="fas fa-arrow-right"></i>
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