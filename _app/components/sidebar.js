import { Pool } from './pool.js';

let sidebarTemplate = document.createElement('template');
sidebarTemplate.innerHTML = `
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

.sidebar{
    position: fixed;
    top: 0;
    box-sizing: border-box;
    display: grid;
    grid-template-columns: var(--sidebar-grid-template-columns);
    column-gap: var(--sidebar-column-gap);
    row-gap: var(--sidebar-row-gap);
    justify-content: var(--sidebar-justify-content);
    justify-items: var(--sidebar-justify-items);
    align-items: var(--sidebar-align-items);
    width: var(--sidebar-width);
    padding: var(--sidebar-padding);
    background: var(--sidebar-background);
    box-shadow: var(--sidebar-box-shadow);
    transform: var(--sidebar-transform);
    transition: var(--sidebar-transition);
    z-index: var(--z-index-base);
}

.sidebar.opened {
    transform: var(--sidebar-opened-transform);
}

.sidebarOpenerContainer {
    position: relative;
    display: grid;
    grid-template-columns: 1fr;
    align-self: var(--sidebar-openerContainer-align-self);
}

.sidebarOpenerContainer input {
    display: none;
}

.sidebarOpenerContainer label {
    position: relative;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(5, 1fr);
    box-sizing: border-box;
    width: 92px;
    height: 92px;
    justify-self: end;
    cursor: pointer;
    transform: translateY(calc(100px + 6rem));
    transition: transform 500ms linear;
}

.sidebarOpenerContainer label.opened {
    transform: translateY(0);
}

.sidebarOpenerContainer label img {
    width: 100%;
    grid-column: 1 / 6;
    grid-row: 1 / 6;
}

.sidebarOpenerContainer label img:nth-child(1){
    z-index: calc(var(--z-index-base)+2)
}

.sidebarOpenerContainer label img:nth-child(2){
    z-index: calc(var(--z-index-base)+1)
}

.sidebarOpenerContainer label span.marker {
    display: block;
    grid-column: 1 / 2;
    grid-row: 1 / 2;
    align-self: end;
    justify-self: end;
    z-index: z-index: calc(var(--z-index-base)+3);
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: transparent;    
}

.sidebarOpenerContainer label span.marker.new {
    background-color: red;
}

.sidebarContentContainer {
    box-sizing: border-box;
    display: grid;
    grid-template-columns: var(--sidebar-contentContainer-grid-template-columns);
    grid-template-rows: var(--sidebar-contentContainer-grid-template-rows);
    justify-items: var(--sidebar-contentContainer-justify-items);
    justify-content: var(--sidebar-contentContainer-justify-content);
    column-gap: var(--sidebar-contentContainer-column-gap);
    row-gap: var(--sidebar-contentContainer-row-gap);
    width: var(--sidebar-contentContainer-width);    
}

</style>
<div class="sidebar">
        <div class="sidebarContentContainer">                
        </div>
        <div class="sidebarOpenerContainer">
            <input type="checkbox" name="opener" id="opener">
            <label for="opener">
                <img class='openBtn' src="./_app/img/sidebar/button_open.svg" alt="">
                <img class='closeBtn' src="./_app/img/sidebar/button_close.svg" alt="">
                <span class='marker'></span>
            </label>
        </div>
    </div>
`;

export class Sidebar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.appendChild(sidebarTemplate.content.cloneNode(true));
    }

    init(placeholder, data) {
        this.placeholder = placeholder;
        this.data = data;

        this.setListeners();

        this.placeholder.append(this);

        if ('globalPools' in this.data) {
            this.pools = [];
            this.initPools();
            this.setListeners();
        }
    }

    initPools() {
        let that = this;

        let container = this.shadowRoot.querySelector(
            '.sidebarContentContainer'
        );

        this.data.globalPools.forEach((p, index) => {
            let pool = new Pool();

            pool.init(p.id);
            that.pools.push(pool);
            container.append(pool);
        });
    }

    updatePools() {
        this.pools.forEach((p) => p.setDynamicContent());
    }

    setListeners() {
        let that = this;
        const sidebar = this.shadowRoot.querySelector('.sidebar');
        const label = sidebar.querySelector('label');
        const input = sidebar.querySelector('input');
        const btnOpen = sidebar.querySelector('.openBtn');
        const btnClose = sidebar.querySelector('.closeBtn');
        input.addEventListener('input', (e) => {
            if (e.target.checked) {
                that.updatePools();
                sidebar.classList.add('opened');
                label.classList.add('opened');
                btnClose.style.zIndex = 2;
                btnOpen.style.zIndex = 1;
            } else {
                sidebar.classList.remove('opened');
                label.classList.remove('opened');
                btnClose.style.zIndex = 1;
                btnOpen.style.zIndex = 2;
            }
        });
    }

    emitEvent(eventName) {
        let that = this;
        let event = new CustomEvent(eventName, {
            bubbles: true,
            composed: true,
            detail: {
                obj: that,
            },
        });
        console.log(`Event "${eventName}" was dispatched by ${this.data.id}`);
        this.dispatchEvent(event);
    }
}

window.customElements.define('sidebar-unit', Sidebar);
