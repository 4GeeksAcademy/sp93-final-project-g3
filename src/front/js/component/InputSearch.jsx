import React, {useState} from "react";
import { GoogleMap, LoadScript, Autocomplete } from "@react-google-maps/api";

const libraries = ["places"];
const apiKey = "AIzaSyCQCup2ExRRx9ywMJjSWZmiLL5N0rdP-do";

export const InputSearch = () => {
    const [autocomplete, setAutocomplete] = useState(null);
    const onLoad = (autoC) => setAutocomplete(autoC);
    const onPlaceChanged = () => {
        if (autocomplete) {
            const place = autocomplete.getPlace();
            console.log("Dirección:", place);
        }}
    return (
    <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                <input type="text" placeholder="Buscar dirección" />
            </Autocomplete>
    </LoadScript>
)
}