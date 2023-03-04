import API_KEY from "./key";
import axios from "axios";

declare var google: any;

const form = document.querySelector('form') as HTMLFormElement;
const addressInput = document.querySelector('#address') as HTMLInputElement;

const GOOGLE_API_KEY = API_KEY;

type GoogleGeocodingResponse = {
    results: {geometry: {location: {lat: number, log: number}}}[];
    status: 'OK' | 'ZERO_RESULTS';
}

const script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}`;
script.async = true;
document.head.appendChild(script);

const searchAddressHandler = (event: Event) => {
    event.preventDefault();
    const enteredAddress = addressInput.value;

    axios.get<GoogleGeocodingResponse>(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(enteredAddress)}&key=${GOOGLE_API_KEY}`
    )
    .then(response => {
        if (response.data.status !== 'OK') {
            throw new Error('Could not fetch location!');
        }
        const coordinates = response.data.results[0].geometry.location;
        const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
            center: coordinates,
            zoom: 8,
        });

        new google.maps.Marker({position: coordinates, map: map});
    })
    .catch(err => {
        alert(err.message);
        console.log(err);
    });
}

form.addEventListener('submit', searchAddressHandler);