import React, { useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../../styles/tripPage.css';
import { Context } from "../store/appContext";
import { TripPhoto } from "../component/TripPhoto.jsx";

export const TripPage = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const { tripId } = useParams();
    const { requests, user, trip, tripTravelers, traveler } = store;
    const isHost = store.user && store.trip && store.user.id === store.trip.host_id;
    const isLoggedIn = !!store.user;

    const handleSelectedUser = (user) => {
        actions.setSelectedUser(user)
        navigate(`/user/${user.id}`)
    }

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
            actions.getTripTravelers(tripId);
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
                    <div className="position-absolute top-0 end-0 m-3">
                        <div className="d-flex flex-row gap-2 align-items-center">
                            {store.favorites.find(fav => fav.id === trip.id) ? (
                                <button
                                    className="favorite-btnliked"
                                    onClick={() => actions.removeFavorite(tripId)}
                                    title="Remove from favorites"
                                >
                                    <i className="fas fa-heart"></i>
                                </button>
                            ) : (
                                <button
                                    className="favorite-btn"
                                    onClick={() => actions.addFavorite(tripId)}
                                    title="Add to favorites"
                                >
                                    <i className="fas fa-heart"></i>
                                </button>
                            )}
                            {isHost && (
                                <button
                                    className="edit-btn"
                                    onClick={() => navigate(`/edit-trip/${tripId}`)}
                                    title="Edit trip"
                                >
                                    <i className="fas fa-edit"></i>
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="row align-items-center">
                        <div className="col-md-5">
                            <img
                                src={store.trip.photo || "https://imgs.search.brave.com/vbj_HDxOJOkTMgvYVE-feghHjfAR2b_lX3ipkxQqzEw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTE4/NzQwNjY0My9lcy9m/b3RvL21hbHRhLWRl/c3Rpbm8tZGUtdmlh/amUtcG9yLWVsLW1l/ZGl0ZXJyJUMzJUEx/bmVvLW1hcnNheGxv/a2stZmlzaGluZy12/aWxsYWdlLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1LXzUy/NTJGVkdyUTNsMG15/QjdqVE12NE50Q1VG/TUhaUWlnclZkWEFq/ZHpNPQ"}
                                alt="Trip"
                                className="img-fluid rounded"
                            />
                            {isHost && (
                                <TripPhoto tripId={tripId} onUploadSuccess={handleUploadSuccess} />
                            )}
                        </div>

                        <div className="col-md-7">
                            <h1 className="h3">{store.trip.destination}</h1>
                            <h3><span className="insigniaVerde badge">{store.trip.status || "Tag"}</span></h3>
                            <p className="text-success fw-bold">${store.trip.budget || "50"} budget</p>
                            <div className="d-flex mb-3">
                                <div className="w-50 me-2">
                                    <h5 >Start date</h5>
                                    <p>{store.trip.start_date}</p>
                                </div>
                                <div className="w-50">
                                    <h5>End date</h5>
                                    <p>{store.trip.end_date}</p>
                                </div>
                            </div>
                            <div className="d-flex mb-3">
                                <div className="w-50 me-2">
                                    <h5 >Min. Age</h5>
                                    <p>{store.trip.age_min}</p>
                                </div>
                                <div className="w-50">
                                    <h5>Max. Age</h5>
                                    <p>{store.trip.age_max}</p>
                                </div>
                            </div>
                            {!isHost && (
                                <>
                                    {isLoggedIn ? (
                                        store.requests.find(request => request.id.toString() === tripId) ? (
                                            <div>
                                                <button className="travelers-btn m-3" onClick={handleLeaveTrip} title="Leave trip">
                                                    Leave trip
                                                </button>
                                                <span className="insigniaVerde badge text-end">{requests.authorization || "Tag"}</span>
                                            </div>
                                        ) : (
                                            <button className="travelers-btn m-3" onClick={handleJoinTrip} title="Join trip">
                                                Join the adventure
                                            </button>
                                        )
                                    ) : (
                                        <div className="alert alert-warning mt-3">
                                            <strong>Oops!</strong> You don’t seem to be logged in.{" "}
                                            <a href="/login" className="alert-link">Click here to log in</a> or{" "}
                                            <a href="/register" className="alert-link">register</a>.
                                        </div>
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
                    <p className="text-muted mt-2">{store.trip.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."}</p>
                </div>
            </div>

            <div className="container mt-4">
                <div className="card p-4 shadow-sm">
                    <h2 className="h4">Travelers</h2>
                    <div className="mt-3">
                        {!tripTravelers || tripTravelers.length === 0 ? (
                            <div className="no-trips-message">
                                <p>No one has joined this trip yet. Be the first one!</p>
                            </div>
                        ) : (
                            <div>
                                {tripTravelers.length > 4 ? (
                                    <div id="travelersCarousel" className="carousel slide" data-bs-ride="carousel">
                                        <div className="carousel-inner">
                                            <div className="carousel-item active">
                                                <div className="d-flex justify-content-start">
                                                    {tripTravelers.slice(0, 4).map((trav, index) => (
                                                        <div className="card m-2" style={{ width: "12rem" }} key={index}>
                                                            <img
                                                                src={trav.traveler.photo || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"}
                                                                alt={trav.traveler.first_name || "Profile"}
                                                                className="card-img-top"
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png";
                                                                }}
                                                            />
                                                            <div className="card-body">
                                                                <h5 className="card-title">{trav.traveler.first_name}</h5>
                                                                <p className="card-text">{trav.traveler.biography}</p>
                                                                <button
                                                                    onClick={() => handleSelectedUser(trav.traveler)}
                                                                    className="view-more-btn"
                                                                >
                                                                    View Profile <i className="fas fa-arrow-right"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {tripTravelers.slice(4, tripTravelers.length).map((trav, index) => (
                                                <div className="carousel-item" key={index}>
                                                    <div className="d-flex justify-content-start">
                                                        <div className="card m-2" style={{ width: "12rem" }} key={index}>
                                                            <img
                                                                src={trav.traveler.photo || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"}
                                                                alt={trav.traveler.first_name || "Profile"}
                                                                className="card-img-top"
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png";
                                                                }}
                                                            />
                                                            <div className="card-body">
                                                                <h5 className="card-title">{trav.traveler.first_name}</h5>
                                                                <p className="card-text">{trav.traveler.biography}</p>
                                                                <button
                                                                    onClick={() => handleSelectedUser(trav.traveler)}
                                                                    className="view-more-btn"
                                                                >
                                                                    View Profile <i className="fas fa-arrow-right"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <button className="carousel-control-prev" type="button" data-bs-target="#travelersCarousel" data-bs-slide="prev">
                                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                            <span className="visually-hidden">Previous</span>
                                        </button>
                                        <button className="carousel-control-next" type="button" data-bs-target="#travelersCarousel" data-bs-slide="next">
                                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                            <span className="visually-hidden">Next</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="d-flex flex-wrap justify-content-start">
                                        {tripTravelers.map((trav, index) => (
                                            <div className="card m-2" style={{ width: "12rem" }} key={index}>
                                                <img
                                                    src={trav.traveler.photo || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"}
                                                    alt={trav.traveler.first_name || "Profile"}
                                                    className="card-img-top"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png";
                                                    }}
                                                />
                                                <div className="card-body">
                                                    <h5 className="card-title">{trav.traveler.first_name}</h5>
                                                    <p className="card-text">{trav.traveler.biography}</p>
                                                    <button
                                                        onClick={() => handleSelectedUser(trav.traveler)}
                                                        className="view-more-btn"
                                                    >
                                                        View Profile <i className="fas fa-arrow-right"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div> 
    );
};