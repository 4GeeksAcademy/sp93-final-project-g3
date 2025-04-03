import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/profile.css";
import { Context } from "../store/appContext";

export const Profile = () => {
    const navigate = useNavigate();
    const { store } = useContext(Context);
    const [activeTab, setActiveTab] = useState("profile"); // Estado para controlar la pestaña activa

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <img
                        src={store.user.photo || "https://randomuser.me/api/portraits/lego/5.jpg"}
                        className="profile-image"
                        alt="Profile" />
                    <h2 className="profile-title">{store.user.first_name} {store.user.last_name}</h2>
                    {activeTab === "profile" && (
                        <button
                            className="edit-profile-btn"
                            onClick={() => navigate("/edit-profile")}>
                            <i className="fas fa-edit"></i> Edit Profile
                        </button>
                    )}
                </div>
                <nav className="profile-tabs">
                    <div className="nav nav-tabs" id="profile-tabs" role="tablist">
                        <button
                            className={`nav-link ${activeTab === "profile" ? "active" : ""}`}
                            id="profile-tab"
                            onClick={() => handleTabChange("profile")}
                            type="button">
                            My Profile
                        </button>
                        <button
                            className={`nav-link ${activeTab === "trips" ? "active" : ""}`}
                            id="trips-tab"
                            onClick={() => handleTabChange("trips")}
                            type="button">
                            My Trips
                        </button>
                        <button
                            className={`nav-link ${activeTab === "favorites" ? "active" : ""}`}
                            id="favorites-tab"
                            onClick={() => handleTabChange("favorites")}
                            type="button">
                            My Favorites
                        </button>
                    </div>
                </nav>
                <div className="tab-content profile-content">
                    <div className={`tab-pane ${activeTab === "profile" ? "show active" : "fade"}`}
                        id="profile"
                        role="tabpanel"
                        aria-labelledby="profile-tab">
                        <div className="profile-info">
                            <div className="info-group">
                                <label className="info-label">First Name</label>
                                <div className="info-value">{store.user.first_name}</div>
                            </div>
                            <div className="info-group">
                                <label className="info-label">Last Name</label>
                                <div className="info-value">{store.user.last_name}</div>
                            </div>
                            <div className="info-group">
                                <label className="info-label">Email</label>
                                <div className="info-value">{store.user.email}</div>
                            </div>
                            <div className="info-group">
                                <label className="info-label">Date of Birth</label>
                                <div className="info-value">{store.user.date_of_birth || 'Not specified'}</div>
                            </div>
                            <div className="info-group">
                                <label className="info-label">Gender</label>
                                <div className="info-value">{store.user.gender || 'Not specified'}</div>
                            </div>
                            <div className="info-group">
                                <label className="info-label">Biography</label>
                                <div className="info-value bio">{store.user.biography || 'No biography yet'}</div>
                            </div>
                        </div>
                    </div>
                    <div className={`tab-pane ${activeTab === "trips" ? "show active" : "fade"}`}
                        id="trips"
                        role="tabpanel"
                        aria-labelledby="trips-tab">
                        <div className="empty-message">You haven't created any trips yet.</div>
                    </div>
                    <div className={`tab-pane ${activeTab === "favorites" ? "show active" : "fade"}`}
                        id="favorites"
                        role="tabpanel"
                        aria-labelledby="favorites-tab">
                        <div className="empty-message">You don't have any favorites yet.</div>
                    </div>
                </div>
            </div>
        </div>
    );
};