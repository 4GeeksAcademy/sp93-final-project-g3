import React, { useContext, useState } from "react";
import { InputSearch } from "../component/InputSearch.jsx";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/find.css";

export const Find = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate()
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [localFilters, setLocalFilters] = useState({
    minAge: "",
    maxAge: "",
    budget: "",
    sortByPrice: "",
  });

  const [page, setPage] = useState(1);
  const resultsPerPage = 10;
  const currentPage = page;
  const totalPages = Math.ceil((store.searchResults?.length || 0) / resultsPerPage);

  const paginatedResults = (store.searchResults || []).slice(
    (page - 1) * resultsPerPage,
    page * resultsPerPage
  );

  const handlePlaceSelected = (place) => {
    const destination = place.formatted_address || place.name;
    actions.updateSearchCriteria({ destination });
  };

  const handleSearch = (event) => {
    event.preventDefault()
    const params = new URLSearchParams({
      destination: store.selectedTrip || "",
      start_date: startDate || "",
      end_date: endDate || "",
      min_age: localFilters.minAge || "",
      max_age: localFilters.maxAge || "",
      budget: localFilters.budget || "",
      sort_by_price: localFilters.sortByPrice || "",
    });

    actions.searchTrips(params.toString());
    setPage(1); // Reset to first page on new search
  };

  const handleLocalFilterChange = (filterName, value) => {
    setLocalFilters({ ...localFilters, [filterName]: value });
  };

  const handleApplyFilters = () => {
    actions.updateSearchCriteria({ filters: localFilters });
    actions.searchTrips();
    setPage(1); // Reset to first page on filters applied
  };

  const handlePagination = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  return (
    <div className="find-trips-container">
      <h2 className="title">Find Your Next Adventure</h2>
      <form onSubmit={handleSearch}>
        <div className="search-section">
          <InputSearch onPlaceSelected={handlePlaceSelected} />
          <input
            type="date"
            className="input-field"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="input-field"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button className="btn search-btn" type="submit">
            Search
          </button>
        </div>

        <button className="btn toggle-filters-btn" onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>

        {showFilters && (
          <div className="filters-section">
            <input
              type="number"
              className="input-field"
              placeholder="Min Age"
              value={localFilters.minAge}
              onChange={(e) => handleLocalFilterChange("minAge", e.target.value)}
            />
            <input
              type="number"
              className="input-field"
              placeholder="Max Age"
              value={localFilters.maxAge}
              onChange={(e) => handleLocalFilterChange("maxAge", e.target.value)}
            />
            <input
              type="number"
              className="input-field"
              placeholder="Budget"
              value={localFilters.budget}
              onChange={(e) => handleLocalFilterChange("budget", e.target.value)}
            />
            <select
              className="input-field"
              value={localFilters.sortByPrice}
              onChange={(e) => handleLocalFilterChange("sortByPrice", e.target.value)}
            >
              <option value="">Sort by Price</option>
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>
            <button className="btn apply-filters-btn" onClick={handleApplyFilters}>
              Apply Filters
            </button>
          </div>
        )}
      </form>
      <div className="trip-cards-section">
        {paginatedResults.map((trip, index) => (
          <div className="trip-card" key={index}>
            <img src={trip.photo} className="trip-image" />
            <div className="trip-destination">
              <h3 className="trip-destination">{trip.destination}</h3>
              <p className="trip-dates">
                Start date: {trip.start_date || trip.startDate}
                End date: {trip.end_date || trip.endDate}
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
              <button onClick={() => navigate(`/trip-page/${trip.id}`)} className="view-more-btn">
                View Details <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
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