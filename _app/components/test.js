import { QuestionMC } from './question_mc.js';
import { QuestionMR } from './question_mr.js';
import { QuestionRange } from './question_range.js';
import { QuestionFillIn } from './question_fill-in.js';
import { QuestionLongFillIn } from './question_long-fill-in.js';
import { scoringFunctions } from '../scoringFunctions.js';
import { AuxFunctions } from '../auxFunctions.js';
import { Pool } from './pool.js';

let testTemplate = document.createElement('template');
testTemplate.innerHTML = `
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

    strong {
        font-weight: var(--font-weight-bold);
    }

    .testContainer {
        --test-grid-template-areas: var(--test-grid-template-areas);
        --z-index-base: 900;
        z-index: var(--z-index-base);
        display: grid;
        grid-template-columns: var(--test-grid-template-columns);
        grid-template-rows: var(--test-grid-template-rows);
        grid-template-areas: var(--test-grid-template-areas);
        row-gap: var(--test-row-gap);
        column-gap: var(--test-column-gap);
        justify-items: var(--test-justify-items);
        align-items: var(--test-align-items);
        justify-content: var(--test-justify-content);
        align-content: var(--test-align-content);

        color: var(--test-color);
        font-family: var(--test-font-family);
        font-size: var(--test-font-size);
        font-weight: var(--test-font-weight);
        font-style: var(--test-font-style);

        background: var(--test-background);

        padding: var(--test-padding);
        margin: var(--test-margin);

        border-style: var(--test-border-style);
        border-width: var(--test-border-width);
        border-color: var(--test-border-color);
        border-radius: var(--test-border-radius);
        
        width: var(--test-max-width);
        tran
    }

    .testContainer .statisticsContainer {
        grid-area: statisticsContainer;
        display: grid;
        grid-template-columns: var(--statisticsContainer-grid-template-columns);
        grid-template-rows: var(--statisticsContainer-grid-template-rows);
        grid-template-areas: var(--statisticsContainer-grid-template-areas);
        row-gap: var(--statisticsContainer-row-gap);
        column-gap: var(--statisticsContainer-column-gap);
        justify-items: var(--statisticsContainer-justify-items);
        align-items: var(--statisticsContainer-align-items);
        justify-content: var(--statisticsContainer-justify-content);
        align-content: var(--statisticsContainer-align-content);

        color: var(--statisticsContainer-color);
        font-family: var(--statisticsContainer-font-family);
        font-size: var(--statisticsContainer-font-size);
        font-weight: var(--statisticsContainer-font-weight);
        font-style: var(--statisticsContainer-font-style);

        background: var(--statisticsContainer-background);

        padding: var(--statisticsContainer-padding);

        border-style: var(--statisticsContainer-border-style);
        border-width: var(--statisticsContainer-border-width);
        border-color: var(--statisticsContainer-border-color);
        border-radius: var(--statisticsContainer-border-radius);
    }

    .testContainer .statisticsContainer .testStatistics {
        grid-area: testStatistics;
        display: grid;
        grid-template-columns: var(--testStatistics-grid-template-columns);
        grid-template-rows: var(--testStatistics-grid-template-rows);
        row-gap: var(--testStatistics-row-gap);
        column-gap: var(--testStatistics-column-gap);
        justify-items: var(--testStatistics-justify-items);
        align-items: var(--testStatistics-align-items);
        justify-content: var(--testStatistics-justify-content);
        align-content: var(--testStatistics-align-content);

        color: var(--testStatistics-color);
        font-family: var(--testStatistics-font-family);
        font-size: var(--testStatistics-font-size);
        font-weight: var(--testStatistics-font-weight);
        font-style: var(--testStatistics-font-style);

        background: var(--testStatistics-background);

        padding: var(--testStatistics-padding);

        border-style: var(--testStatistics-border-style);
        border-width: var(--testStatistics-border-width);
        border-color: var(--testStatistics-border-color);
        border-radius: var(--testStatistics-border-radius);
    }

    .testContainer .statisticsContainer .userStatistics {
        grid-area: userStatistics;
        display: grid;
        grid-template-columns: var(--userStatistics-grid-template-columns);
        grid-template-rows: var(--userStatistics-grid-template-rows);
        row-gap: var(--userStatistics-row-gap);
        column-gap: var(--userStatistics-column-gap);
        justify-items: var(--userStatistics-justify-items);
        align-items: var(--userStatistics-align-items);
        justify-content: var(--userStatistics-justify-content);
        align-content: var(--userStatistics-align-content);

        color: var(--userStatistics-color);
        font-family: var(--userStatistics-font-family);
        font-size: var(--userStatistics-font-size);
        font-weight: var(--userStatistics-font-weight);
        font-style: var(--userStatistics-font-style);

        background: var(--userStatistics-background);

        padding: var(--userStatistics-padding);

        border-style: var(--userStatistics-border-style);
        border-width: var(--userStatistics-border-width);
        border-color: var(--userStatistics-border-color);
        border-radius: var(--userStatistics-border-radius);
    }

    .testContainer .instruction {
        z-index: inherit;
        grid-area: instruction;
        display: grid;
        grid-template-columns: var(--test-instrustion-grid-template-columns);
        grid-template-rows: var(--test-instrustion-grid-template-rows);
        row-gap: var(--test-instrustion-row-gap);
        column-gap: var(--test-instrustion-column-gap);
        justify-items: var(--test-instrustion-justify-items);
        align-items: var(--test-instrustion-align-items);
        justify-content: var(--test-instrustion-justify-content);
        align-content: var(--test-instrustion-align-content);

        color: var(--test-instrustion-color);
        font-family: var(--test-instrustion-font-family);
        font-size: var(--test-instrustion-font-size);
        font-weight: var(--test-instrustion-font-weight);
        font-style: var(--test-instrustion-font-style);

        background: var(--test-instrustion-background);

        padding: var(--test-instrustion-padding);

        border-style: var(--test-instrustion-border-style);
        border-width: var(--test-instrustion-border-width);
        border-color: var(--test-instrustion-border-color);
        border-radius: var(--test-instrustion-border-radius);
        width: var(--test-best-width);
    }

    .testContainer .commonQuestion{
        z-index: inherit;
        grid-area: commonQuestion;
        display: grid;
        grid-template-columns: var(--commonQuestion-grid-template-columns);
        grid-template-rows: var(--commonQuestion-grid-template-rows);
        row-gap: var(--commonQuestion-row-gap);
        column-gap: var(--commonQuestion-column-gap);
        justify-items: var(--commonQuestion-justify-items);
        align-items: var(--commonQuestion-align-items);
        justify-content: var(--commonQuestion-justify-content);
        align-content: var(--commonQuestion-align-content);

        color: var(--commonQuestion-color);
        font-family: var(--commonQuestion-font-family);
        font-size: var(--commonQuestion-font-size);
        font-weight: var(--commonQuestion-font-weight);
        font-style: var(--commonQuestion-font-style);

        background: var(--commonQuestion-background);

        padding: var(--commonQuestion-padding);

        border-style: var(--commonQuestion-border-style);
        border-width: var(--commonQuestion-border-width);
        border-color: var(--commonQuestion-border-color);
        border-radius: var(--commonQuestion-border-radius);
        width: var(--test-best-width);
    }

    .testContainer .questionsContainer {
        z-index: calc(var(--z-index-base) + 10);
        grid-area: questionsContainer;
        display: grid;
        grid-template-columns: var(--questionsContainer-grid-template-columns);
        grid-template-rows: var(--questionsContainer-grid-template-rows);
        row-gap: var(--questionsContainer-row-gap);
        column-gap: var(--questionsContainer-column-gap);
        justify-items: var(--questionsContainer-justify-items);
        align-items: var(--questionsContainer-align-items);
        justify-content: var(--questionsContainer-justify-content);
        align-content: var(--questionsContainer-align-content);

        color: var(--questionsContainer-color);
        font-family: var(--questionsContainer-font-family);
        font-size: var(--questionsContainer-font-size);
        font-weight: var(--questionsContainer-font-weight);
        font-style: var(--questionsContainer-font-style);

        background: var(--questionsContainer-background);

        padding: var(--questionsContainer-padding);

        border-style: var(--questionsContainer-border-style);
        border-width: var(--questionsContainer-border-width);
        border-color: var(--questionsContainer-border-color);
        border-radius: var(--questionsContainer-border-radius);

        width: var(--test-best-width);
    }

    .testContainer .feedbackContainer {
        z-index: inherit;
        grid-area: feedbackContainer;
        display: grid;
        grid-template-columns: var(--feedbackContainer-grid-template-columns);
        grid-template-rows: var(--feedbackContainer-grid-template-rows);
        row-gap: var(--feedbackContainer-row-gap);
        column-gap: var(--feedbackContainer-column-gap);
        justify-items: var(--feedbackContainer-justify-items);
        align-items: var(--feedbackContainer-align-items);
        justify-content: var(--feedbackContainer-justify-content);
        align-content: var(--feedbackContainer-align-content);

        color: var(--feedbackContainer-color);
        font-family: var(--feedbackContainer-font-family);
        font-size: var(--feedbackContainer-font-size);
        font-weight: var(--feedbackContainer-font-weight);
        font-style: var(--feedbackContainer-font-style);

        background: var(--feedbackContainer-background);

        padding: var(--feedbackContainer-padding);

        border-style: var(--feedbackContainer-border-style);
        border-width: var(--feedbackContainer-border-width);
        border-color: var(--feedbackContainer-border-color);
        border-radius: var(--feedbackContainer-border-radius);

        width: var(--test-best-width);
    }

    .feedbackContainer .poolsContainer {
        box-sizing: border-box;
        display: grid;
        grid-template-columns: repeat(auto-fit, 150px);
        grid-template-rows: auto;
        justify-items: center;
        justify-content: start;
        column-gap: 4.5rem;
        row-gap: 3rem;
        width: 100%;
    }

    .feedbackContainer .poolsContainer .poolContainer {
        display: grid;
        grid-template-columns: 1fr;
        row-gap: 1rem;
        justify-content: center;
    }

    .feedbackContainer .poolsContainer .poolContainer .userPoolResult{
        padding: 0.5rem 1rem;
        border-radius: 999px;
        background-color: #F8D626;
        color: #051931;
        font-weight: bold;
        text-align: center;
        width: 50%;
        justify-self: center;
    }

    .testContainer .buttonsContainer {
        z-index: inherit;
        grid-area: buttonsContainer;
        display: grid;
        grid-template-columns: var(--test-buttonsContainer-grid-template-columns);
        grid-template-rows: var(--test-buttonsContainer-grid-template-rows);
        row-gap: var(--test-buttonsContainer-row-gap);
        column-gap: var(--test-buttonsContainer-column-gap);
        justify-items: var(--test-buttonsContainer-justify-items);
        align-items: var(--test-buttonsContainer-align-items);
        justify-content: var(--test-buttonsContainer-justify-content);
        align-content: var(--test-buttonsContainer-align-content);

        color: var(--test-buttonsContainer-color);
        font-family: var(--test-buttonsContainer-font-family);
        font-size: var(--test-buttonsContainer-font-size);
        font-weight: var(--test-buttonsContainer-font-weight);
        font-style: var(--test-buttonsContainer-font-style);

        background: var(--test-buttonsContainer-background);

        padding: var(--test-buttonsContainer-padding);
        width: var(--test-buttonsContainer-width);

        border-style: var(--test-buttonsContainer-border-style);
        border-width: var(--test-buttonsContainer-border-width);
        border-color: var(--test-buttonsContainer-border-color);
        border-radius: var(--test-buttonsContainer-border-radius);

        width: var(--test-best-width);
    }
    /* grid settings -> */

    .testContainer.resumed {
        --test-grid-template-areas: "feedbackContainer" "buttonsContainer";
    }

    /* .testContainer.correct .feedbackContainer {
        --feedbackContainer-border-color: var(--color-correct);
        --feedbackContainer-border-width: var(--border-width-secondary);
    }

    .testContainer.incorrect .feedbackContainer {
        --feedbackContainer-border-color: var(--color-incorrect);
        --feedbackContainer-border-width: var(--border-width-secondary);
    } */

    .testContainer .feedbackContainer .score {
        font-weight: var(--font-weight-bold);
    }

    .userStatistics span.interactionName {
        font-weight: var(--font-weight-semibold);
    }

    .buttonsContainer {
        padding-top: 1rem;
    }

    .btn {
        display: flex;
        flex-direction: row;
        align-content: center;
        align-items: center;
        gap: .5rem;
        line-height: 1;
        box-sizing: border-box;
        padding: var(--button-padding);
        font-family: var(--button-font-family);
        font-size: var(--button-font-size);
        font-weight: var(--button-font-weight);
        font-style: var(--button-font-style);
        color: var(--button-color-normal);
        background-color: var(--button-bg-color-normal);
        border-width: 0;
        border-style: var(--button-border-style);
        border-width: var(--button-border-width-normal);
        border-color: var(--button-border-color-normal);
        border-radius: var(--button-border-radius);
        outline: none;
        cursor: pointer;
        width: var(--button-width);
        box-shadow: var(--button-box-shadow, none);
        text-shadow:var(--button-text-shadow, none);
        text-align: center;
        justify-content: center;
        justify-items: center;
        transition: all 200ms linear;
    }

    .btn:hover{
        color: var(--button-color-hover);
        background-color: var(--button-bg-color-hover);
        border-width: var(--button-border-width-hover);
        border-color: var(--button-border-color-hover);
    }

    .btn:active{
        color: var(--button-color-active);
        background-color: var(--button-bg-color-active);
        border-width: var(--button-border-width-active);
        border-color: var(--button-border-color-active);
    }

    .btn:disabled{
        color: var(--button-color-disabled);
        background-color: var(--button-bg-color-disabled);
        border-width: var(--button-border-width-disabled);
        border-color: var(--button-border-color-disabled);
        cursor: auto;
        pointer-events: none;
    }

    .submitBtn.icon:before{
        content: url('_app/img/icons/icon_submitBtn.svg');
        display: inline-block;
    }

    .inactive {
        cursor: auto;
        pointer-events: none;
    }

    .off {
        display: none !important;
    }

    .offTotal {
        display: none !important;
    }

    @media screen and (max-width: 1355px) {
        .feedbackContainer .poolsContainer {
            grid-template-columns: repeat(auto-fit, 120px);
            column-gap: 4rem;
            row-gap: 2rem;    
        }
    }
</style>
<div class='testContainer'>
    <div class='instruction'></div>
    <div class='commonQuestion'></div>
    <div class='questionsContainer'></div>
    <div class='feedbackContainer off'></div>
    <div class='buttonsContainer'>
        <button type='button' class='tryAgainBtn btn off'></button>
        <button type='button' class='submitBtn btn off' disabled></button>
    </div>
</div>
`;

