import React, { useState } from "react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";

const libraries = ["places"];
const API_KEY = process.env.GOOGLE_API_KEY;

export const InputSearch = ({ onPlaceSelected }) => {
    const [autocomplete, setAutocomplete] = useState(null);

    const onLoad = (autoC) => setAutocomplete(autoC);

    const onPlaceChanged = () => {
        if (autocomplete) {
            const place = autocomplete.getPlace();
            if (place && place.formatted_address) {
                onPlaceSelected(place);
            }
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
