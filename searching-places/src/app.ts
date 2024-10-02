const form = document.querySelector("form")!;
const addressInput = document.querySelector("#address")! as HTMLInputElement;

const apiKey = process.env.GOOGLE_API_KEY;

const searchAddressHandler = (event: Event) => {
  event.preventDefault();
  const enteredAddress = addressInput.value;

  // 제출받은 주소 정보를 구글 API를 이용해 검색할 부분
  console.log(enteredAddress);
}

form.addEventListener("submit", searchAddressHandler);
