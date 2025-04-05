import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/getInspired.css";

export const Community = () => {
  const { store, actions } = useContext(Context);
  const { totalPages, currentPage, users, user } = store;
  const { getUsers } = actions;

  const currentUserId = user?.id;

  useEffect(() => {
    getUsers(1); // Cargar página 1 por defecto
  }, [getUsers]);

  const handlePagination = (page) => {
    getUsers(page);
    window.scrollTo(0, 0);
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
    <div className="trips-container">
      <h2 className="page-title">Community</h2>
      <p className="page-description">
        Look at all the people that enjoy travelling as much as you do! Reach out to them and start a conversation or look at their trips and join them in their next adventure.
      </p>

      {!users || users.length === 0 ? (
        <div className="no-trips-message">
          <p>It seems that no one has joined our community yet. Please check again later.</p>
        </div>
      ) : (
        <div className="trip-cards-container">
          {users
            .filter((user) => user.id !== currentUserId) // Filtrar el usuario logueado
            .map((user, index) => (
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
                  <h3 className="trip-destination">
                    {user.first_name || "Unknown Name"} {user.last_name || "Unknown Name"}
                  </h3>
                  <div className="trip-details">
                    <p className="trip-dates">Age: {user.age || "Unknown age"}</p>
                    <p className="trip-budget">Gender: {user.gender || "N/A"}</p>
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