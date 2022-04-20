let longreadTemplate = document.createElement('template');
longreadTemplate.innerHTML = `
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

.longread {
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    justify-items: var(--longread-justify-items);
    align-items: var(--longread-align-items);
    justify-content: var(--longread-justify-content);
    align-content: var(--longread-align-content);
    row-gap: 2rem;
    max-width: var(--max-width);
    min-height: var(--longread-min-height);
    background: var(--longread-bg-color, white);
}

.btn {
    display: flex;
    flex-direction: row;
    align-content: center;
    align-items: center;
    justify-content: center;
    justify-items: center;
    gap: .5rem;
    line-height: 1;
    box-sizing: border-box;
    padding: var(--button-padding);
    font-family: var(--button-font-family);
    font-size: var(--button-font-size);
    font-weight: var(--button-font-weight);
    font-style: var(--button-font-style);
    letter-spacing: var(--button-letter-spacing, unset);
    color: var(--button-color-normal);
    background: var(--button-bg-color-normal);
    border-width: 0;
    border-style: var(--button-border-style);
    border-width: var(--button-border-width-normal);
    border-color: var(--button-border-color-normal);
    border-radius: var(--button-border-radius);
    outline: none;
    cursor: pointer;
    width: var(--button-width);
    text-shadow :var(--button-text-shadow-normal, none);
    box-shadow :var(--button-box-shadow-normal, none);
    transition: all 200ms linear;
    transform-origin: var(--button-transform-origin);
    transform: var(--button-transform-normal);
}

.btn:hover{
    color: var(--button-color-hover);
    background: var(--button-bg-color-hover);
    border-width: var(--button-border-width-hover);
    border-color: var(--button-border-color-hover);
    transform: var(--button-transform-hover);
    text-shadow :var(--button-text-shadow-hover, none);
    box-shadow :var(--button-box-shadow-hover, none);
}

.btn:active{
    color: var(--button-color-active);
    background: var(--button-bg-color-active);
    border-width: var(--button-border-width-active);
    border-color: var(--button-border-color-active);
    text-shadow :var(--button-text-shadow-active, none);
    box-shadow :var(--button-box-shadow-active, none);
}

.btn:disabled{
    color: var(--button-color-disabled);
    background-color: var(--button-bg-color-disabled);
    border-width: var(--button-border-width-disabled);
    border-color: var(--button-border-color-disabled);
    text-shadow :var(--button-text-shadow-disabled, none);
    box-shadow :var(--button-box-shadow-disabled, none);
    cursor: auto;
    pointer-events: none;
}

</style>
<div class='longread'>
        <button class='btn nextBtn' type='button'></button>        
</div>
`;

export class Longread extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.appendChild(longreadTemplate.content.cloneNode(true));
    }

    init(placeholder, interaction, stateData = {}, parent) {
        this.parent = parent;
        this.placeholder = placeholder;
        this.data = interaction;
        this.state = stateData;
        this.completed = false;
        this.passed = false;
        this.score = 0;
        this.startTime = new Date();
        this.setButtons();
        this.emitEvent('interacted');
        this.setListeners();

        if ('completed' in this.state) {
            this.passed = this.state.passed;
            this.completed = this.state.completed;
        }

        this.placeholder.append(this);
        this.placeholder.classList.add(this.data.structure[0]);
    }

    setButtons() {
        Object.keys(this.data.buttons).forEach((k) => {
            let btn = this.shadowRoot.querySelector(`.${k}Btn`);
            if (btn) {
                btn.innerHTML = this.data.buttons[k].initial;
                if (this.data.buttons[k].icon === true) {
                    btn.classList.add('icon');
                }
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

    setListeners() {
        let that = this;
        let nextBtn = this.shadowRoot.querySelector('.nextBtn');
        nextBtn.addEventListener('click', (e) => {
            that.emitEvent('exited');
        });
    }

    get iri() {
        return `${this.parent.iri}/${this.data.id}`
    }

    get maxScore() {
        return 1;
    }

    get weight() {
        return 1;
    }

    get maxPossibleScore() {
        return 1;
    }

    get result() {
        switch (this.data.requiredState) {
            case 'passed':
                if (this.passed) {
                    return true;
                }
                break;
            case 'completed':
                if (this.completed) {
                    return true;
                }
                break;
            case 'none':
                return true;
                break;
            default:
                break;
        }
    }

    setState() {
        this.state.date = new Date();
        this.state.id = this.data.id;
        this.state.completed = this.completed;
        this.state.passed = this.passed;
        this.state.result = this.result;

        if ('isFake' in this.state) {
            delete this.state.isFake;
        }

        this.emitEvent('state_changed');
    }
}

window.customElements.define('longread-unit', Longread);
