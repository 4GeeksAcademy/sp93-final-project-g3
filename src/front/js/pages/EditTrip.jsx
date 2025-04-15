import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../../styles/editTrip.css';
import { Context } from "../store/appContext";
import { TripPhoto } from "../component/TripPhoto.jsx";

export const EditTrip = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const { tripId } = useParams();
    const { tripTravelers } = store;

  /*   const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState(""); */
    const [budget, setBudget] = useState("");
    const [ageMin, setAgeMin] = useState("");
    const [ageMax, setAgeMax] = useState("");
    const [budgetCurrency, setBudgetCurrency] = useState("");
    const [status, setStatus] = useState("");
    const [description, setDescription] = useState("");

    const isHost = store.user && store.trip && store.user.id === store.trip.host_id;

    useEffect(() => {
        const fetchTrip = async () => {
            await actions.getTrip(tripId);
            await actions.getTripTravelers(tripId);
        };
        fetchTrip();
    }, [tripId]);

    useEffect(() => {
        if (store.trip) {
            /* setStartDate(store.trip.start_date);
            setEndDate(store.trip.end_date); */
            setBudget(store.trip.budget);
            setBudgetCurrency(store.trip.budget_currency);
            setAgeMin(store.trip.age_min);
            setAgeMax(store.trip.age_max);
            setStatus(store.trip.status);
            setDescription(store.trip.description);
        }
    }, [store.trip]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSend = {
            /* start_date: startDate,
            end_date: endDate, */
            budget,
            budget_currency: budgetCurrency,
            age_min: ageMin,
            age_max: ageMax,
            status,
            description
        };
        await actions.updateTrip(tripId, dataToSend);
        navigate(`/trip-page/${tripId}`);
        console.log("data to send", dataToSend)
    };
    

    const handleCancel = () => {
        navigate(`/trip-page/${tripId}`);
    };

    const handleSelectedUser = (user) => {
        actions.setSelectedUser(user);
        navigate(`/user/${user.id}`);
    };

    const handleUploadSuccess = (imageUrl) => {
        actions.updateTripPhoto(imageUrl, tripId);
    };

    if (!store.trip) {
        return (
            <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid bg-light min-vh-100 p-4">
            <div className="container p-2">
                <div className="card p-4 shadow-sm position-relative">
                    <div className="position-absolute top-0 end-0 m-3">
                        <div className="d-flex flex-row gap-2 align-items-center">
                            
                            <button className="edit-profile-btn me-2" onClick={handleSubmit}>
                                Save Changes
                            </button>
                            <button className="edit-profile-btn bg-danger" onClick={handleCancel}>
                                Cancel
                            </button>
                        </div>
                    </div>

                    <div className="row align-items-center">
                        <div className="col-md-5 text-center">
                            <img
                                src={store.trip.photo || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"}
                                alt="Trip"
                                className="img-fluid rounded mb-2"
                            />
                            {isHost && (
                                <TripPhoto tripId={tripId} onUploadSuccess={handleUploadSuccess} />
                            )}
                        </div>
                        <div className="col-md-7">
                            <h1 className="h1">{store.trip.destination}</h1>
                            <select className="form-select mb-2" value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="planning">Planning</option>
                                <option value="finished">Finished</option>
                                <option value="ongoing">Ongoing</option><option value="cancelled">Cancelled</option>
                            </select>

                            <input
                                type="number"
                                step="0.01"
                                className="form-control mb-2"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                            />

                            <select
                                className="form-select mb-2"
                                value={budgetCurrency}
                                onChange={(e) => setBudgetCurrency(e.target.value)}
                            >
                                <option value="USD">USD - US Dollar</option>
                                <option value="EUR">EUR - Euro</option>
                                <option value="GBP">GBP - British Pound</option>
                                <option value="MXN">MXN - Mexican Peso</option>
                            </select>

                            <div className="d-flex mb-3">
                                <div className="w-50 me-2">
                                    <label className="form-label">Age Min.</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={ageMin}
                                        onChange={(e) => setAgeMin(e.target.value)}
                                    />
                                </div>
                                <div className="w-50">
                                    <label className="form-label">Age Max.</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={ageMax}
                                        onChange={(e) => setAgeMax(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container p-2">
                <div className="card p-4 shadow-sm">
                    <h2 className="h4">Details of the trip</h2>
                    <textarea
                        className="form-control mt-2"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                    />
                </div>
            </div>

            <div className="container p-2">
                <div className="card p-4 shadow-sm">
                    <h2 className="h4">Travelers</h2>
                    <div className="mt-3 d-flex flex-wrap">
                        {tripTravelers?.length ? (
                            tripTravelers.map((trav, index) => (
                                <div className="card m-2" style={{ width: "12rem" }} key={index}>
                                    <img
                                        src={trav.traveler.photo || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"}
                                        alt={trav.traveler.first_name || "Profile"}
                                        className="card-img-top"
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{trav.traveler.first_name}</h5>
                                        <p className="card-text">{trav.traveler.biography}</p>
                                        <button
                                            onClick={() => handleSelectedUser(trav.traveler)}
                                            className="btn btn-sm btn-outline-primary"
                                        >
                                            View Profile
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No one has joined this trip yet. Be the first one!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};