# Web component

## ¿Qué son los web components?

Los web components, o también llamados Custom Elements, son una tecnología que nos permite crear nuestros propios elementos HTML personalizados. Estos elementos pueden ser reutilizados en cualquier proyecto, y además, pueden ser utilizados en cualquier framework o librería.

## ¿Cómo se utilizan?

Los web components se utilizan de la misma forma que cualquier otro elemento HTML. Por ejemplo, si tenemos un componente llamado `my-component`, podemos utilizarlo de la siguiente forma:

```html
<my-component></my-component>
```

## ¿Cómo se crean?

Los web components se crean utilizando la API de Custom Elements. Esta API nos permite crear nuestros propios elementos HTML personalizados. Para crear un web component, debemos crear una clase que extienda de `HTMLElement`:

```js
class MyComponent extends HTMLElement {
  constructor() {
    super();
  }
}
```

Una vez creada la clase, debemos registrar el elemento personalizado utilizando el método `customElements.define`:

```js
customElements.define("my-component", MyComponent);
```

## Características

Los web components tienen las siguientes características:

- **Reutilizables**: Los web components pueden ser reutilizados en cualquier proyecto, y además, pueden ser utilizados en cualquier framework o librería.
- **Encapsulados**: Los web components encapsulan su comportamiento y estilo, evitando así que se produzcan conflictos con otros componentes.
- **Independientes**: Los web components son independientes de cualquier framework o librería, por lo que pueden ser utilizados en cualquier proyecto.

## ¿Cómo se componen?

Los web components se componen en:

- **Template**: El template es el HTML que se va a renderizar en el navegador. Este HTML puede contener estilos y elementos personalizados.
- **Style**: El style es el CSS que se va a aplicar al template.
- **Slot**: El slot es el elemento que se utiliza para renderizar el contenido del componente.
- **Shadow DOM**: El shadow DOM es el árbol DOM que se crea dentro del componente. Este árbol DOM es independiente del DOM principal, por lo que no se verá afectado por los estilos del DOM principal.
- **Custom Events**: Los custom events son eventos que se pueden emitir desde el componente, y que pueden ser escuchados desde fuera del componente.
- **Hooks**: Los hooks son los métodos que se ejecutan en diferentes momentos del ciclo de vida del componente:
  - **connectedCallback**: Se ejecuta cuando el componente se conecta al DOM.
  - **disconnectedCallback**: Se ejecuta cuando el componente se desconecta del DOM.
  - **adoptedCallback**: Se ejecuta cuando el componente es adoptado por otro elemento.
  - **attributeChangedCallback**: Se ejecuta cuando un atributo del componente cambia.

## Consideraciones a tener en cuenta.

Cuando se realice un web component, hay que pensar en la flexibilidad, por lo que es muy importante aprovechar las variables CSS para que el componente pueda ser personalizado desde fuera y los atributos HTML para que el componente pueda recibir datos desde fuera. Actualmente los framework de javascript está creando las adaptaciones para crear web components desde sus lógicas. Por ejemplo, en Angular con la librería `@angular/elements`, en Vue, lo trae nativamente y en React con la librería `react-web-component`.

## Ejemplo

```js
class FormWC extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.renderDom();
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
    <form id="formDataId" class="formData">
        <h3 class="formData__title">${this.title}</h3>
        <slot class="formData__slot">
        </slot>
        <input class="formData__button" type="submit" value="Submit">
      </form>
    `;
  }

  renderDom() {
    const style = document.createElement("style");
    style.innerHTML = this.getStyle();
    this.shadow.appendChild(style);
    const template = document.createElement("template");
    template.innerHTML = this.getTemplate();
    this.shadow.appendChild(template.content.cloneNode(true));
  }

  eventSubmit(e) {
    e.preventDefault();
    const formData = this.getChildrenData();
    this.dispatchEvent(
      new CustomEvent("submitEvent", {
        detail: formData,
      })
    );
    this.shadow.querySelector(".formData__button").setAttribute("disabled", true);
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
      this.shadow.querySelector(".formData__title").innerHTML = this.title;
    }
  }
}

customElements.define("form-wc", FormWC);
```

```html
<form-wc id="myForm" title="Bienvenido">
  <input type="text" class="myForm__nombre" name="nombre" placeholder="Nombre" />
</form-wc>
```

## Referencias

- [https://developer.mozilla.org/en-US/docs/Web/Web_Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)
- [https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)
- [https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots)
