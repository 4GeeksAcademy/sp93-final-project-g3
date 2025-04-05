import React, { useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../../styles/tripPage.css';
import { Context } from "../store/appContext";

export const TripPage = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const { tripId } = useParams();
    console.log("TripId from URL:", tripId);
    useEffect(() => {
        if (tripId) {
            console.log("Fetching trip with ID:", tripId);
            actions.getTrip(tripId);
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
            {/* Trip Details */}
            <div className="container mt-5">
                <div className="card p-4 shadow-sm position-relative">
                    {/* Botón de corazón posicionado en la esquina superior derecha */}
                    <button className="btn btn-outline-light position-absolute top-0 end-0 m-3">
                        <i className="fas fa-heart"></i>
                    </button>

                    <div className="row align-items-center">
                        <div className="col-md-5">
                            <img
                                src={store.trips.image || "https://imgs.search.brave.com/vbj_HDxOJOkTMgvYVE-feghHjfAR2b_lX3ipkxQqzEw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTE4/NzQwNjY0My9lcy9m/b3RvL21hbHRhLWRl/c3Rpbm8tZGUtdmlh/amUtcG9yLWVsLW1l/ZGl0ZXJyJUMzJUEx/bmVvLW1hcnNheGxv/a2stZmlzaGluZy12/aWxsYWdlLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1LXzUy/NTJGVkdyUTNsMG15/QjdqVE12NE50Q1VG/TUhaUWlnclZkWEFq/ZHpNPQ"}
                                alt="Trip"
                                className="img-fluid rounded"
                            />
                        </div>

                        <div className="col-md-7">
                            <h1 className="h3">{store.trips.destination}</h1>
                            <h3><span className="insigniaVerde badge">{store.trips.tag || "Tag"}</span></h3>
                            <p className="text-success fw-bold">${store.trips.budget || "50"} budget</p>
                            <p className="text-muted">Destination: {store.trips.destination}</p>
                            <div className="d-flex mb-3">
                                <div className="w-50 me-2">
                                    <label className="form-label">Start date</label>
                                    <input
                                        type="date"
                                        className="form-control form-control-sm"
                                        defaultValue={store.trips.startDate || "2025-05-22"}
                                        readOnly
                                    />
                                </div>
                                <div className="w-50">
                                    <label className="form-label">End date</label>
                                    <input
                                        type="date"
                                        className="form-control form-control-sm"
                                        defaultValue={store.trips.endDate || "2025-06-01"}
                                        readOnly
                                    />
                                </div>
                            </div>

                            <button className="btn btn-dark w-100">Join the adventure</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Details Section */}
            <div className="container mt-4">
                <div className="card p-4 shadow-sm">
                    <h2 className="h4">Details of the trip</h2>
                    <p className="text-muted mt-2">{store.trips.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."}</p>
                </div>
            </div>

            {/* Participants */}
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