export class Test extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({
            mode: 'open',
        });

        this.shadowRoot.appendChild(testTemplate.content.cloneNode(true));
    }

    async init(placeholder, interaction, db, stateData = {}) {
        let that = this;
        this.parentId = config.id;
        this.placeholder = placeholder;
        this.data = interaction;
        this.db = db;
        this.attempt = 0;
        this.questionsToTake = [];
        this.state = stateData;
        this.completed = false;
        this.scores = [];
        this.processedScores = [];
        this.questionsOrder = [];
        this.lastQuestionShownId = '';
        this.resumed = false;
        this.status = 'initial';

        placeholder.appendChild(this);

        if (!('isFake' in this.state)) {
            this.resumed = true;
            this.attempt = this.state.attempt;
            this.completed = this.state.completed;
            this.scores = this.state.scores;
            this.processedScores = this.state.processedScores;
            this.questionsOrder = this.state.questionsOrder;
            this.lastQuestionShownId = this.state.lastQuestionShownId;
        }

        if (this.resumed === true) {
            if (this.data.resume.resume === true) {
                if ('status' in this.state) {
                    this.status = this.state.status;
                } else {
                    // to handle old version without statuses
                    if (this.completed) {
                        this.status = 'completed';
                    } else {
                        this.status = 'inProgress';
                    }
                    this.lastQuestionShownId =
                        this.questionsOrder[this.questionsOrder.length - 1];
                }
            }
        }

        this.setStaticContent();
        this.setDynamicContent(this.status).then(() => {
            this.setClasses();
            this.setListeners();
            if (this.status === 'completed') {
                this.showResumed();
            }
            this.setGridTemplateAreas();

            /* this.setState('test started') */
        });
    }

    setClasses() {
        this.placeholder.classList.add(this.data.structure[0]);

        if (this.data?.classes) {
            this.data.classes
                .split(',')
                .forEach((cl) => this.placeholder.classList.add(cl));
        }
    }

    get globalTestGridAreas() {
        return getComputedStyle(document.documentElement)
            .getPropertyValue('--test-grid-template-areas')
            .trim()
            .replaceAll('"', '')
            .replaceAll('  ', ' ')
            .split(' ');
    }

    setGridTemplateAreas() {
        let testContainer = this.shadowRoot.querySelector('.testContainer');
        let currentAreas = Array.from(testContainer.children)
            .map((element) => {
                if (!element.className.includes('off')) {
                    return element.className.split(' ')[0];
                } else {
                    return '';
                }
            })
            .filter((i) => i !== '');

        let currentAreasString = this.globalTestGridAreas
            .map((unit) => {
                if (currentAreas.includes(unit)) {
                    return `"${unit}"`;
                } else {
                    return '';
                }
            })
            .filter((unit) => unit !== '')
            .join(' ');

        Array.from(this.shadowRoot.styleSheets[0].cssRules)
            .filter((rule) => rule.selectorText === '.testContainer')[0]
            .style.setProperty(
                '--test-grid-template-areas',
                currentAreasString
            );
    }

    setStaticContent() {
        let instructionDiv = this.shadowRoot.querySelector('.instruction');
        if (this.data?.instruction && this.data.instruction.length > 0) {
            instructionDiv.innerHTML = AuxFunctions.parseText(
                this.data.instruction,
                this
            );
        } else {
            instructionDiv.classList.add('off');
        }

        let commonQuestionDiv =
            this.shadowRoot.querySelector('.commonQuestion');
        if (this.data?.commonQuestion && this.data.commonQuestion.length > 0) {
            commonQuestionDiv.innerHTML = this.data.commonQuestion;
            commonQuestionDiv.classList.remove('off');
        } else {
            commonQuestionDiv.classList.add('off');
        }

        let buttonsContainer =
            this.shadowRoot.querySelector('.buttonsContainer');
        if (this.data.displayMode !== 'all_at_once') {
            buttonsContainer.classList.add('off');
        }

        this.setButtons();
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

    get amountOfQuestions() {
        let data = this.data.amountOfQuestions;
        if (data.startsWith('num')) {
            let val = Number(data.split(':')[1]);

            if (val === 0) {
                return this.db.iterables.length;
            }

            return val;
        }

        if (data.endsWith('%')) {
            return Math.floor(
                (this.db.iterables.length / 100) *
                    Number(data.split(':')[1].split('%')[0])
            );
        }

        if (data.endsWith('groups')) {
            return Object.entries(this.data.groups).reduce((sum, e) => {
                let key = e[0];
                let value = e[1];
                if (Number(value) === 0) {
                    return (sum += this.db.iterables.filter(
                        (i) => i.group === key
                    ).length);
                } else if (Number(value) > 0) {
                    return (sum += Number(value));
                }
            }, 0);
        }
    }

    setCurrentAttemptQuestions(restore = false) {
        this.questionsToTake = [];
        let that = this;
        if (restore === false) {
            if (!this.data.amountOfQuestions.endsWith('groups')) {
                if (this.data?.shuffleQuestions === true) {
                    console.log(
                        '%cQuestions shuffled',
                        'color:blue;font-weight:bold;font-size:16px;'
                    );
                    this.questionsToTake = AuxFunctions.shuffleArray(
                        this.db.iterables.slice(0, this.amountOfQuestions)
                    );
                } else {
                    this.questionsToTake = Array.from(
                        this.db.iterables.slice(0, this.amountOfQuestions)
                    );
                }
            }

            if (this.data.amountOfQuestions.endsWith('groups')) {
                Object.entries(this.data.groups).forEach((e) => {
                    let group = e[0];
                    let questionsFromGroup = Number(e[1]);
                    if (questionsFromGroup === 0) {
                        questionsFromGroup = that.db.iterables.filter(
                            (i) => i.group === group
                        ).length;
                    }
                    let currentGroupQuestions = [];
                    if (this.data.shuffleQuestions === true) {
                        currentGroupQuestions = AuxFunctions.shuffleArray(
                            that.db.iterables.filter((i) => i.group === group)
                        );
                    } else {
                        currentGroupQuestions = that.db.iterables.filter(
                            (i) => i.group === group
                        );
                    }

                    that.questionsToTake = [
                        ...that.questionsToTake,
                        ...Array.from(
                            currentGroupQuestions.slice(0, questionsFromGroup)
                        ),
                    ];
                });
            }

            this.questionsOrder = this.questionsToTake.map((q) => q.id);
            this.lastQuestionShownId = this.questionsOrder[0];
        } else if (restore === true) {
            this.questionsToTake = this.questionsOrder.map((qId) => {
                return this.db.iterables.filter((i) => i.id === qId)[0];
            });
        }
    }

    setState(msg = '') {
        let that = this;
        console.log(
            `%c...setting test state due to: ${msg}`,
            'color:blue;font-weight:bold;'
        );
        this.state.date = new Date();
        this.state.id = this.data.id;
        this.state.completed = this.completed;
        this.state.passed = this.passed;
        this.state.result = this.result;
        this.state.scores = this.scores;
        this.state.processedScores = this.processedScores;
        this.state.userPoolsResult = this.userPoolsResult;
        this.state.questionsOrder = this.questionsOrder;
        this.state.lastQuestionShownId = this.lastQuestionShownId;
        this.state.status = this.status;
        this.state.attempt = this.attempt;
        this.state.duration = moment
            .duration(
                Math.round((this.state.date - this.startTime) / 1000),
                'seconds'
            )
            .toISOString();

        if ('isFake' in this.state) {
            delete this.state.isFake;
        }

        this.emitEvent('state_changed');
    }

    async setDynamicContent(status) {
        let that = this;

        if (status === 'inProgress' || status === 'completed') {
            // true parameter set to restore questions based on questionsOrder got from state
            this.setCurrentAttemptQuestions(true);
        } else {
            this.setCurrentAttemptQuestions();
        }

        let createdQuestions = [];

        if (this.data.displayMode === 'all_at_once') {
            this.questionsToTake.forEach((q, i) => {
                createdQuestions.push(that.createQuestion(q.id));
            });
        } else if (
            this.data.displayMode === 'one_by_one' ||
            this.data.displayMode === 'one_instead_another'
        ) {
            if (status === 'initial') {
                createdQuestions.push(
                    this.createQuestion(this.questionsToTake[0].id)
                );
            } else {
                let index = 0;
                while (
                    this.questionsToTake[index].id !== this.lastQuestionShownId
                ) {
                    createdQuestions.push(
                        this.createQuestion(this.questionsToTake[index].id)
                    );
                    index++;
                }

                createdQuestions.push(
                    this.createQuestion(this.questionsToTake[index].id)
                );
            }
        }

        return Promise.allSettled(createdQuestions).then(() => {
            let questions = Array.from(
                this.shadowRoot.querySelector('.questionsContainer').children
            );

            if (
                status !== 'initial' &&
                questions.length > 1 &&
                this.data.displayMode === 'one_instead_another'
            ) {
                questions.slice(0, -1).forEach((i) => i.classList.add('off'));
            }

            this.submitBtn = this.shadowRoot.querySelector('.submitBtn');
            if (this.data.submitMode === 'all_at_once') {
                if (status !== 'completed') {
                    this.submitBtn.classList.remove('off');
                }
            }

            if (this.allChecked) {
                this.enableElement(this.submitBtn);
            }

            return new Promise((resolve, reject) => resolve());
        });
    }

    get allChecked() {
        let questions = Array.from(
            this.shadowRoot.querySelector('.questionsContainer').children
        );

        if (questions.length === this.questionsToTake.length) {
            return questions.map((i) => i.checked).every((i) => i === true);
        } else {
            return false;
        }
    }

    getQuestionElement(id) {
        return Array.from(
            this.shadowRoot.querySelector('.questionsContainer').children
        ).filter((e) => e.data.id === id)[0];
    }

    async createQuestion(id) {
        let question = this.db.iterables.filter((q) => q.id === id)[0];
        let questionElement = document.createElement(
            `question-${question.type}`
        );

        this.shadowRoot
            .querySelector('.questionsContainer')
            .appendChild(questionElement);

        let qState = await window.XAPI.getState(this.data.id + '/' + id);

        questionElement.setFields(
            question,
            this.questionsOrder.indexOf(id),
            this,
            qState
        );

        return new Promise((resolve, reject) => {
            resolve(questionElement);
        });
    }

    get lastQuestionIndex() {
        return (
            Array.from(
                this.shadowRoot.querySelector('.questionsContainer').children
            ).length - 1
        );
    }

    deleteQuestionsStates() {
        this.db.iterables.forEach((i) =>
            window.XAPI.deleteState(`${this.data.id}/${i.id}`)
        );
    }

    restart() {
        this.attempt += 1;
        this.resumed = false;
        this.status = 'initial';
        console.log(
            `%cTest restarted. Attempt ${this.attempt}`,
            'color:blue;font-weight:bold;font-size:16px;'
        );
        /* this.shadowRoot
            .querySelector(".statisticsContainer")
            .classList.add("off");

        this.shadowRoot.querySelector(".userStatistics").classList.add("off");*/

        Array.from(
            this.shadowRoot.querySelector('.questionsContainer').children
        ).forEach((child) => child.remove());

        this.deleteQuestionsStates();

        let testContainer = this.shadowRoot.querySelector('.testContainer');
        testContainer.classList.remove('resumed');
        testContainer.classList.remove('correct');
        testContainer.classList.remove('incorrect');

        let buttonsContainer =
            this.shadowRoot.querySelector('.buttonsContainer');
        let tryAgainBtn = this.shadowRoot.querySelector('.tryAgainBtn');
        let submitBtn = this.shadowRoot.querySelector('.submitBtn');

        this.shadowRoot
            .querySelector('.questionsContainer')
            .classList.remove('off');

        let feedbackContainer =
            this.shadowRoot.querySelector('.feedbackContainer');
        feedbackContainer.classList.add('off');

        if (this.data.displayMode !== 'all_at_once') {
            buttonsContainer.classList.add('off');
            submitBtn.classList.add('off');
        }

        tryAgainBtn.classList.add('off');

        this.disableElement(submitBtn);
        this.questionsOrder = [];
        this.completedQuestions = new Set();
        this.emitEvent('interacted');
        this.setStaticContent();
        this.setDynamicContent('initial').then(() => {
            this.setGridTemplateAreas();
            this.startTime = new Date();
            this.scrollIntoView();
            this.setState('test restarted');
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

    submitAll() {
        if (this.allChecked) {
            if (this.data?.buttons?.submit?.completed?.text) {
                this.submitBtn.innerHTML =
                    this.data.buttons.submit.completed.text;
            }

            let that = this;
            let questions = Array.from(
                that.shadowRoot.querySelector('.questionsContainer').children
            );
            questions.forEach((q) => q.checkAnswer());

            if (this.attemptCompleted) {
                this.completeTest();
            }
        }
    }

    markTestCorrectness() {
        let testContainer = this.shadowRoot.querySelector('.testContainer');
        if (this.passed) {
            console.log(
                `%cTest "${this.data.id}" passed`,
                'color:green;font-weight:bold;font-size:16px;'
            );

            testContainer.classList.add('correct');
            testContainer.classList.remove('incorrect');
        } else {
            console.log(
                `%cTest "${this.data.id}" failed`,
                'color:red;font-weight:bold;font-size:16px;'
            );
            testContainer.classList.remove('correct');
            testContainer.classList.add('incorrect');
        }
    }

    showResumed() {
        if (
            this.data.resume?.hideElements &&
            this.data.resume.hideElements.length > 0
        ) {
            if (Array.isArray(this.data.resume.hideElements)) {
                this.data.resume.hideElements.forEach((element) => {
                    this.shadowRoot
                        .querySelector(`${element}`)
                        .classList.add('off');
                });
            } else {
                this.shadowRoot
                    .querySelector(`${this.data.resume.hideElements}`)
                    .classList.add('off');
            }
        }

        if (this.data.displayMode === 'one_instead_another') {
            this.shadowRoot.querySelector('.instruction').classList.add('off');
            this.shadowRoot
                .querySelector('.commonQuestion')
                .classList.add('off');
            this.shadowRoot
                .querySelector('.questionsContainer')
                .classList.add('off');
        }

        let feedbackContainer =
            this.shadowRoot.querySelector('.feedbackContainer');

        if (
            this.data.resume?.common !== '' ||
            this.data.resume?.passed !== '' ||
            this.data.resume?.failed !== '' ||
            (this.data.resume?.byScore &&
                this.data.resume.byScore.length > 0) ||
            this.data.resume?.showUserPoolsResult === true
        ) {
            feedbackContainer.classList.remove('off');
        } else {
            feedbackContainer.classList.add('off');
        }

        if (
            this.data?.resume?.showUserPoolsResult &&
            this.data.resume.showUserPoolsResult === true &&
            this.userPoolsResult.length > 0
        ) {
            let poolsContainer = document.createElement('div');
            poolsContainer.classList.add('poolsContainer');

            this.userPoolsResult.forEach((r) => {
                let poolContainer = document.createElement('div');
                poolContainer.classList.add('poolContainer');

                let pool = new Pool();
                pool.init(r.id);
                poolContainer.append(pool);

                let userPoolResult = document.createElement('div');
                userPoolResult.classList.add('userPoolResult');
                userPoolResult.innerText =
                    r.value > 0 ? `+${r.value}` : r.value;
                poolContainer.append(userPoolResult);

                poolsContainer.append(poolContainer);
            });

            feedbackContainer.prepend(poolsContainer);
        }

        if (this.data.resume?.common !== '') {
            let text = document.createElement('p');
            text.innerHTML = AuxFunctions.parseText(
                this.data.resume.common,
                this
            );
            feedbackContainer.appendChild(text);
        }

        if (
            this.passed &&
            this.data.resume.passed &&
            this.data.resume.passed !== ''
        ) {
            let text = document.createElement('p');
            text.innerHTML = AuxFunctions.parseText(
                this.data.resume.passed,
                this
            );
            feedbackContainer.appendChild(text);
        }

        if (
            !this.passed &&
            this.data.resume.failed &&
            this.data.resume.failed !== ''
        ) {
            let text = document.createElement('p');
            text.innerHTML = AuxFunctions.parseText(
                this.data.resume.failed,
                this
            );
            feedbackContainer.appendChild(text);
        }

        if (this.data?.resume?.byScore && this.data.resume.byScore.length > 0) {
            let text = document.createElement('p');
            text.innerHTML = AuxFunctions.parseText(
                this.data.resume.byScore.filter((item) => {
                    return (
                        this.score >= Number(item.interval[0]) &&
                        this.score <= Number(item.interval[1])
                    );
                })[0].text,
                this
            );
            feedbackContainer.appendChild(text);
        }

        this.setButtons();
        this.showTryAgainBtn();
        this.setGridTemplateAreas();
    }

    showFeedback() {
        this.markTestCorrectness();

        if (
            this.data.feedback?.hideElements &&
            this.data.feedback.hideElements.length > 0
        ) {
            if (Array.isArray(this.data.feedback.hideElements)) {
                this.data.feedback.hideElements.forEach((element) => {
                    this.shadowRoot
                        .querySelector(`${element}`)
                        .classList.add('off');
                });
            } else {
                this.shadowRoot
                    .querySelector(`${this.data.feedback.hideElements}`)
                    .classList.add('off');
            }
        }

        if (this.data.displayMode === 'one_instead_another') {
            this.shadowRoot.querySelector('.instruction').classList.add('off');
            this.shadowRoot
                .querySelector('.commonQuestion')
                .classList.add('off');
            this.shadowRoot
                .querySelector('.questionsContainer')
                .classList.add('off');
        }

        let feedbackContainer =
            this.shadowRoot.querySelector('.feedbackContainer');

        feedbackContainer.scrollIntoView();

        if (
            this.data.feedback?.common !== '' ||
            this.data.feedback?.passed !== '' ||
            this.data.feedback?.failed !== '' ||
            (this.data.feedback?.byScore &&
                this.data.feedback.byScore.length > 0) ||
            this.data.feedback?.showUserPoolsResult === true
        ) {
            feedbackContainer.classList.remove('off');
        } else {
            feedbackContainer.classList.add('off');
        }

        Array.from(feedbackContainer.childNodes).forEach((node) =>
            node.remove()
        );

        if (
            this.data.feedback?.showUserPoolsResult === true &&
            this.userPoolsResult.length > 0
        ) {
            let poolsContainer = document.createElement('div');
            poolsContainer.classList.add('poolsContainer');

            this.userPoolsResult.forEach((r) => {
                let poolContainer = document.createElement('div');
                poolContainer.classList.add('poolContainer');

                let pool = new Pool();
                pool.init(r.id);
                poolContainer.append(pool);

                let userPoolResult = document.createElement('div');
                userPoolResult.classList.add('userPoolResult');
                userPoolResult.innerText =
                    r.value > 0 ? `+${r.value}` : r.value;
                poolContainer.append(userPoolResult);

                poolsContainer.append(poolContainer);
            });

            feedbackContainer.prepend(poolsContainer);
        }

        if (this.data.feedback?.common !== '') {
            let text = document.createElement('p');
            text.innerHTML = AuxFunctions.parseText(
                this.data.feedback.common,
                this
            );
            feedbackContainer.appendChild(text);
        }

        if (
            this.passed &&
            this.data.feedback.passed &&
            this.data.feedback.passed !== ''
        ) {
            let text = document.createElement('p');
            text.innerHTML = AuxFunctions.parseText(
                this.data.feedback.passed,
                this
            );
            feedbackContainer.appendChild(text);
        }

        if (
            !this.passed &&
            this.data.feedback.failed &&
            this.data.feedback.failed !== ''
        ) {
            let text = document.createElement('p');
            text.innerHTML = AuxFunctions.parseText(
                this.data.feedback.failed,
                this
            );
            feedbackContainer.appendChild(text);
        }

        if (this.data?.feedback?.byScore.length > 0) {
            let text = document.createElement('p');
            text.innerHTML = AuxFunctions.parseText(
                this.data.feedback.byScore.filter((item) => {
                    return (
                        this.score >= Number(item.interval[0]) &&
                        this.score <= Number(item.interval[1])
                    );
                })[0].text,
                this
            );
            feedbackContainer.appendChild(text);
        }

        this.shadowRoot.querySelector('.submitBtn').classList.add('off');
        this.showTryAgainBtn();
        this.setGridTemplateAreas();
    }

    showTryAgainBtn() {
        let buttonsContainer =
            this.shadowRoot.querySelector('.buttonsContainer');
        let tryAgainBtn = this.shadowRoot.querySelector('.tryAgainBtn');

        if (this.data.tryAgain === 'until_all_attempts') {
            if (
                Number(this.data.attemptsPerTest) === 0 ||
                this.attempt + 1 < Number(this.data.attemptsPerTest)
            ) {
                buttonsContainer.classList.remove('off');
                tryAgainBtn.classList.remove('off');
                this.enableElement(tryAgainBtn);
            } else {
                buttonsContainer.classList.add('off');
                tryAgainBtn.classList.add('off');
            }
        } else if (this.data.tryAgain === 'until_max_score') {
            if (
                (this.attempt + 1 < Number(this.data.attemptsPerTest) ||
                    Number(this.data.attemptsPerTest) === 0) &&
                this.score < this.maxPossibleScore
            ) {
                buttonsContainer.classList.remove('off');
                tryAgainBtn.classList.remove('off');
                this.enableElement(tryAgainBtn);
            } else {
                buttonsContainer.classList.add('off');
                tryAgainBtn.classList.add('off');
            }
        } else if (this.data.tryAgain === 'until_passed') {
            if (
                (this.attempt + 1 < Number(this.data.attemptsPerTest) ||
                    Number(this.data.attemptsPerTest) === 0) &&
                !this.passed
            ) {
                buttonsContainer.classList.remove('off');
                tryAgainBtn.classList.remove('off');
                this.enableElement(tryAgainBtn);
            } else {
                buttonsContainer.classList.add('off');
                tryAgainBtn.classList.add('off');
            }
        } else {
            buttonsContainer.classList.add('off');
            tryAgainBtn.classList.add('off');
        }
    }

    get passingScore() {
        if (typeof this.data.passingScore === 'string') {
            if (this.data.passingScore.includes('%')) {
                let multiplier = Number(
                    this.data.passingScore.replace('%', '')
                );
                return Math.ceil(
                    (this.questionsToTake.length / 100) * multiplier
                );
            } else {
                return Number(this.data.passingScore);
            }
        } else if (typeof this.data.passingScore === 'number') {
            return this.data.passingScore;
        }
    }

    get attemptCompleted() {
        let questions = Array.from(
            this.shadowRoot.querySelector('.questionsContainer').children
        );

        if (questions.length === this.questionsToTake.length) {
            return questions
                .map((i) => i.status === 'completed')
                .every((i) => i === true);
        }

        return false;
    }

    get amountOfQuestionsToPass() {
        if (this.data.scoring === 'questions') {
            let singleWeight = this.db.iterables[0].weight;
            let sameWeights = this.db.iterables.every(
                (q) => q.weight === singleWeight
            );
            if (sameWeights) {
                let value = this.passingScore / Number(singleWeight);
                // attempt to remove floating point calculation deviations
                if (value - Math.round(value) < 0.01) {
                    return Math.round(value);
                } else {
                    return Math.ceil(value);
                }
            } else {
                console.log(
                    'amountOfQuestionsToPass. Unable to count - weights are not the same.'
                );
                return null;
            }
        }
    }

    get correctlyAnsweredQuestions() {
        let questions = Array.from(
            this.shadowRoot.querySelector('.questionsContainer').children
        );

        return questions.filter((i) => i.result === true).length;
    }

    setScore() {
        let currentAttemptScore = 0;
        let completedQuestions = Array.from(
            this.shadowRoot.querySelector('.questionsContainer').children
        ).filter((i) => i.status === 'completed');

        if (this.data?.scoring === 'questions') {
            completedQuestions.forEach((q) => {
                if (q.result) {
                    currentAttemptScore =
                        currentAttemptScore + Number(q.data.weight);
                }
            });
        } else if (this.data?.scoring === 'answers') {
            completedQuestions.forEach((q) => {
                currentAttemptScore = currentAttemptScore + q.score;
            });
        } else if (this.data?.scoring === 'userInput') {
            completedQuestions.forEach((q) => {
                currentAttemptScore =
                    currentAttemptScore + Number(q.exactUserAnswer);
            });
        }

        this.scores[this.attempt] = AuxFunctions.roundAccurately(
            currentAttemptScore,
            2
        );

        if (this.data?.scoringFunction) {
            this.processedScores =
                scoringFunctions[this.data.scoringFunction](this);
        } else {
            this.processedScores = Array.from(this.scores);
        }
    }

    get score() {
        return this.scores[this.scores.length - 1];
    }
    get processedScore() {
        return this.processedScores[this.processedScores.length - 1];
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
                } else {
                    return false;
                }
                break;
            case 'completed':
                if (this.completed) {
                    return true;
                } else {
                    return false;
                }
                break;
            case 'none':
                return true;
                break;
            default:
                break;
        }
    }

    get maxPossibleScore() {
        if (this.data.scoring === 'questions') {
            return this.questionsToTake.reduce((sum, item) => {
                return (sum += Number(item.weight));
            }, 0);
        } else if (this.data.scoring === 'answers') {
            let sum = 0;
            // прописать подсчет максимально-возможного балла
            this.questionsToTake.forEach((q) => {
                if (q.type === 'mc' || q.type === 'fill-in') {
                    sum += Math.max(...q.answers.map((a) => Number(a.weight)));
                } else if (q.type === 'mr') {
                    q.answers.forEach((a) => {
                        sum += Number(a.weight);
                    });
                } else if (q.type === 'range') {
                    sum += Number(q.range[1]);
                }
            });

            return sum;
        }
    }

    get weight() {
        let weightData = this.data.weight.split(':');
        if (weightData[0] === 'num') {
            return Number(weightData[1]);
        }
    }

    completeTest() {
        let that = this;
        this.completed = true;
        this.status = 'completed';

        console.log(
            `%cTest "${that.data.id}" completed`,
            'color:green;font-weight:bold;font-size:16px;'
        );

        this.setState('test completed');

        if (this.result) {
            that.emitEvent('completed');
            that.emitEvent('passed');
        } else {
            that.emitEvent('completed');
            that.emitEvent('failed');
        }

        this.showFeedback();
    }

    setListeners() {
        let that = this;
        this.addEventListener('continue', (e) => {
            if (that.data.displayMode === 'one_instead_another') {
                e.detail.obj.classList.add('off');
            }

            if (
                that.data.displayMode === 'one_by_one' ||
                that.data.displayMode === 'one_instead_another'
            ) {
                if (that.lastQuestionIndex + 1 < that.questionsToTake.length) {
                    that.createQuestion(
                        that.questionsToTake[that.lastQuestionIndex + 1].id
                    ).then((qElement) => {
                        that.lastQuestionShownId =
                            that.questionsToTake[that.lastQuestionIndex].id;
                        that.setState('lastQuestionShownId changed');
                        /* if (that.data.displayMode === 'one_by_one') {
                            qElement.scrollIntoView();
                        } */
                        if (that.data.displayMode === 'one_instead_another') {
                            that.scrollIntoView();
                        }
                    });
                }
            }

            if (that.attemptCompleted) {
                that.completeTest();
            }

            // MAKE CONFIG DEPENDENT!!!
            /* this.showCorrectAnswers(e.detail.obj);
            this.showQuestionsStatus(e.detail.obj); */
        });

        this.addEventListener('answered', (e) => {
            this.setScore();
        });

        let tryAgainBtn = this.shadowRoot.querySelector('.tryAgainBtn');
        tryAgainBtn.addEventListener('click', this.restart.bind(this));

        let submitBtn = this.shadowRoot.querySelector('.submitBtn');
        submitBtn.addEventListener('click', this.submitAll.bind(this));

        this.addEventListener(
            'questionInProgress',
            this.processTest.bind(this)
        );
    }

    get userPoolsResult() {
        let questions = Array.from(
            this.shadowRoot.querySelector('.questionsContainer').children
        );

        return questions
            .map((q) => q.userPoolsResult)
            .reduce((accum, arr) => {
                if (arr.length > 0) {
                    arr.forEach((item) => {
                        let pool = accum.filter((i) => i.id === item.id);

                        if (pool.length === 0) {
                            accum.push(Object.assign({}, item));
                        } else {
                            pool[0].value = pool[0].value + item.value;
                        }
                    });
                }
                return accum;
            }, []);
    }

    showCorrectAnswers(question) {
        let showMarker = (question, answer) => {
            console.log(answer.id);
            let marker = question.shadowRoot
                .querySelector(`.answerContainer[data-id=${answer.id}]`)
                .querySelector('.correctnessMarker');

            marker.classList.remove('off');
            marker.classList.add(`${answer.correct ? 'correct' : 'incorrect'}`);
        };

        if (this.data?.showCorrectAnswers) {
            if (this.data.showCorrectAnswers.startsWith('onAnswered')) {
                if (
                    question.data.type === 'mc' ||
                    question.data.type === 'mr'
                ) {
                    question.data.answers.forEach((a) => {
                        showMarker(question, a);
                    });
                }
            } else if (this.data.showCorrectAnswers.startsWith('onCompleted')) {
                if (this.attemptCompleted) {
                    let questions = Array.from(
                        this.shadowRoot.querySelector('.questionsContainer')
                            .childNodes
                    );
                    questions.forEach((q) => {
                        if (q.data.type === 'mc' || q.data.type === 'mr') {
                            q.data.answers.forEach((a) => {
                                showMarker(q, a);
                            });
                        }
                    });
                }
            } else if (this.data.showCorrectAnswers.startsWith('onAttempt')) {
                let attempt = Number(
                    this.data.showCorrectAnswers.split(':')[1]
                );
                if (this.attemptCompleted && this.attempt === attempt) {
                    let questions = Array.from(
                        this.shadowRoot.querySelector('.questionsContainer')
                            .childNodes
                    );
                    questions.forEach((q) => {
                        if (q.data.type === 'mc' || q.data.type === 'mr') {
                            q.data.answers.forEach((a) => {
                                showMarker(q, a);
                            });
                        }
                    });
                }
            }
        }
    }

    showQuestionsStatus(question) {
        let showMarker = (q) => {
            let marker = q.shadowRoot
                .querySelector(`.subHeader`)
                .querySelector('.correctnessMarker');

            marker.classList.remove('off');

            marker.classList.add(`${q.result ? 'correct' : 'incorrect'}`);
        };

        if (this.data?.showQuestionsStatus) {
            if (this.data.showQuestionsStatus.startsWith('onAnswered')) {
                showMarker(question);
            } else if (
                this.data.showQuestionsStatus.startsWith('onCompleted') &&
                this.attemptCompleted
            ) {
                let questions = Array.from(
                    this.shadowRoot.querySelector('.questionsContainer')
                        .childNodes
                );

                questions.forEach((q) => showMarker(q));
            } else if (this.data.showQuestionsStatus.startsWith('onAttempt')) {
                let attempt = Number(
                    this.data.showCorrectAnswers.split(':')[1]
                );
                if (this.attemptCompleted && this.attempt === attempt) {
                    let questions = Array.from(
                        this.shadowRoot.querySelector('.questionsContainer')
                            .childNodes
                    );

                    questions.forEach((q) => showMarker(q));
                }
            }
        }
    }

    processTest() {
        if (this.status === 'initial') {
            this.status = 'inProgress';
            this.setState('test status changed to inProgress');
        }

        let submitBtn = this.shadowRoot.querySelector('.submitBtn');

        if (this.allChecked) {
            this.enableElement(submitBtn);
        } else {
            this.disableElement(submitBtn);
        }
    }

    disableElement(element) {
        element.disabled = true;
        element.classList.add('inactive');
    }

    enableElement(element) {
        element.disabled = false;
        element.classList.remove('inactive');
    }
}

window.customElements.define('test-unit', Test);
