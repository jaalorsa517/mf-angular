import {FormWC} from "./components/form"

customElements.define("form-wc", FormWC);

const app = document.getElementById("app");
app.addEventListener("submitEvent", (e) => {
  console.log(e.detail);
 });