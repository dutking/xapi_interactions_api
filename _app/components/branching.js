import { scoringFunctions } from '../scoringFunctions.js';
import { AuxFunctions } from '../auxFunctions.js';

let branchingTemplate = document.createElement('template');
branchingTemplate.innerHTML = `
<style>
    * {
        margin: 0;
        padding: 0;
        line-height: var(--line-height);
        box-sizing: border-box;
        font-family: var(--font-family-primary);
        font-weight: var(--font-weight-normal);
        font-size: var(--font-size-primary);
        color: var(--color-font-dark-primary);
    }

    .branchingContainer {
        margin: 0 auto;
        max-width: var(--max-width);
        min-height: 99vh;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: max-content auto;
        gap: 3rem;
        place-items: start;
        padding-bottom: 6rem;
    }

    .branchingContainer .text {
        margin-top: 4rem;        
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
        place-items: start;
    }

    .branchingContainer .text ul {
        list-style-position: outside;
        padding-left: 1.2rem;
    }

    .score {
        font-family: var(--font-family-secondary);
        font-weight: normal;
        font-size: calc(var(--font-size-primary) * 1.3);
    }

    .buttons {
        padding-top: 1rem;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: repeat(auto-fit, max-content);
        gap: 1rem;
    }

    .btn {
        box-sizing: border-box;
        padding: var(--button-padding);
        font-size: calc(var(--font-size-regular) * 0.9);
        color: var(--button-font-color);
        background-color: var(--button-color-active);
        border-width: 0;
        border-radius: var(--button-border-radius);
        outline: none;
        cursor: pointer;
        width: max-content;
        max-width: 100%;
        text-align: left;
    }

    .btn:hover {
        background-color: var(--button-color-hover);
    }

    .btn:disabled {
        background-color: var(--button-color-disabled);
        cursor: auto;
        pointer-events: none;
    }

    .inactive {
        cursor: auto;
        pointer-events: none;
    }

    .off {
        display: none;
    }

    .offTotal {
        display: none !important;
    }
</style>
<div class='branchingContainer'>
    <div class='text'></div>
    <div class='buttons'></div>
</div>
`;

