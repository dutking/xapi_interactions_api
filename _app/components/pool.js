const poolTemplate = document.createElement('template');
poolTemplate.innerHTML = `
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

.pool {
    box-sizing: border-box;
    display: grid;
    width: var(--pool-width);
    height: var(--pool-height);
    grid-template-columns: var(--pool-grid-template-columns);
    grid-template-rows: var(--pool-grid-template-rows);
}

.pool .char {
    display: block;
    width: var(--pool-char-width);
    grid-column: var(--pool-char-grid-column);
    grid-row: var(--pool-char-grid-row);
}

.pool .status {
    display: block;
    width: var(--pool-status-width);
    grid-column: var(--pool-status-grid-column);
    grid-row: var(--pool-status-grid-row);
}

.pool .progress {
    grid-column: var(--pool-progress-grid-column);
    grid-row: var(--pool-progress-grid-row);
    display: grid;
    grid-template-columns: var(--pool-progress-grid-template-columns);
    grid-template-rows: var(--pool-progress-grid-template-rows);
    background: var(--pool-progress-background);
    border-radius: var(--pool-progress-border-radius);
    height: var(--pool-progress-height);
    align-self: var(--pool-progress-align-self);
}

.pool .progress div {
    grid-column: var(--pool-progress-divs-grid-column);
    grid-row: var(--pool-progress-divs-grid-row);
    border-radius: var(--pool-progress-divs-border-radius);
}

.pool .progress .progressBar {
    position: relative;
    width: var(--pool-progress-bar-width);
    height: var(--pool-progress-bar-height);
    background: var(--pool-progress-bar-background);
    z-index: calc(var(--z-index-base) + 1);
}


.pool .progress .progressValue {
    position: relative;
    font-size: var(--pool-progress-value-font-size);
    line-height: 1;
    text-align: var(--pool-progress-value-text-align);
    font-weight: var(--pool-progress-value-font-weight);
    display: grid;
    grid-template-columns: var(--pool-progress-value-grid-template-columns);
    align-items: var(--pool-progress-value-align-items);
    justify-items: var(--pool-progress-value-justify-items);
    z-index: calc(var(--z-index-base) + 2);
}

.pool .name {
    grid-column: var(--pool-name-grid-column);
    grid-row: var(--pool-name-grid-row);
    display: grid;
    grid-template-columns: var(--pool-name-grid-template-columns);
    align-items: var(--pool-name-align-items);
    justify-items: var(--pool-name-justify-items);
    white-space: var(--pool-name-white-space);
    font-size: var(--pool-name-font-size);
    line-height: 1;
}
</style>
    <div class="pool" data-pool-id=''>
        <img class="char" src="" alt="char">
        <img class="status" src="" alt="status">
        <div class="progress">
            <div class="progressBar"></div>
            <div class="progressValue"></div>
        </div>
        <div class="name"></div>
    </div>
`;
export class Pool extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.appendChild(poolTemplate.content.cloneNode(true));
    }

    /* init(data) {
        this.data = data;
        this.pool = this.shadowRoot.querySelector('.pool');
        this.setContent();
    } */

    init(id) {
        this.data = App.course.data.globalPools.filter((p) => p.id === id)[0];
        this.pool = this.shadowRoot.querySelector('.pool');
        this.setContent();
    }

    setContent() {
        this.pool.setAttribute('data-pool-id', this.data.id);
        let charImage = this.pool.querySelector('.char');
        if (this.data.image === true) {
            charImage.setAttribute(
                'src',
                `./_app/img/pools/pool_${this.data.id}.svg`
            );
        }

        let name = this.pool.querySelector('.name');
        name.innerText = this.data.name;

        this.setDynamicContent();
    }

    setDynamicContent() {
        let statusImage = this.pool.querySelector('.status');
        statusImage.setAttribute(
            'src',
            `./_app/img/pools/status_${this.data.status}.svg`
        );

        let progressBar = this.pool.querySelector('.progressBar');
        let progressValue = this.pool.querySelector('.progressValue');

        let currentValue =
            (100 / this.data.value.max) * this.data.processedScore;

        progressBar.style.clipPath = `polygon(0 0, ${currentValue}% 0, ${currentValue}% 100%, 0 100%)`;
        progressValue.innerText = `${this.data.processedScore} из ${this.data.value.max}`;
    }
}

window.customElements.define('pool-unit', Pool);
