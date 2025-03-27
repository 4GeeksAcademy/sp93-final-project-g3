import React, { useContext, useState } from "react";
import { InputSearch } from "../component/InputSearch.jsx";
import { Context } from "../store/appContext";
import "../../styles/designTrip.css";

export const DesignTrip = () => {
  const { store, actions } = useContext(Context);

  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [availableSeats, setAvailableSeats] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState("");
  const [budget, setBudget] = useState("");
  const [budgetCurrency, setBudgetCurrency] = useState("USD");
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");
  const status = "planning";

  const handlePlaceSelected = (place) => {
    const dest = place.formatted_address || place.name;
    setDestination(dest);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tripData = {
      destination,
      start_date: startDate,
      end_date: endDate,
      available_seats: parseInt(availableSeats),
      description,
      photo,
      budget: parseFloat(budget),
      budget_currency: budgetCurrency,
      age_min: ageMin ? parseInt(ageMin) : null,
      age_max: ageMax ? parseInt(ageMax) : null,
      status
    };

    const result = await actions.createTrip(tripData);
    if (result && result.results) {
      alert("Trip created successfully!");
    } else {
      alert("Error creating trip. Please try again.");
    }
  };

  return (
    <div className="design-trip-container">
      <h2 className="form-title">Design Your Trip</h2>
      <form onSubmit={handleSubmit} className="design-trip-form">
        {/* Destination */}
        <div className="mb-3">
          <label className="form-label">Destination</label>
          <InputSearch onPlaceSelected={handlePlaceSelected} />
        </div>

        {/* Start Date */}
        <div className="mb-3">
          <label className="form-label">Start Date</label>
          <input
            type="date"
            className="form-control custom-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        {/* End Date */}
        <div className="mb-3">
          <label className="form-label">End Date</label>
          <input
            type="date"
            className="form-control custom-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        {/* Available Seats */}
        <div className="mb-3">
          <label className="form-label">Available Seats</label>
          <input
            type="number"
            className="form-control custom-input"
            placeholder="Enter number of seats"
            value={availableSeats}
            onChange={(e) => setAvailableSeats(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control custom-input"
            placeholder="Describe your trip..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            required
          ></textarea>
        </div>

        {/* Photo URL */}
        <div className="mb-3">
          <label className="form-label">Photo URL</label>
          <input
            type="text"
            className="form-control custom-input"
            placeholder="Enter photo URL"
            value={photo}
            onChange={(e) => setPhoto(e.target.value)}
          />
        </div>

        {/* Budget */}
        <div className="mb-3">
          <label className="form-label">Budget</label>
          <input
            type="number"
            step="0.01"
            className="form-control custom-input"
            placeholder="Enter budget amount"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
          />
        </div>

        {/* Budget Currency Dropdown */}
        <div className="mb-3">
          <label className="form-label">Budget Currency</label>
          <select
            className="form-select custom-input"
            value={budgetCurrency}
            onChange={(e) => setBudgetCurrency(e.target.value)}
            required
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="MXN">MXN - Mexican Peso</option>
          </select>
        </div>

        {/* Age Range */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Minimum Age</label>
            <input
              type="number"
              className="form-control custom-input"
              placeholder="Enter minimum age"
              value={ageMin}
              onChange={(e) => setAgeMin(e.target.value)}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Maximum Age</label>
            <input
              type="number"
              className="form-control custom-input"
              placeholder="Enter maximum age"
              value={ageMax}
              onChange={(e) => setAgeMax(e.target.value)}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button type="submit" className="btn custom-btn">
            Create Trip
          </button>
        </div>
      </form>
    </div>
  );
};