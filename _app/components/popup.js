import { AuxFunctions } from '../auxFunctions.js';

const popupTemplate = document.createElement('template');

const popupOpenerTemplate = document.createElement('template');

popupOpenerTemplate.innerHTML = `
<style>
    .popupOpenerContainer {
        cursor: pointer;
    }
</style>

<div class="popupOpenerContainer">
</div>
`

popupTemplate.innerHTML = `
<style>
* {
    margin: 0;
    padding: 0;
    line-height: var(--line-height);
    box-sizing: border-box;
    font-family: var(--font-family-primary);
    font-weight: var(--font-weight-regular);
    font-size: var(--font-size-primary);
    color: var(--color-font-dark-primary);
}

.popupContainer {
    box-sizing: border-box;
    position: fixed;
    inset: 0;
    z-index: 10000;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    align-items: center;
    justify-items: center;
    align-content: center;
    justify-content: center;
    background: var(--popup-shade-background);
    backdrop-filter: var(--popup-shade-backdrop-filter);
}

.popupContainer.hidden {
    display: none;
}

.modal {
    box-sizing: border-box;
    background: var(--popup-modal-background);
    padding: var(--popup-modal-padding);
    min-width: var(--popup-modal-min-width);
    max-width: var(--popup-modal-max-width);
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    row-gap: var(--popup-modal-row-gap);
    position:relative;
}

.modal header {
    box-sizing: border-box;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    align-items: center;
    align-content: center;
}

.modal header .header {
    font-weight: var(--popup-modal-header-font-weight);
    font-size: var(--popup-modal-header-font-size);
    color: var(--popup-modal-header-color);
}

.modal .content {
    font-weight: var(--popup-modal-content-font-weight);
    font-size: var(--popup-modal-content-font-size);
    color: var(--popup-modal-content-color);
}

.modal .closeBtn {
    position: absolute;
    top: var(--popup-modal-closeBtn-top);
    right: var(--popup-modal-closeBtn-right);
    box-sizing: border-box;
    outline: none;
    border-width: var(--popup-modal-closeBtn-border-width);
    border-color: var(--popup-modal-closeBtn-border-color);
    border-style: var(--popup-modal-closeBtn-border-style);
    background: var(--popup-modal-closeBtn-background);
    color: var(--popup-modal-closeBtn-color);
    width: var(--popup-modal-closeBtn-width);
    height: var(--popup-modal-closeBtn-height);
    cursor: pointer;
    transition: all 300ms linear;
}

.modal .closeBtn:hover {
    background: var(--popup-modal-closeBtn-background-hover);
}

</style>
    <div class="popupContainer shade">
        <div class="modal">
            <header>
                <p class="header"></p>
                
            </header>
            <div class="content">
            
            </div>
            <button class="closeBtn" type="button"></button>
        </div>
    </div>
`;
export class Popup extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.appendChild(popupTemplate.content.cloneNode(true));
    }

    init(id, header, content) {
        this.id = id
        this.header = header
        this.content = content
        this.setContent();
        this.setListeners();
        this.append();
    }

    append() {
        this.shadowRoot.querySelector('.popupContainer').classList.add('hidden')
        this.setAttribute("id", this.id)
        document.querySelector('body').append(this)

    }

    setContent(){
        let headerElement = this.shadowRoot.querySelector('.header')
        let contentElement = this.shadowRoot.querySelector('.content')

        if(this.header){
            headerElement.innerHTML = AuxFunctions.parseText(this.header)
        }
        console.log(this.content)
        contentElement.innerHTML = AuxFunctions.parseText(this.content)
    }

    setListeners() {
        let closeBtn = this.shadowRoot.querySelector('.closeBtn')
        closeBtn.addEventListener('click', this.closePopup.bind(this))
    }

    showPopup(){
        document.querySelector('body').style.overflow = "hidden";
        this.shadowRoot.querySelector('.popupContainer').classList.remove('hidden')
    }

    closePopup() {
        document.querySelector('body').style.overflow = "auto";
        this.shadowRoot.querySelector('.popupContainer').classList.add('hidden')
    }

}

export class PopupOpener extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.appendChild(popupOpenerTemplate.content.cloneNode(true));
    }

    connectedCallback() {
        this.text = this.dataset.text || ""
        this.ref = this.dataset.ref || `pp_${window.crypto.randomUUID()}`

        if(!document.querySelector(`#${this.ref}`)){
            let popup = document.createElement('popup-unit')
            popup.init(this.ref, this.header, this.content)

        }

        this.addListeners()
        this.setContent()
    }

    addListeners(){
        this.shadowRoot.querySelector(".popupOpenerContainer").addEventListener("click", this.openPopup.bind(this))
    }

    openPopup() {
        document.querySelector(`#${this.ref}`).showPopup()
    }

    setContent(){
        if(this.text){
            this.shadowRoot.querySelector(".popupOpenerContainer").innerHTML = AuxFunctions.parseText(this.text)
        }
    }
}

window.customElements.define('popup-unit', Popup);
window.customElements.define('popup-opener-unit', PopupOpener);