import React, { useContext, useState } from "react"
import "../../styles/editProfile.css";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const EditProfile = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: store.user.first_name || "",
        last_name: store.user.last_name || "",
        biography: store.user.biography || ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            const success = await actions.editProfile(formData);
            if (success) {
                navigate("/profile");
            }
        } catch (err) {
            setError(err.message || "Error updating profile");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate("/profile");
    };

    return (
        <div className="profile-container">
            <form onSubmit={handleSubmit}>
                <div className="profile-card">
                    <div className="profile-header">
                        <img src={store.user.photo || "https://randomuser.me/api/portraits/lego/5.jpg"}
                            className="profile-image"
                            alt="Profile" />
                        <h2 className="profile-title">Edit Profile</h2>
                        <button 
                            type="submit" 
                            className="edit-profile-btn me-2"
                            disabled={loading}>
                            {loading ? "Saving..." : "Save changes"}
                        </button>
                        <button 
                            type="button" 
                            className="edit-profile-btn bg-danger" 
                            onClick={handleCancel}
                            disabled={loading}>
                            Cancel
                        </button>
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <nav className="profile-tabs">
                        <div className="nav nav-tabs" id="profile-tabs" role="tablist">
                            <button className="nav-link active"
                                id="profile-tab"
                                data-bs-toggle="tab"
                                data-bs-target="#profile"
                                type="button"
                                role="tab"
                                aria-controls="profile"
                                aria-selected="true">
                                My Profile
                            </button>
                        </div>
                    </nav>
                    <div className="tab-content profile-content" id="profile-tabs-content">
                        <div className="tab-pane fade show active"
                            id="profile"
                            role="tabpanel"
                            aria-labelledby="profile-tab"
                            tabIndex="0">
                            <div className="profile-info">
                                <div className="info-group">
                                    <label className="info-label">First Name</label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>
                                <div className="info-group">
                                    <label className="info-label">Last Name</label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>                            
                                <div className="info-group">
                                    <label className="info-label">Biography</label>
                                    <textarea
                                        name="biography"
                                        value={formData.biography}
                                        onChange={handleChange}
                                        className="form-control"
                                        rows="4"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>            
                </div>
            </form>
        </div>
    );
};