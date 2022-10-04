export class FormWC extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "closed" });
    this.render();
  }

  render() {
    const style = document.createElement("style");
    style.textContent = this.getStyle();
    this.shadow.appendChild(style);
    const template = document.createElement("template");
    template.innerHTML = this.getTemplate();
    this.shadow.appendChild(template.content.cloneNode(true));
  }

  getStyle() {
    return `
      :host {
        display: block;
        min-width: 300px;
        font-size: 16px;
        font-family: sans-serif;
        --color-font: #217354;
        --color-background: #fff;
        --color-principal: #11ae11;
        --color-font-light: #fff;
      }
      .formData {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        gap: 1em;
      }
      .formData__title{
        margin: 0.3em;
      }
      .formData__button:disabled {
        background-color: #ccc;
        color: #fff;
      }
      .formData__button{
        padding: 0.5em;
        border-radius: 0.2em;
        border: none;
        background-color: var(--color-principal);
        color: var(--color-font-light);
        cursor: pointer;
      }
      .formData__button:hover{
        opacity: 0.8;
      }
   `;
  }

  getTemplate() {
    return `
      <form class="formData">
        <h3 class="formData__title">${this.title}</h3>
        <slot class="formData__slot"></slot>
        <input class="formData__button" type="submit" value="Submit">
      </form>
    `;
  }

  eventSubmit(e) {
    e.preventDefault();
    const formData = this.getChildrenData();
    this.dispatchEvent(
      new CustomEvent("submitEvent", {
        detail: formData,
      })
    );
  }

  getChildrenData() {
    const children = this.shadow.querySelector(".formData__slot").assignedNodes();
    const formData = {};
    children.forEach((child) => {
      if (child.name) {
        formData[child.name] = child.value;
      }
    });
    return formData;
  }

  connectedCallback() {
    this.shadow.querySelector("form").addEventListener("submit", this.eventSubmit.bind(this));
    this.title = this.getAttribute("title") || "";
  }

  disconnectedCallback() {
    this.shadow.querySelector("form").removeEventListener("submit", this.eventSubmit.bind(this));
  }

  static get observedAttributes() {
    return ["title", "*"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.title = newValue;
      this.shadow.querySelector(".formData__title").textContent = this.title;
    }
  }
}