export class Branching extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.appendChild(branchingTemplate.content.cloneNode(true));
    }

    init(placeholder, interaction, db, stateData = {}) {
        let that = this;
        this.parentId = config.id;
        this.placeholder = placeholder;
        this.data = interaction;
        this.db = db;
        this.attempt = 0;
        this.state = stateData;
        this.userAnswers = [];
        this.scores = [];
        this.processedScores = [];
        this.currentScore = 0;
        this.finalScreen = '';

        this.placeholder.appendChild(this);
        this.setCSS();
        this.setListeners();

        if (this.state?.completed) {
            this.completed = this.state.completed;
            this.scores = this.state.scores;
            this.processedScores =
                this.state?.processedScores ?? this.state.scores;
            this.attempt = this.state.attempt;
            this.finalScreen = this.state.finalScreen;
            this.setContent(this.finalScreen);
        } else {
            this.setContent();
        }
    }

    setCSS() {
        this.placeholder.classList.add('branching');
        const stylesheet = Array.from(document.styleSheets).filter(
            (s) => s !== null && s.href !== null && s.href.includes('_app')
        )[0];
        let branchingCssRule = Array.from(stylesheet.cssRules).filter(
            (r) => r.selectorText === '#allrecords .placeholder.branching'
        )[0];

        if (this.data.style && Object.keys(this.data.style).length > 0) {
            Object.entries(this.data.style).forEach((e) => {
                branchingCssRule.style.setProperty(
                    e[0].replace('_', '-'),
                    e[1]
                );
            });
        }

        /* branchingCssRule.style.setProperty("background-color", "#b9d9e6");
        branchingCssRule.style.setProperty(
            "background-image",
            'url("./img/bg_.svg"), linear-gradient(180deg, rgba(185,217,230,1) 0%, rgba(185,217,230,1) 97%, rgba(196,211,170,1) 97%, rgba(196,211,170,1) 100%)'
        ); */
    }

    setContent(screenId = 's1') {
        let textDiv = this.shadowRoot.querySelector('.text');
        let buttonsDiv = this.shadowRoot.querySelector('.buttons');
        // remove prev screen buttons with animation. animate with js - then remove
        buttonsDiv.innerHTML = '';

        let screen = this.db.iterables.filter((i) => i.id === screenId)[0];

        textDiv.innerHTML = AuxFunctions.parseText(screen.story, this);
        let buttons = screen.answers.map((b) => {
            let button = document.createElement('button');
            button.setAttribute('type', 'button');
            button.classList.add('btn');
            button.innerHTML = b.text;
            button.dataset.id = b.id;
            button.dataset.next = b.next;
            button.dataset.weight = b.weight;
            return button;
        });

        if (screen?.shuffle === true) {
            buttons = this.shuffleArray(buttons);
        }

        buttonsDiv.append(...buttons);

        if (screenId.startsWith('f')) {
            buttonsDiv.classList.add('off');
        }
    }

    shuffleArray(array) {
        let newArr = Array.from(array);
        for (let i = newArr.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return newArr;
    }

    setListeners() {
        let that = this;
        this.shadowRoot
            .querySelector('.branchingContainer')
            .addEventListener('click', (e) => {
                if (e.target.tagName.toLowerCase() === 'button') {
                    that.currentScore =
                        that.currentScore + Number(e.target.dataset.weight);

                    if (e.target.dataset.next.startsWith('f')) {
                        this.finalScreen = e.target.dataset.next;
                        e.target.dataset.next = 'preFinal0';
                    }

                    if (e.target.dataset.next === 'relative') {
                        e.target.dataset.next = that.finalScreen;
                    }

                    if (e.target.dataset.next.startsWith('f')) {
                        that.finalize();
                    }

                    that.setContent(e.target.dataset.next);
                }
            });
    }

    finalize() {
        this.attempt += 1;
        this.scores.push(this.currentScore);
        if (this.data.scoringFunction) {
            this.processedScores =
                scoringFunctions[this.data.scoringFunction](this);
        } else {
            this.processedScores = Array.from(this.scores);
        }
        this.completed = true;
        this.setState();
        this.emitEvent('completed');
        this.emitEvent('passed');
    }

    get maxPossibleScore() {
        let startPoint = 's1';
        localStorage.removeItem('Max');
        let recurse = (point, sumScore, saveScore) => {
            let currentScore = sumScore + saveScore;
            if (point.startsWith('f')) {
                if (localStorage.getItem('Max') === null) {
                    localStorage.setItem('Max', currentScore);
                } else if (localStorage.getItem('Max') < currentScore) {
                    localStorage.setItem('Max', currentScore);
                }

                currentScore = 0;
                return false;
            }
            let arrPoint = this.db.iterables.filter((i) => i.id === point)[0];

            for (let i = 0; i < arrPoint.answers.length; i++) {
                let saveScore = arrPoint.answers[i].weight;

                recurse(arrPoint.answers[i].next, currentScore, saveScore);
            }
        };

        recurse(startPoint, 0, 0);
        return Number(localStorage.getItem('Max'));
    }

    get weight() {
        let weightData = this.data.weight.split(':');
        if (weightData[0] === 'num') {
            return Number(weightData[1]);
        }
    }

    get passingScore() {
        if (typeof this.data.passingScore === 'string') {
            if (this.data.passingScore.includes('%')) {
                let multyplier = Number(
                    this.data.passingScore.replace('%', '')
                );
                return Math.ceil((this.questions.length / 100) * multyplier);
            } else {
                return Number(this.data.passingScore);
            }
        } else if (typeof this.data.passingScore === 'number') {
            return this.data.passingScore;
        }
    }

    get score() {
        return this.scores[this.scores.length - 1];
    }

    get processedScore() {
        return this?.processedScores[this.processedScores.length - 1];
    }

    get passed() {
        if (this.score >= this.passingScore) {
            return true;
        } else if (this.score < this.passingScore) {
            return false;
        }
    }

    get result() {
        switch (this.data.required) {
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

    setState() {
        let that = this;
        let time = new Date();
        this.state.id = this.data.id;
        this.state.completed = this.completed;
        this.state.scores = this.scores;
        this.state.processedScores = this.processedScores;
        this.state.finalScreen = this.finalScreen;

        this.state.attempt = this.attempt;

        if (this.state?.date) {
            this.state.date.push(time);
        } else {
            this.state.date = [time];
        }

        if (this.state?.duration) {
            this.state.duration.push(
                moment
                    .duration(
                        Math.round((time - this.startTime) / 1000),
                        'seconds'
                    )
                    .toISOString()
            );
        } else {
            this.state.duration = [
                moment
                    .duration(
                        Math.round((time - this.startTime) / 1000),
                        'seconds'
                    )
                    .toISOString(),
            ];
        }

        this.emitEvent('state_changed');
    }

    showTryAgainBtn() {
        if (this.data.tryAgain === 'until_all_attempts') {
            if (
                this.data.attemptsPerTest === 0 ||
                this.attempt < this.data.attemptsPerTest
            ) {
                this.shadowRoot
                    .querySelector('.buttons')
                    .classList.remove('off');
                this.shadowRoot
                    .querySelector('.tryAgainBtn')
                    .classList.remove('off');
            }
        } else if (this.data.tryAgain === 'until_max_score') {
            if (
                (this.attempt < this.data.attemptsPerTest ||
                    this.data.attemptsPerTest === 0) &&
                this.score < this.maxPossibleScore
            ) {
                this.shadowRoot
                    .querySelector('.buttons')
                    .classList.remove('off');
                this.shadowRoot
                    .querySelector('.tryAgainBtn')
                    .classList.remove('off');
            }
        } else if (
            (this.attempt < this.data.attemptsPerTest ||
                this.data.attemptsPerTest === 0) &&
            !this.passed
        ) {
            this.shadowRoot.querySelector('.buttons').classList.remove('off');
            this.shadowRoot
                .querySelector('.tryAgainBtn')
                .classList.remove('off');
        }
    }
}

window.customElements.define('branching-unit', Branching);
