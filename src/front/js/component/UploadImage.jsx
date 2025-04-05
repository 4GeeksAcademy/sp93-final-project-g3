import React, { useEffect, useState } from "react";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { Resize } from "@cloudinary/url-gen/actions/resize";
import { useContext } from "react";
import { Context } from "../store/appContext";

export const UploadImage = () => {
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
              updateProfilePhoto(result.info.secure_url);
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

  const updateProfilePhoto = async (photoUrl) => {
    try {
      // Llamar a la acción del contexto para actualizar la foto en el backend
      const response = await actions.updateProfilePhoto({ photo: photoUrl });
      if (response) {
        console.log("Foto de perfil actualizada con éxito");
      }
    } catch (error) {
      console.error("Error al actualizar la foto de perfil", error);
    }
  };

  return (
    <div className="container align-items-center">
      <div className="m-auto">
        <button id="upload_widget" className="cloudinary-button">
          <i className="fas fa-camera"></i> Cambiar foto de perfil
        </button>
        {imageUrl && (
          <div className="mt-3">
            {/* <AdvancedImage
              cldImg={cld.image(imageUrl).resize(Resize.fill().width(150).height(150))}
              className="img-thumbnail rounded-circle"
            /> */}
            <p className="text-success mt-2">¡Imagen subida con éxito!</p>
          </div>
        )}
      </div>
    </div>
  );
};