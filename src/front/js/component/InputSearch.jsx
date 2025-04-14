import React, { useContext, useState } from "react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { Context } from "../store/appContext.js"

const libraries = ["places"];
const API_KEY = process.env.GOOGLE_API_KEY;

export const InputSearch = () => {
    const [autocomplete, setAutocomplete] = useState(null);
    const { actions } = useContext(Context)

    const onLoad = (autoC) => setAutocomplete(autoC);

    const onPlaceChanged = () => {
        if (autocomplete) {
            const place = autocomplete.getPlace();
            console.log("Dirección:", place);
            actions.setSelectedTrip(place.name)
        }
    };
    return (
        <LoadScript googleMapsApiKey={API_KEY} libraries={libraries}>
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                <input
                    type="text"
                    placeholder="Buscar dirección"
                    className="custom-input"
                />
            </Autocomplete>
        </LoadScript>
    );
};
