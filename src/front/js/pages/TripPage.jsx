import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { TripPhoto } from "../component/TripPhoto.jsx";
import '../../styles/tripPage.css';

export const TripPage = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const { tripId } = useParams();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        description: "",
        budget: ""
    });
    const [isFavorite, setIsFavorite] = useState(false);

    const tripData = store.trips?.id === parseInt(tripId) ? store.trips : null;
    const isHost = tripData?.host_id === store.user?.id;
    const isLoggedIn = store.isLogged;
    const isTripFinished = tripData?.status === 'finished'; // Verifica si el viaje está terminado

    // Cargar datos iniciales y favoritos
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                await actions.getTrip(tripId);

                if (store.user?.id) {
                    const favStatus = await checkFavoriteStatus();
                    setIsFavorite(favStatus);
                }
            } catch (err) {
                setError("Error al cargar el viaje");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (tripId) loadData();
    }, [tripId, store.user?.id]);

    const checkFavoriteStatus = async () => {
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/trips/${tripId}/favorites/check`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.ok ? await response.json() : false;
        } catch (error) {
            console.error("Error checking favorite:", error);
            return false;
        }
    };

    // Sincronizar formulario
    useEffect(() => {
        if (tripData) {
            setFormData({
                description: tripData.description || "",
                budget: tripData.budget || ""
            });
        }
    }, [tripData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const updateData = {
                description: formData.description,
                budget: formData.budget
            };

            const result = await actions.updateTrip(tripId, updateData);

            if (result) {
                await actions.getTrip(tripId);
                setEditMode(false);
            }
        } catch (err) {
            setError("Error al guardar cambios");
            console.error("Error al guardar:", err);
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = async () => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        try {
            if (isFavorite) {
                await actions.removeFavorite(tripId);
            } else {
                await actions.addFavorite(tripId);
            }
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error("Error al actualizar favoritos:", error);
        }
    };

    if (loading) return <div className="spinner-border"></div>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!tripData) return <div className="alert alert-warning">Viaje no encontrado</div>;

    return (
        <div className="container-fluid bg-light min-vh-100">
            <div className="container mt-5">
                {/* Tarjeta principal con estructura corregida */}
                <div className="card p-4 shadow-sm position-relative">
                    {/* Botón "Me gusta" */}
                    <button
                        className="btn btn-outline-light position-absolute top-0 end-0 m-3"
                        onClick={toggleFavorite}
                        disabled={isTripFinished}
                    >
                        <i className={`fas fa-heart ${isFavorite ? 'text-danger' : ''}`}></i>
                    </button>

                    <div className="row g-0"> {/* Eliminamos align-items-center para evitar desalineaciones */}
                        {/* Columna de imagen - Estructura corregida */}
                        <div className="col-md-5 position-relative"
                            style={{
                                minHeight: "300px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                overflow: "hidden"
                            }}>
                            <img
                                src={tripData.photo || "https://via.placeholder.com/600x400"}
                                alt="Trip"
                                className="img-fluid h-50 w-50"
                                style={{
                                    objectFit: "cover",
                                    objectPosition: "center",
                                    minWidth: "100%",
                                    minHeight: "100%"
                                }}
                            />
                            {isHost && !isTripFinished && editMode && (
                                <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3">
                                    <TripPhoto
                                        tripId={tripId}
                                        onUploadSuccess={(url) => actions.updateTripPhoto({ photoUrl: url, tripId })}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Columna de contenido - Estructura corregida */}
                        <div className="col-md-7 p-3"> {/* Añadimos padding interno */}
                            <div className="card-body h-100 d-flex flex-column"> {/* Flex para mejor distribución */}
                                <h1 className="h3">{tripData.destination}</h1>
                                <span className={`badge ${tripData.status === 'ongoing' ? 'bg-success' : 'bg-secondary'} mb-3 align-self-start`}>
                                    {tripData.status}
                                </span>

                                {/* Botón de edición para host */}
                                {isHost && !isTripFinished && (
                                    <div className="mb-3">
                                        <button
                                            className={`btn ${editMode ? 'btn-danger' : 'btn-primary'}`}
                                            onClick={() => setEditMode(!editMode)}
                                        >
                                            {editMode ? "Cancelar Edición" : "Editar Viaje"}
                                        </button>
                                    </div>
                                )}

                                {/* Presupuesto */}
                                <div className="mb-3">
                                    <h2 className="h5">Presupuesto</h2>
                                    {isHost && !isTripFinished && editMode ? (
                                        <div className="input-group">
                                            <span className="input-group-text">$</span>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="budget"
                                                value={formData.budget}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    ) : (
                                        <p className="text-success fw-bold">${tripData.budget}</p>
                                    )}
                                </div>

                                {/* Fechas */}
                                <div className="row mb-3 g-2">
                                    <div className="col-md-6">
                                        <label className="form-label">Fecha de inicio</label>
                                        <input
                                            type="date"
                                            className="form-control form-control-sm"
                                            defaultValue={tripData.startDate || "2025-05-22"}
                                            readOnly
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Fecha de fin</label>
                                        <input
                                            type="date"
                                            className="form-control form-control-sm"
                                            defaultValue={tripData.endDate || "2025-06-01"}
                                            readOnly
                                        />
                                    </div>
                                </div>

                                {/* Botones de acción */}
                                <div className="mt-auto"> {/* Empuja los botones hacia abajo */}
                                    {!isHost && !isTripFinished && (
                                        <button
                                            className="btn btn-dark w-100 mb-2"
                                            onClick={() => isLoggedIn ? actions.addFavorite(tripId) : navigate('/login')}
                                        >
                                            {isLoggedIn ? "Unirse a la aventura" : "Inicia sesión para unirte"}
                                        </button>
                                    )}

                                    {isHost && !isTripFinished && editMode && (
                                        <button
                                            className="btn btn-success w-100"
                                            onClick={handleSave}
                                        >
                                            Guardar Cambios
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Descripción del viaje */}
                <div className="card mt-4 shadow-sm">
                    <div className="card-body">
                        <h2 className="h4">Descripción del viaje</h2>
                        {isHost && !isTripFinished && editMode ? (
                            <textarea
                                className="form-control"
                                rows="5"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Describe el viaje..."
                            />
                        ) : (
                            <p className="mt-2">{tripData.description || "No hay descripción disponible"}</p>
                        )}
                    </div>
                </div>

                {/* Mensaje si el viaje está terminado */}
                {isTripFinished && (
                    <div className="alert alert-info mt-4">
                        <i className="fas fa-info-circle me-2"></i>
                        Este viaje ha finalizado y no puede ser modificado.
                    </div>
                )}
            </div>
        </div>
    );
};