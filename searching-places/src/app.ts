import axios from "axios";

const form = document.querySelector("form")!;
const addressInput = document.querySelector("#address")! as HTMLInputElement;

const apiKey = process.env.GOOGLE_API_KEY;

// Dynamic Library Import를 위한 코드
((g:any) => {
  var h: any,
    a: any,
    k: any,
    p = "The Google Maps JavaScript API",
    c: any = "google",
    l = "importLibrary",
    q = "__ib__",
    m = document,
    b: any = window;
  b = b[c] || (b[c] = {});
  var d = b.maps || (b.maps = {}),
    r = new Set(),
    e = new URLSearchParams(),
    u = () =>
      h ||
      (h = new Promise(async (f, n) => {
        await (a = m.createElement("script"));
        e.set("libraries", [...r] + "");
        for (k in g)
          e.set(
            k.replace(/[A-Z]/g, (t: any) => "_" + t[0].toLowerCase()),
            g[k]
          );
        e.set("callback", c + ".maps." + q);
        a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
        d[q] = f;
        a.onerror = () => (h = n(Error(p + " could not load.")));
        // a.nonce = m.querySelector("script[nonce]")?.nonce || ""; // 이쪽 코드에 문제가 있어서 아래와 같이 임시 조치
        a.nonce = "";
        console.log(a)
        console.log(m);
        m.head.append(a);
      }));
  d[l]
    ? console.warn(p + " only loads once. Ignoring:", g)
    : (d[l] = (f: any, ...n: any[]) =>
        r.add(f) && u().then(() => d[l](f, ...n)));
})({
  key: apiKey,
  v: "weekly",
  // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
  // Add other bootstrap parameters as needed, using camel case.
});

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
