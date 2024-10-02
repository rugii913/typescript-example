import axios from "axios";

const form = document.querySelector("form")!;
const addressInput = document.querySelector("#address")! as HTMLInputElement;

const apiKey = process.env.GOOGLE_API_KEY;

type GoogleGeocodingResponse = {
  results: { geometry: { location: { lat: number; lng: number; } } }[];
  status: "OK" | "ZERO_RESULTS";
}

const searchAddressHandler = (event: Event) => {
  event.preventDefault();
  const enteredAddress = addressInput.value;

  axios
    .get<GoogleGeocodingResponse>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(enteredAddress)}&key=${apiKey}`
    )
    .then(response => {
      if (response.data.status !== "OK") {
        throw new Error("Could not fetch location!");
      }
      const coordinates = response.data.results[0].geometry.location;
      console.log(coordinates);
    })
    .catch((err: Error) => {
      alert(err.message);
      console.log(err);
    });
}

form.addEventListener("submit", searchAddressHandler);
