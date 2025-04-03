import React, { useContext, useState } from "react";
import { InputSearch } from "../component/InputSearch.jsx";
import { Context } from "../store/appContext";
import "../../styles/find.css";

export const Find = () => {
  const { store, actions } = useContext(Context);
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

  const paginatedResults = (store.searchResults || []).slice(
    (page - 1) * resultsPerPage,
    page * resultsPerPage
  );

  const handlePlaceSelected = (place) => {
    const destination = place.formatted_address || place.name;
    actions.updateSearchCriteria({ destination });
  };

  const handleSearch = () => {
    const params = new URLSearchParams({
      destination: store.searchCriteria.destination || "",
      start_date: startDate || "",
      end_date: endDate || "",
      min_age: localFilters.minAge || "",
      max_age: localFilters.maxAge || "",
      budget: localFilters.budget || "",
      sort_by_price: localFilters.sortByPrice || "",
    });
  
    actions.performSearch(params.toString());
  };

  const handleLocalFilterChange = (filterName, value) => {
    setLocalFilters({ ...localFilters, [filterName]: value });
  };

  const handleApplyFilters = () => {
    actions.updateSearchCriteria({ filters: localFilters });
    actions.performSearch();
  };

  const handlePagination = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="find-trips-container">
      <h2 className="title">Find Your Next Adventure</h2>

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
        <button className="btn search-btn" onClick={handleSearch}>
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

      <div className="trip-cards-section">
        {paginatedResults.map((trip, index) => (
          <div className="trip-card" key={index}>
            <img src={trip.photo} className="trip-image" alt={trip.destination} />
            <div className="trip-details">
              <h3>{trip.destination}</h3>
              <p>
                <strong>Budget:</strong> {trip.budget} {trip.budget_currency} <br />
                <strong>Dates:</strong> {trip.start_date} to {trip.end_date} <br />
                <strong>Available Seats:</strong> {trip.available_seats} <br />
                <strong>Age Range:</strong> {trip.age_min} - {trip.age_max} <br />
                <strong>Description:</strong> {trip.description} <br />
              </p>
              <button className="btn details-btn">See More</button>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button className="btn pagination-btn" onClick={() => handlePagination(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <button className="btn pagination-btn" onClick={() => handlePagination(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};