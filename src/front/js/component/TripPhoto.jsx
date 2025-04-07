import React, { useEffect, useState } from "react";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { Resize } from "@cloudinary/url-gen/actions/resize";
import { useContext } from "react";
import '../../styles/tripPhoto.css';
import { Context } from "../store/appContext";

export const TripPhoto = () => {
  const { actions } = useContext(Context);
  const [imageUrl, setImageUrl] = useState(null);
  const cld = new Cloudinary({
    cloud: {
      cloudName: "dxbd6u6pq",
    },
  });

  useEffect(() => {
    const loadCloudinaryWidget = () => {
      if (window.cloudinary) {
        const myWidget = window.cloudinary.createUploadWidget(
          {
            cloudName: "dxbd6u6pq",
            uploadPreset: "pedro_florit",
            cropping: true,  // Opcional: habilita el recorte de imagen
            croppingAspectRatio: 1,  // Relación de aspecto 1:1 para foto de perfil
            croppingDefaultSelectionRatio: 1,
            showSkipCropButton: false,
            sources: ["local", "camera"], // Fuentes permitidas
            multiple: false, // Solo permitir una imagen
          },
          (error, result) => {
            if (!error && result && result.event === "success") {
              console.log("Imagen subida con éxito: ", result.info);
              setImageUrl(result.info.secure_url);
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
      // Llamar a la acción del contexto para actualizar la foto en el backend
      const response = await actions.updateTripPhoto({ photo: photoUrl });
      if (response) {
        console.log("Foto de trip actualizada con éxito");
      }
    } catch (error) {
      console.error("Error al actualizar la foto de trip", error);
    }
  };

  return (
    <div className="container text-center">
      {/* {imageUrl && (
        <div className="mb-3">
          <AdvancedImage
            cldImg={cld.image(imageUrl).resize(Resize.fill().width(150).height(150))}
            className="img-thumbnail rounded-circle"
          />
        </div>
      )} */}
      <button id="upload_widget" className="btn edit-photo-btn d-flex align-items-center justify-content-center gap-2 m-auto">
        <i className="fas fa-camera"></i>
        Edit Photo
      </button>
      {imageUrl && <p className="text img-upload mt-2">¡Imagen subida con éxito!</p>}
    </div>
  );
};