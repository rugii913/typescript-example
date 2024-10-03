import axios from "axios";

const form = document.querySelector("form")!;
const addressInput = document.querySelector("#address")! as HTMLInputElement;

const apiKey = process.env.GOOGLE_API_KEY;

// index.html로 직접 불러온 Google maps를 TS에서 사용하기 위해 declare 사용
// declare var google: any; // @types/googlemaps 패키지를 가져오며 주석 처리

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
      const map = new google.maps.Map(document.getElementById("map")!, {
        center: coordinates,
        zoom: 16,
      });
      new google.maps.Marker({ position: coordinates, map: map })
    })
    .catch((err: Error) => {
      alert(err.message);
      console.log(err);
    });
}

form.addEventListener("submit", searchAddressHandler);
