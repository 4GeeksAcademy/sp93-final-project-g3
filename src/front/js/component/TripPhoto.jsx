import React, { useEffect, useState, useContext } from "react";
import { Cloudinary } from "@cloudinary/url-gen";
import '../../styles/tripPhoto.css';
import { Context } from "../store/appContext";

export const TripPhoto = ({ tripId, onUploadSuccess }) => {
  const { actions } = useContext(Context);

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
        const photoUrl = result.info.secure_url;
        console.log("Photo uploaded successfully: ", result.info);
        if (tripId) {
          console.log("Acualizando foto para el viaje id:", tripId);
          console.log("url de la nueva foto", photoUrl)
          actions.updateTripPhoto({ tripId, photoUrl });
        }
        if (onUploadSuccess) {
          onUploadSuccess(photoUrl);
          console.log("photo añadida al nuevo viaje", photoUrl)
        }
      } else if (error) {
        console.error("error al subir la photo", error);
      }
    }
  );
/*   document
    .getElementById("upload_widget")
    .addEventListener("click", () => myWidget.open(), false);
}

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
}; */

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
    {/* <button
      id="upload_widget"
      className="btn edit-photo-btn d-flex align-items-center justify-content-center gap-2 m-auto"
      disabled={isLoading}
    >
      <i className="fas fa-camera"></i>
      {isLoading ? 'Uploading...' : 'Upload Picture'}
    </button>
    {imageUrl && !isLoading && <p className="text img-upload mt-2">Photo uploaded successfully</p>}
    {isLoading && <p className="text img-upload mt-2">...</p>} */}
    <button type="button" className="btn edit-photo-btn" onClick={() => myWidget.open()}>
      Upload photo <i className="fas fa-camera"></i>
    </button>
  </div>
);
};