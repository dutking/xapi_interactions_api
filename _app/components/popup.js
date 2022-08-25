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
    
}

.popupContainer {
    box-sizing: border-box;
    position: fixed;
    inset: 0;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    align-items: center;
    justify-items: center;
    align-content: center;
    justify-content: center;
    font-family: var(--font-family-primary);
    font-weight: var(--font-weight-regular);
    font-size: var(--font-size-primary);
    color: var(--color-font-dark-primary);
}

.popupContainer.hidden {
    display: none;
}

.popupContainer .shade {
    grid-area: 1 / 1 / 2 / 2;
    background: var(--popup-shade-background);
    /*backdrop-filter: var(--popup-shade-backdrop-filter);*/
    min-width: 100%;
    min-height: 100%;
    z-index: 1;
}

.popupContainer .shade:hover{
    cursor: pointer;
}

.popupContainer .modal {
    grid-area: 1 / 1 / 2 / 2;
    box-sizing: border-box;
    background: var(--popup-modal-background);
    padding: var(--popup-modal-padding);
    min-width: var(--popup-modal-min-width);
    max-width: var(--popup-modal-max-width);
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    row-gap: var(--popup-modal-row-gap);
    pointer-events: none;
    cursor: auto;
    z-index: 2;
    animation-name: popup;
    animation-duration: 300ms;
    animation-delay: 0;
    animation-iteration-count: 1;
    animation-direction: normal;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
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
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    row-gap: 2rem;
}

.modal .content .tip {
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 1rem;
}

.modal .content .tipHeader {
    display: grid;
    grid-template-columns: 47px 1fr;
    column-gap: 1rem;
    align-content: center;
    align-items: center;
    font-style: italic;
}

.modal .content .tipHeader::before {
    content: url(_app/components/img/bulb.svg);
    display: inline-block;
    width: 47px;
    height: 46px;
}

.popupContainer .closeBtn {
    grid-area: 1 / 1 / 2 / 2;
    position: absolute;
    box-sizing: border-box;
    border-width: 0;
    top: var(--popup-closeBtn-top);
    right: var(--popup-closeBtn-right);
    width: var(--popup-closeBtn-width);
    height: var(--popup-closeBtn-height);
    background: transparent;
    outline: none;
    cursor: pointer;
    transition: all 300ms linear;
    z-index: 1;
}

.popupContainer .closeBtn::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 2px;
    height: 29px;
    background: #fff;
    transform-origin: 50% 0;
    transform: rotate(-45deg);
    transition: background 150ms linear;
    pointer-events: none;
}

.popupContainer .closeBtn::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 2px;
    height: 29px;
    background: #fff;
    transform-origin: 50% 0;
    transform: rotate(45deg);
    transition: background 150ms linear;
    pointer-events: none;
}

.popupContainer .closeBtn:hover::after, .popupContainer .closeBtn:hover::before {
    background: #ccc;
}

@keyframes popup {
    from {
        transform: translateY(50px);
        opacity: 0;
    }

    to {
        transform: translateY(0px);
        opacity: 1;
    }
}

</style>

    <div class="popupContainer">
        <div class="shade"></div>
        <div class="modal">
            <header>
                <p class="header"></p>
            </header>
            <div class="content">
            </div>
        </div>
        
        <button class="closeBtn" type="button"></button>
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

    updateContent(header, content) {
        this.header = header
        this.content = content
        this.setContent()
    }

    setContent(){
        let headerElement = this.shadowRoot.querySelector('.header')
        let contentElement = this.shadowRoot.querySelector('.content')

        if(this.header){
            headerElement.innerHTML = AuxFunctions.parseText(this.header)
        }

        contentElement.innerHTML = AuxFunctions.parseText(this.content)
    }

    setListeners() {
        let closeBtn = this.shadowRoot.querySelector('.closeBtn')
        closeBtn.addEventListener('click', this.closePopup.bind(this))

        let shade = this.shadowRoot.querySelector('.shade')
        shade.addEventListener('click', this.closePopup.bind(this))
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