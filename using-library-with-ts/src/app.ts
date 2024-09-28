import _ from "lodash";

declare const GLOBAL_VARIABLE: string;

let body = document.querySelector("body")!;

const lodashShuffle = _.shuffle([1, 2, 3]);
const lodashShuffleSpan = document.createElement("span");
lodashShuffleSpan.innerText = lodashShuffle.toString();
body.insertAdjacentElement("beforeend", lodashShuffleSpan);

const globalVariableSpan = document.createElement("span");
globalVariableSpan.innerText = GLOBAL_VARIABLE;
body.insertAdjacentElement("beforeend", globalVariableSpan);
