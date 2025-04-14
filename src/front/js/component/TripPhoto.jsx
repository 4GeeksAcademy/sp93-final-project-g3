import React, { useEffect, useState, useContext } from "react";
import { Cloudinary } from "@cloudinary/url-gen";
import '../../styles/tripPhoto.css';
import { Context } from "../store/appContext";

export const TripPhoto = ({ tripId }) => {
  const { actions, store } = useContext(Context);
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const cld = new Cloudinary({
    cloud: {
      cloudName: "dxbd6u6pq",
    },
  });

  // Cargar la imagen actual cuando el componente se monta o cambia el viaje seleccionado
  useEffect(() => {
    // Si hay un viaje seleccionado con una imagen, establece la URL de la imagen
    if (store.selectedTrip && store.selectedTrip.photo_url) {
      setImageUrl(store.selectedTrip.photo_url);
    }
  }, [store.selectedTrip]);

  useEffect(() => {
    const loadCloudinaryWidget = () => {
      if (window.cloudinary) {
        const myWidget = window.cloudinary.createUploadWidget(
          {
            cloudName: "dxbd6u6pq",
            uploadPreset: "pedro_florit",
            cropping: true,
            croppingAspectRatio: 1,
            croppingDefaultSelectionRatio: 1,
            showSkipCropButton: false,
            sources: ["local", "camera", "url", "facebook", "google_drive", "dropbox", "instagram"],
            multiple: false,
          },
          (error, result) => {
            if (!error && result && result.event === "success") {
              console.log("Photo uploaded successfully: ", result.info);
              setIsLoading(true); // Activar estado de carga
              updateTripPhoto(result.info.secure_url);
            }
          }
        );
        document
          .getElementById("upload_widget")
          .addEventListener("click", () => myWidget.open(), false);
      }
    };

    if (!window.cloudinary) {
      const script = document.createElement("script");
      script.src = "https://upload-widget.cloudinary.com/latest/global/all.js";
      script.async = true;
      script.onload = loadCloudinaryWidget;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    } else {
      loadCloudinaryWidget();
    }
  }, []);

  const updateTripPhoto = async (photoUrl) => {
    try {
      setImageUrl(`${photoUrl}?${Date.now()}`); // Evita caché; // 1. Limpiar la imagen actual
      setIsLoading(true);

      const actualTripId = tripId || (store.trips?.id);
      await actions.updateTripPhoto({ photoUrl, tripId: actualTripId });

      setImageUrl(photoUrl); // 2. Establecer la nueva URL
      actions.getTrip(actualTripId);
    } catch (error) {
      console.error("Error al actualizar la foto", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container text-center mt-2">
      {/* {imageUrl && (
        <div className="mb-3">
          <AdvancedImage
            cldImg={cld.image(imageUrl.split('/').pop().split('.')[0])
              .resize(Resize.fill().width(150).height(150))}
            className="img-thumbnail rounded-circle"
          />
        </div>
      )} */}
      <button
        id="upload_widget"
        className="btn edit-photo-btn d-flex align-items-center justify-content-center gap-2 m-auto"
        disabled={isLoading}
      >
        <i className="fas fa-camera"></i>
        {isLoading ? 'Uploading...' : 'Upload Picture'}
      </button>
      {imageUrl && !isLoading && <p className="text img-upload mt-2">Photo uploaded successfully</p>}
      {isLoading && <p className="text img-upload mt-2">...</p>}
    </div>
  );
};