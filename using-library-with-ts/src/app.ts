import _ from "lodash";
import { Product } from "./product.model";

declare const GLOBAL_VARIABLE: string;

let body = document.querySelector("body")!;

const lodashShuffle = _.shuffle([1, 2, 3]);
const lodashShuffleSpan = document.createElement("span");
lodashShuffleSpan.innerText = lodashShuffle.toString();
body.insertAdjacentElement("beforeend", lodashShuffleSpan);

const globalVariableSpan = document.createElement("span");
globalVariableSpan.innerText = GLOBAL_VARIABLE;
body.insertAdjacentElement("beforeend", globalVariableSpan);

const products = [
  { title: "A Carpet", price: 29.99 },
  { title: "A Book", price: 10.99 },
];

const loadedProducts = products.map(product => {
  return new Product(product.title, product.price);
})

for (const product of loadedProducts) {
  console.log(product.getInformation());
}
