import React, { useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../../styles/tripPage.css';
import { Context } from "../store/appContext";
import { TripPhoto } from "../component/TripPhoto.jsx";

export const EditTrip = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const { tripId } = useParams();
    const { requests, user, trip } = store;
    const isHost = store.user.id === store.selectedTrips?.host_id;
    console.log("user id", store.user?.id)
    console.log("trip data", store.selectedTrip?.host_id)

    const handleUploadSuccess = (imageUrl) => {
        actions.updateTripPhoto(imageUrl, tripId)
    };

    const handleLeaveTrip = () => {
        actions.leaveTrip(tripId)
    };

    const handleJoinTrip = () => {
        actions.joinTrip(tripId)
    };

    useEffect(() => {
        if (tripId) {
            console.log("Fetching trip with ID:", tripId);
            actions.getTrip(tripId);
            actions.getRequests();
        }
    }, [tripId]);



    if (!store.trips) {
        return (
            <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid bg-light min-vh-100">
            <div className="container mt-5">
                <div className="card p-4 shadow-sm position-relative">
                    <div className="position-absolute top-0 end-0 m-3 d-flex gap-2">
                        {store.favorites.find(fav => fav.id === selectedTrip.Id) ? (
                            <button
                                className="favorite-btn favorite-btnliked"
                                onClick={() => { actions.removeFavorite(selectedTrip.Id) }}
                                title="Remove from favorites"
                            >
                                <i className="fas fa-heart"></i>
                            </button>
                        ) : (
                            <button
                                className="favorite-btn"
                                onClick={() => { actions.addFavorite(selectedTrip.Id) }}
                                title="Add to favorites"
                            >
                                <i className="fas fa-heart"></i>
                            </button>
                        )}
                        {!isHost && (
                            <button className="btn btn-outline-light" onClick={() => navigate("/edit-trip")}>
                                <i className="fas fa-edit"></i>
                            </button>
                        )}
                    </div>
                    <div className="row align-items-center">
                        <div className="col-md-5">
                            <img
                                src={store.selectedTrip.photo || "https://imgs.search.brave.com/vbj_HDxOJOkTMgvYVE-feghHjfAR2b_lX3ipkxQqzEw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTE4/NzQwNjY0My9lcy9m/b3RvL21hbHRhLWRl/c3Rpbm8tZGUtdmlh/amUtcG9yLWVsLW1l/ZGl0ZXJyJUMzJUEx/bmVvLW1hcnNheGxv/a2stZmlzaGluZy12/aWxsYWdlLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1LXzUy/NTJGVkdyUTNsMG15/QjdqVE12NE50Q1VG/TUhaUWlnclZkWEFq/ZHpNPQ"}
                                alt="Trip"
                                className="img-fluid rounded"
                            />
                            {!isHost && (
                                <TripPhoto tripId={tripId} onUploadSuccess={handleUploadSuccess} />
                            )}
                        </div>

                        <div className="col-md-7">
                            <h1 className="h3">{store.selectedTrip.destination}</h1>
                            <h3><span className="insigniaVerde badge">{store.selectedTrip.status || "Tag"}</span></h3>
                            <p className="text-success fw-bold">${store.selectedTrip.budget || "50"} budget</p>
                            <div className="d-flex mb-3">
                                <div className="w-50 me-2">
                                    <label className="form-label">Start date</label>
                                    <input
                                        type="date"
                                        className="form-control form-control-sm"
                                        defaultValue={store.selectedTrip.startDate || "2025-05-22"}
                                        readOnly
                                    />
                                </div>
                                <div className="w-50">
                                    <label className="form-label">End date</label>
                                    <input
                                        type="date"
                                        className="form-control form-control-sm"
                                        defaultValue={store.selectedTrip.endDate || "2025-06-01"}
                                        readOnly
                                    />
                                </div>
                            </div>
                            {isHost && (
                                <>
                                    {store.requests.find(request => request.id.toString() === tripId) ? (
                                        <button className="travelers-btn" onClick={handleLeaveTrip} title="Leave trip">
                                            Leave trip
                                        </button>
                                    ) : (
                                        <button className="travelers-btn" onClick={handleJoinTrip} title="Join trip">
                                            Join the adventure
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mt-4">
                <div className="card p-4 shadow-sm">
                    <h2 className="h4">Details of the trip</h2>
                    <p className="text-muted mt-2">{store.selectedTrip.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."}</p>
                </div>
            </div>

            <div className="container mt-4">
                <div className="card p-4 shadow-sm">
                    <h2 className="h4">Participants 3/10</h2>
                    <div className="row mt-3">
                        {[1, 2, 3].map((_, index) => (
                            <div key={index} className="col-md-4">
                                <div className="card text-center p-3">
                                    <div className="rounded-circle bg-secondary mx-auto" style={{ width: "60px", height: "60px" }}></div>
                                    <p className="mt-2 fw-semibold">User name</p>
                                    <p className="text-muted">Host</p>
                                    <button className="btn btn-outline-secondary">View profile</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};