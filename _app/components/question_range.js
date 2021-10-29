import { AuxFunctions } from '../auxFunctions.js';

const answerTemplateRange = document.createElement('template');
answerTemplateRange.innerHTML = `
        <div class='answerContainer'>
            <div class='rangeContainer'>
                <div class='range'>           
                    <p class='label min'></p>
                    <div class='input'>
                        <input type='range' />
                        <p class='value'></p>
                    </div>
                    <p class='label max'></p>
                </div>                
            </div>
            <p class='answerFeedback off'></p>
        </div>
`;

const templateRange = document.createElement('template');
templateRange.innerHTML = `
<style>
* {
    margin: 0;
    padding: 0;
    line-height: var(--line-height);
    box-sizing: border-box;
    font-family: var(--font-family-primary);
    font-size: var(--font-size-primary);
    color: var(--color-font-dark-primary);
}

strong {
    font-weight: var(--font-weight-bold);
}

/* <- grid settings */
    .questionContainer {
        --questionContainer-grid-template-areas: var(--questionContainer-grid-template-areas);
        display: grid;
        grid-template-columns: var(--questionContainer-grid-template-columns);
        grid-template-rows: var(--questionContainer-grid-template-rows);
        grid-template-areas: var(--questionContainer-grid-template-areas);
        row-gap: var(--questionContainer-row-gap);
        column-gap: var(--questionContainer-column-gap);
        justify-items: var(--questionContainer-justify-items);
        align-items: var(--questionContainer-align-items);
        justify-content: var(--questionContainer-justify-content);
        align-content: var(--questionContainer-align-content);

        color: var(--questionContainer-color);
        font-family: var(--questionContainer-font-family);
        font-size: var(--questionContainer-font-size);
        font-weight: var(--questionContainer-font-weight);
        font-style: var(--questionContainer-font-style);

        background: var(--questionContainer-background);

        padding: var(--questionContainer-padding);
        max-width: 100%;

        border-style: var(--questionContainer-border-style);
        border-width: var(--questionContainer-border-width);
        border-color: var(--questionContainer-border-color);
        border-radius: var(--questionContainer-border-radius);
    }

    .questionContainer.feedbackOnly {
        --questionContainer-grid-template-areas: 'subHeader' 'questionFeedback' 'buttonsContainer';
    }

    .questionContainer .subHeader {
        grid-area: subHeader;
        display: grid;
        grid-template-columns: var(--subHeader-grid-template-columns);
        grid-template-rows: var(--subHeader-grid-template-rows);
        grid-template-areas: var(--subHeader-grid-template-areas);
        row-gap: var(--subHeader-row-gap);
        column-gap: var(--subHeader-column-gap);
        justify-items: var(--subHeader-justify-items);
        align-items: var(--subHeader-align-items);
        justify-content: var(--subHeader-justify-content);
        align-content: var(--subHeader-align-content);

        color: var(--subHeader-color);
        font-family: var(--subHeader-font-family);
        font-size: var(--subHeader-font-size);
        font-weight: var(--subHeader-font-weight);
        font-style: var(--subHeader-font-style);

        background: var(--subHeader-background);

        padding: var(--subHeader-padding);

        border-style: var(--subHeader-border-style);
        border-width: var(--subHeader-border-width);
        border-color: var(--subHeader-border-color);
        border-radius: var(--subHeader-border-radius);

        transform: var(--subHeader-transform);
    }

    .questionContainer .subHeader .counter{
        grid-area: counter;
        color: var(--counter-color);
        font-family: var(--counter-font-family);
        font-size: var(--counter-font-size);
        font-weight: var(--counter-font-weight);
        font-style: var(--counter-font-style);
        line-height: var(--counter-line-height);
        letter-spacing: var(--counter-letter-spacing);

        writing-mode: var(--counter-writing-mode);
        text-orientation: var(--counter-text-orientation);

        background: var(--counter-background);

        padding: var(--counter-padding);

        border-style: var(--counter-border-style);
        border-width: var(--counter-border-width);
        border-color: var(--counter-border-color);
        border-radius: var(--counter-border-radius);
    }

    .questionContainer .subHeader .correctnessMarker {
        grid-area: correctnessMarker;
        transform: var(--question-correctnessMarker-transform);
    }

    .questionContainer .question {
        grid-area: question;
        display: grid;
        grid-template-columns: var(--question-grid-template-columns);
        grid-template-rows: var(--question-grid-template-rows);
        row-gap: var(--question-row-gap);
        column-gap: var(--question-column-gap);
        justify-items: var(--question-justify-items);
        align-items: var(--question-align-items);
        justify-content: var(--question-justify-content);
        align-content: var(--question-align-content);

        color: var(--question-color);
        font-family: var(--question-font-family);
        font-size: var(--question-font-size);
        font-weight: var(--question-font-weight);
        font-style: var(--question-font-style);

        background: var(--question-background);

        padding: var(--question-padding);

        border-style: var(--question-border-style);
        border-width: var(--question-border-width);
        border-color: var(--question-border-color);
        border-radius: var(--question-border-radius);
    }

    .questionContainer .question .story {
        display: grid;
        grid-template-columns: var(--story-grid-template-columns);
        grid-template-rows: var(--story-grid-template-rows);
        row-gap: var(--story-row-gap);
        column-gap: var(--story-column-gap);
        justify-items: var(--story-justify-items);
        align-items: var(--story-align-items);
        justify-content: var(--story-justify-content);
        align-content: var(--story-align-content);

        color: var(--story-color);
        font-family: var(--story-font-family);
        font-size: var(--story-font-size);
        font-weight: var(--story-font-weight);
        font-style: var(--story-font-style);

        background: var(--story-background);

        padding: var(--story-padding);

        border-style: var(--story-border-style);
        border-width: var(--story-border-width);
        border-color: var(--story-border-color);
        border-radius: var(--story-border-radius);
    }

    .questionContainer .question .questionText {
        display: grid;
        grid-template-columns: var(--questionText-grid-template-columns);
        grid-template-rows: var(--questionText-grid-template-rows);
        row-gap: var(--questionText-row-gap);
        column-gap: var(--questionText-column-gap);
        justify-items: var(--questionText-justify-items);
        align-items: var(--questionText-align-items);
        justify-content: var(--questionText-justify-content);
        align-content: var(--questionText-align-content);

        color: var(--questionText-color);
        font-family: var(--questionText-font-family);
        font-size: var(--questionText-font-size);
        font-weight: var(--questionText-font-weight);
        font-style: var(--questionText-font-style);

        background: var(--questionText-background);

        padding: var(--questionText-padding);

        border-style: var(--questionText-border-style);
        border-width: var(--questionText-border-width);
        border-color: var(--questionText-border-color);
        border-radius: var(--questionText-border-radius);
    }

    .questionContainer .question .instruction {
        color: var(--question-instruction-color);
        font-family: var(--question-instruction-font-family);
        font-size: var(--question-instruction-font-size);
        font-weight: var(--question-instruction-font-weight);
        font-style: var(--question-instruction-font-style);

        background: var(--question-instruction-background);

        padding: var(--question-instruction-padding);

        border-style: var(--question-instruction-border-style);
        border-width: var(--question-instruction-border-width);
        border-color: var(--question-instruction-border-color);
        border-radius: var(--question-instruction-border-radius);
    }

    .questionContainer .answersContainer {
        grid-area: answersContainer;
        display: grid;
        grid-template-columns: var(--answersContainer-grid-template-columns);
        grid-template-rows: var(--answersContainer-grid-template-rows);
        row-gap: var(--answersContainer-row-gap);
        column-gap: var(--answersContainer-column-gap);
        justify-items: var(--answersContainer-justify-items);
        align-items: var(--answersContainer-align-items);
        justify-content: var(--answersContainer-justify-content);
        align-content: var(--answersContainer-align-content);
        width: 100%;

        color: var(--answersContainer-color);
        font-family: var(--answersContainer-font-family);
        font-size: var(--answersContainer-font-size);
        font-weight: var(--answersContainer-font-weight);
        font-style: var(--answersContainer-font-style);

        background: var(--answersContainer-background);

        padding: var(--answersContainer-padding);

        border-style: var(--answersContainer-border-style);
        border-width: var(--answersContainer-border-width);
        border-color: var(--answersContainer-border-color);
        border-radius: var(--answersContainer-border-radius);
    }

    .questionContainer .answersContainer.image {
        --inputbox-dimension: var(--inputbox-dimension-alternative);
        grid-template-columns: var(--answersContainerImage-grid-template-columns);
    }

    .questionContainer .answersContainer .answerContainer {
        display: grid;
        grid-template-columns: var(--answerContainer-grid-template-columns);
        grid-template-rows: var(--answerContainer-grid-template-rows);
        row-gap: var(--answerContainer-row-gap);
        column-gap: var(--answerContainer-column-gap);
        justify-items: var(--answerContainer-justify-items);
        align-items: var(--answerContainer-align-items);
        justify-content: var(--answerContainer-justify-content);
        align-content: var(--answerContainer-align-content);            

        color: var(--answerContainer-color);
        font-family: var(--answerContainer-font-family);
        font-size: var(--answerContainer-font-size);
        font-weight: var(--answerContainer-font-weight);
        font-style: var(--answerContainer-font-style);

        background: var(--answerContainer-background);

        padding: var(--answerContainer-padding);

        border-style: var(--answerContainer-border-style);
        border-width: var(--answerContainer-border-width);
        border-color: var(--answerContainer-border-color);
        border-radius: var(--answerContainer-border-radius);
    }

    .questionContainer .answersContainer .answerContainer .rangeContainer {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0px;
        place-items: start;
    }

    .questionContainer .answersContainer .answerContainer .rangeContainer .range{
        box-sizing: border-box;
        display: grid;
        width: 100%;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: repeat(2, max-content);
        grid-template-areas: 'labelMin labelMax' 'input input';  
        gap: 1rem;
    }

    .questionContainer .answersContainer .answerContainer .rangeContainer .range .input {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: repeat(2, max-content);
        grid-template-areas: 'input input' 'value value';
    }

    .questionContainer .answersContainer .answerContainer .rangeContainer .range .input input{
        grid-area: input;
        width: 100%;
    }

    .questionContainer .answersContainer .answerContainer .rangeContainer .range .input .value {
        grid-area: value;
    }

    .questionContainer .answersContainer .answerContainer .rangeContainer .range .label {
        padding: 1rem;
        font-size: calc(var(--font-size-regular) * 0.75);
        line-height: calc(var(--line-height) * 0.8);
        position: relative;
    }

    .questionContainer .answersContainer .answerContainer .rangeContainer .range .label.min {
        grid-area: labelMin;
        background-color: #f2f2f2;
        border-radius: 10px 10px 10px 0;
    }

    .questionContainer .answersContainer .answerContainer .rangeContainer .range .label.min::after{
        content: '';
        position: absolute;
        width: 1rem;
        height: 1rem;
        left: 0;
        bottom: -1rem;
        background-color: #f2f2f2;
        clip-path: polygon(0 0, 0 100%, 100% 0);
    }    

    .questionContainer .answersContainer .answerContainer .rangeContainer .range .label.max {
        grid-area: labelMax;
        background-color: #e0e0e0;
        border-radius: 10px 10px 0 10px;
    }

    .questionContainer .answersContainer .answerContainer .rangeContainer .range .label.max::after{
        content: '';
        position: absolute;
        width: 1rem;
        height: 1rem;
        right: 0;
        bottom: -1rem;
        background-color: #e0e0e0;
        clip-path: polygon(100% 0, 0 0, 100% 100%);
    }

    .questionContainer .answersContainer .answerContainer .rangeContainer .input {
        /* width: calc(var(--max-width) / 5); */
        grid-area: input;
    }

    .questionContainer .answersContainer .answerContainer .rangeContainer .input .value {
        text-align: center;
        font-weight: bold;
    }

    .questionContainer .answersContainer .answerContainer .rangeContainer .input input {
        width: 100%;
        cursor: pointer;
    }


    .questionContainer .answersContainer .answerContainer .answerFeedback {
        display: grid;
        grid-template-columns: var(--answerFeedback-grid-template-columns);
        grid-template-rows: var(--answerFeedback-grid-template-rows);
        row-gap: var(--answerFeedback-row-gap);
        column-gap: var(--answerFeedback-column-gap);
        justify-items: var(--answerFeedbackfy-items);
        align-items: var(--answerFeedback-items);
        justify-content: var(--answerFeedbackfy-content);
        align-content: var(--answerFeedback-content);

        color: var(--answerFeedback-color);
        font-family: var(--answerFeedback-font-family);
        font-size: var(--answerFeedback-font-size);
        font-weight: var(--answerFeedback-font-weight);
        font-style: var(--answerFeedback-font-style);

        background: var(--answerFeedback-background);

        padding: var(--answerFeedback-padding);

        border-style: var(--answerFeedback-border-style);
        border-width: var(--answerFeedback-border-width);
        border-color: var(--answerFeedback-border-color);
        border-radius: var(--answerFeedback-border-radius);
    }

    .questionContainer .tipsContainer {
        grid-area: tipsContainer;
        display: grid;
        grid-template-columns: var(--tipsContainer-grid-template-columns);
        grid-template-rows: var(--tipsContainer-grid-template-rows);
        row-gap: var(--tipsContainer-row-gap);
        column-gap: var(--tipsContainer-column-gap);
        justify-items: var(--tipsContainer-justify-items);
        align-items: var(--tipsContainer-align-items);
        justify-content: var(--tipsContainer-justify-content);
        align-content: var(--tipsContainer-align-content);

        color: var(--tipsContainer-color);
        font-family: var(--tipsContainer-font-family);
        font-size: var(--tipsContainer-font-size);
        font-weight: var(--tipsContainer-font-weight);
        font-style: var(--tipsContainer-font-style);

        background: var(--tipsContainer-background);

        padding: var(--tipsContainer-padding);

        border-style: var(--tipsContainer-border-style);
        border-width: var(--tipsContainer-border-width);
        border-color: var(--tipsContainer-border-color);
        border-radius: var(--tipsContainer-border-radius);
    }

    .questionContainer .tipsContainer .tipText {
        display: grid;
        grid-template-columns: var(--tipText-grid-template-columns);
        grid-template-rows: var(--tipText-grid-template-rows);
        row-gap: var(--tipText-row-gap);
        column-gap: var(--tipText-column-gap);
        justify-items: var(--tipText-justify-items);
        align-items: var(--tipText-align-items);
        justify-content: var(--tipText-justify-content);
        align-content: var(--tipText-align-content);

        color: var(--tipText-color);
        font-family: var(--tipText-font-family);
        font-size: var(--tipText-font-size);
        font-weight: var(--tipText-font-weight);
        font-style: var(--tipText-font-style);

        background: var(--tipText-background);

        padding: var(--tipText-padding);

        border-style: var(--tipText-border-style);
        border-width: var(--tipText-border-width);
        border-color: var(--tipText-border-color);
        border-radius: var(--tipText-border-radius);
    }

    .questionContainer .questionFeedback {
        grid-area: questionFeedback;
        display: grid;
        grid-template-columns: var(--questionFeedback-grid-template-columns);
        grid-template-rows: var(--questionFeedback-grid-template-rows);
        row-gap: var(--questionFeedback-row-gap);
        column-gap: var(--questionFeedback-column-gap);
        justify-items: var(--questionFeedback-justify-items);
        align-items: var(--questionFeedback-align-items);
        justify-content: var(--questionFeedback-justify-content);
        align-content: var(--questionFeedback-align-content);

        color: var(--questionFeedback-color);
        font-family: var(--questionFeedback-font-family);
        font-size: var(--questionFeedback-font-size);
        font-weight: var(--questionFeedback-font-weight);
        font-style: var(--questionFeedback-font-style);

        background: var(--questionFeedback-background);

        padding: var(--questionFeedback-padding);

        border-style: var(--questionFeedback-border-style);
        border-width: var(--questionFeedback-border-width);
        border-color: var(--questionFeedback-border-color);
        border-radius: var(--questionFeedback-border-radius);
    }

    .questionContainer .questionFeedback .poolsContainer {
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

    .questionContainer .questionFeedback .poolsContainer .poolContainer {
        display: grid;
        grid-template-columns: 1fr;
        row-gap: 1rem;
        justify-content: center;
        justify-items: center;
    }

    .questionContainer .questionFeedback .poolsContainer .poolContainer .userPoolResult{
        padding: 0.5rem 1rem;
        border-radius: 999px;
        background-color: #F8D626;
        color: #051931;
        font-weight: bold;
        text-align: center;
        justify-self: center;
        width: 50%;
    }

    .questionContainer .buttonsContainer {
        grid-area: buttonsContainer;
        display: grid;
        grid-template-columns: var(--questionContainer-buttonsContainer-grid-template-columns);
        grid-template-rows: var(--questionContainer-buttonsContainer-grid-template-rows);
        row-gap: var(--questionContainer-buttonsContainer-row-gap);
        column-gap: var(--questionContainer-buttonsContainer-column-gap);
        justify-items: var(--questionContainer-buttonsContainer-justify-items);
        align-items: var(--questionContainer-buttonsContainer-align-items);
        justify-content: var(--questionContainer-buttonsContainer-justify-content);
        align-content: var(--questionContainer-buttonsContainer-align-content);

        color: var(--buttonsContainer-color);
        font-family: var(--buttonsContainer-font-family);
        font-size: var(--buttonsContainer-font-size);
        font-weight: var(--buttonsContainer-font-weight);
        font-style: var(--buttonsContainer-font-style);

        background: var(--buttonsContainer-background);

        padding: var(--buttonsContainer-padding);

        width: var(--questionContainer-buttonsContainer-width);

        border-style: var(--buttonsContainer-border-style);
        border-width: var(--buttonsContainer-border-width);
        border-color: var(--buttonsContainer-border-color);
        border-radius: var(--buttonsContainer-border-radius);
    }

/* grid settings -> */   

.correct .questionFeedback {
    background-color: var(--color-correct);
}

.incorrect .questionFeedback {
    background-color: var(--color-incorrect);
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

.continueLastBtn {
    transform-origin: center;
    animation: lastBtn 500ms linear infinite alternate;
}

@keyframes lastBtn {
    from {
        transform: scale(1);
    }

    to {
        transform: scale(1.1);
    }
}

.inactive {
    cursor: auto;
    pointer-events: none;
}

.off {
    display:none !important;
}

.offTotal {
    display: none !important;
}

@media screen and (max-width: 1355px) {
    .questionContainer .questionFeedback .poolsContainer {
        grid-template-columns: repeat(auto-fit, 120px);
        column-gap: 4rem;
        row-gap: 2rem;    
    }
}

    @media screen and (max-width: 600px) {
        .questionContainer .answersContainer .answerContainer .rangeContainer .range{
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: repeat(3, max-content);
            grid-template-areas: 'labelMin labelMin .' 'input input input' '. labelMax labelMax';  
            gap: 1rem;
        }

        .questionContainer .answersContainer .answerContainer .rangeContainer .range .input {
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: repeat(2, max-content);
            grid-template-areas: 'value value' 'input input';
        }

        .questionContainer .answersContainer .answerContainer .rangeContainer .range .label {
            line-height: calc(var(--line-height) * 0.8);
        }

        .questionContainer .answersContainer .answerContainer .rangeContainer .range .label.min::after{
            left: 0;
            bottom: -1rem;
            clip-path: polygon(0 0, 0 100%, 100% 0);
        }
        
        .questionContainer .answersContainer .answerContainer .rangeContainer .range .label.max {
            border-radius: 10px 0 10px 10px;
        }
    
        .questionContainer .answersContainer .answerContainer .rangeContainer .range .label.max::after{
            right: 0;
            top: -1rem;
            clip-path: polygon(100% 0, 0 100%, 100% 100%);
        }
    }   

</style>
<div class='question-mr questionContainer'>
    <div class='subHeader off'>
        <p class='counter off'></p>
        <p class='correctnessMarker off'></p>
    </div>
    <div class='question'>
        <div class='story off'></div>
        <div class='questionText'></div>
        <p class='instruction'></p>
    </div>

    <div class='answersContainer'>
        
    </div>
    <div class='tipsContainer off'>
        <div class='tipText'></div>
        <button class='tipBtn btn' type='button'></button>
    </div>
    <div class='questionFeedback off'></div>
    <div class='buttonsContainer'>
        <button type='button' class='submitBtn btn'></button>
        <button type='button' class='continueBtn btn off'></button>
    </div>
</div>
`;

export class QuestionRange extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.appendChild(templateRange.content.cloneNode(true));

        this.completed = false;
        this.result = false;
        this.status = 'initial';
        this.score = 0;
        this.state = {};
    }

    get parentId() {
        return this.parent.data.id;
    }

    get amountOfQuestions() {
        return this.parent.amountOfQuestions;
    }

    get submitMode() {
        return this.parent.data.submitMode;
    }

    get displayMode() {
        return this.parent.data.displayMode;
    }

    get attemptsPerTest() {
        return this.parent.data.attemptsPerTest;
    }

    get passingScore() {
        return this.parent.data.passingScore;
    }

    get resume() {
        return (
            this.parent.resumed === true &&
            this.parent.data.resume.resume === true &&
            this.parent.status !== 'initial'
        );
    }

    setFields(data, index, parent, state) {
        this.parent = parent;
        this.data = data;
        this.index = index;
        this.state = state;
        this.data.evaluated = parent.data.evaluated;

        // <- for statements only

        let question = '';
        if (parent.data?.commonQuestion !== '') {
            question = `${parent.data.commonQuestion} ${data.question}`;
        } else {
            question = data.question;
        }

        this.data.description = data.story !== '' ? data.story : question;
        this.data.nameRus = question;

        // for statements only ->

        let that = this;

        if (this.parent.data?.counter && this.amountOfQuestions > 1) {
            let subHeader = this.shadowRoot.querySelector('.subHeader');
            let counter = this.shadowRoot.querySelector('.counter');
            counter.innerHTML = AuxFunctions.parseText(
                parent.data.counter,
                this
            );
            counter.classList.remove('off');
            subHeader.classList.remove('off');
        }

        if (this.data.story.length > 0) {
            let story = this.shadowRoot.querySelector('.story');
            story.innerHTML = this.data.story;
            story.classList.remove('off');
        }

        this.shadowRoot.querySelector('.instruction').innerHTML =
            AuxFunctions.parseText(this.data.instruction, this);

        this.shadowRoot.querySelector('.questionText').innerHTML =
            this.data.question;

        if (this.data.help.length === 0 || this.data.help[0] === '') {
            this.shadowRoot.querySelector('.tipsContainer').style.display =
                'none';
        } else {
            this.tipBtn = this.shadowRoot.querySelector('.tipBtn');
            this.tipBtn.innerHTML = `${this.data.help.length} tip(s) available`;
        }

        let answers = this.shadowRoot.querySelector('.answersContainer');

        let answersData = this.data.answers;
        if (this.data.shuffleAnswers) {
            answersData = this.shuffleArray(this.data.answers);
        }

        let newAnswer = answerTemplateRange.content.cloneNode(true);
        answers.appendChild(newAnswer);

        let currentAnswer = answers.querySelector('.answerContainer');
        let labelMin = currentAnswer.querySelector('.min');
        let labelMax = currentAnswer.querySelector('.max');
        let input = currentAnswer.querySelector('input');

        labelMin.innerHTML = this.data.labels[0];
        if (this.data.labels.length === 2) {
            labelMax.innerHTML = this.data.labels[1];
        } else {
            labelMax.classList.add('off');
        }
        input.setAttribute('min', this.data.range[0]);
        input.setAttribute('max', this.data.range[1]);
        input.setAttribute('value', this.data.range[1] / 2);
        input.setAttribute('step', this.data.step);

        let valueP = this.shadowRoot.querySelector('.value');
        valueP.innerHTML = this.data.range[1] / 2;

        if (this.submitMode === 'all_at_once') {
            this.shadowRoot.querySelector('.submitBtn').classList.add('off');
        }

        this.setButtons();
        this.setGridTemplateAreas();
        this.emitEvent('created');
        this.setListeners();
        if (!('isFake' in this.state)) {
            if (this.resume === true) {
                if (!('status' in this.state)) {
                    // to handle old version without states
                    this.state.status = 'completed';
                }
                this.restoreState();
            }
        }
    }

    setButtons() {
        let continueBtn = this.shadowRoot.querySelector('.continueBtn');
        Object.keys(this.parent.data.buttons).forEach((k) => {
            let btn = this.shadowRoot.querySelector(`.${k}Btn`);
            if (btn) {
                btn.innerHTML = this.parent.data.buttons[k].initial;
                if (this.parent.data.buttons[k].icon === true) {
                    btn.classList.add('icon');
                }
            }
        });

        if (this.index + 1 === this.amountOfQuestions) {
            let continueBtn = this.shadowRoot.querySelector('.continueBtn');
            continueBtn.classList.add('continueLastBtn');
            continueBtn.innerHTML = this.parent.data.buttons.continue.last;
        }

        if (this.status === 'completed' && this.displayMode === 'one_by_one') {
            continueBtn.classList.add('off');
        }

        if (this.submitMode === 'all_at_once') {
            this.shadowRoot
                .querySelector('.buttonsContainer')
                .classList.add('off');
        }
    }

    get globalTestGridAreas() {
        return getComputedStyle(document.documentElement)
            .getPropertyValue('--questionContainer-grid-template-areas')
            .trim()
            .replaceAll('"', '')
            .replaceAll('  ', ' ')
            .split(' ');
    }

    setGridTemplateAreas() {
        let questionContainer =
            this.shadowRoot.querySelector('.questionContainer');
        let currentAreas = Array.from(questionContainer.children)
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
            .filter((rule) => rule.selectorText === '.questionContainer')[0]
            .style.setProperty(
                '--questionContainer-grid-template-areas',
                currentAreasString
            );
    }

    restoreState() {
        this.status = this.state.status;
        if (this.status === 'inProgress') {
            this.restoreAnswers();
        } else if (this.status === 'completed') {
            this.result = this.state.result;
            this.restoreAnswers();
            this.disableElements();
            this.showFeedback();
        }
    }

    restoreAnswers() {
        if ('exactUserAnswer' in this.state) {
            this.shadowRoot.querySelector('input').value =
                this.state.exactUserAnswer;

            let submitBtn = this.shadowRoot.querySelector('.submitBtn');
            if (this.checked) {
                submitBtn.disabled = false;
            }
        }
    }

    get checked() {
        let value = this.shadowRoot.querySelector('input').value;

        if (value.length > 0) {
            return true;
        }
        return false;
    }

    setListeners() {
        let that = this;
        // Disable/enable submitBtn on inputs' changes.

        let input = this.shadowRoot.querySelector('input');
        let submitBtn = this.shadowRoot.querySelector('.submitBtn');
        let continueBtn = this.shadowRoot.querySelector('.continueBtn');

        let valueP = this.shadowRoot.querySelector('.value');

        /* input.addEventListener("change", (e) => {
            valueP.innerHTML = e.target.value;
        }); */

        input.addEventListener('input', (e) => {
            valueP.innerHTML = e.target.value;
        });

        input.addEventListener('focusout', (e) => {
            if (this.status === 'initial') {
                this.status = 'inProgress';
            }

            that.emitEvent('questionInProgress');
            this.setState('user input');
        });

        // submitBtn action
        submitBtn.addEventListener('click', this.checkAnswer.bind(this));

        // continueBtn action
        continueBtn.addEventListener('click', (e) => {
            that.emitEvent('continue');
            if (that.displayMode === 'one_by_one') {
                e.target.classList.add('off');
            }
        });
    }

    get exactUserAnswer() {
        let input = this.shadowRoot.querySelector('input');
        return input.value;
    }

    checkAnswer() {
        let that = this;

        this.status = 'completed';

        if (this.data.answers.length > 0) {
            this.data.answers.forEach((a) => {
                if (a.text.toString() === that.exactUserAnswer.toString()) {
                    that.userAnswer = [[a.id, true]];
                    that.result = true;
                    that.score = a.weight;
                }
            });
        } else {
            this.userAnswer = [[`${this.data.id}a1`, true]];
            this.result = true;
            this.score = Number(this.exactUserAnswer); // must be improved - this was made for survey reasons
        }

        console.log(
            `Question ${this.data.id} answered. Result: ${this.result}`
        );

        if (this.parent.data?.buttons?.submit?.completed) {
            this.shadowRoot.querySelector('.submitBtn').innerHTML =
                this.parent.data.buttons.submit.completed;
        }

        this.disableElements();

        this.disableElements();
        this.showFeedback();

        if ('isFake' in this.state) {
            delete this.state.isFake;
        }
        this.setState('question completed');
        this.emitEvent('answered');
    }

    get userAnswer() {
        if (this.data.answers.length > 0) {
            this.data.answers.forEach((a) => {
                if (a.text.toString() === that.exactUserAnswer.toString()) {
                    return [[a.id, true]];
                }
            });
        } else {
            return [[`${this.data.id}a1`, true]];
        }
    }

    setState(msg = '') {
        console.log(
            `%c...setting question ${this.data.id} state due to: ${msg}`,
            'color:blue;font-weight:bold;'
        );
        this.state.status = this.status;
        this.state.result = this.result;
        this.state.userAnswer = this.userAnswer;
        this.state.exactUserAnswer = this.exactUserAnswer;
        this.state.userPoolsResult = this.userPoolsResult;

        if ('isFake' in this.state) {
            delete this.state.isFake;
        }

        this.emitEvent('state_changed');
    }

    get hasFeedback() {
        if (this.data.showPoolsInFeedback) {
            return true;
        }

        if (this.data.answers.filter((a) => a.feedback !== '').length > 0) {
            return true;
        }

        if (this.data?.feedback?.common && this.data.feedback.common !== '') {
            return true;
        }

        if (
            this.result &&
            this.data?.feedback?.correct &&
            this.data.feedback.correct !== ''
        ) {
            return true;
        }

        if (
            !this.result &&
            this.data?.feedback?.incorrect &&
            this.data.feedback.incorrect !== ''
        ) {
            return true;
        }

        if (
            this.data?.feedback?.byScore &&
            this.data.feedback.byScore.length > 0
        ) {
            return true;
        }

        return false;
    }

    showFeedback() {
        let feedback = this.shadowRoot.querySelector('.questionFeedback');
        feedback.scrollIntoView();

        if (
            this.parent.data?.questionsSettings?.feedback?.hideElements &&
            this.parent.data.questionsSettings.feedback.hideElements !== ''
        ) {
            if (
                Array.isArray(
                    this.parent.data.questionsSettings.feedback.hideElements
                )
            ) {
                this.parent.data.questionsSettings.feedback.hideElements.forEach(
                    (element) => {
                        this.shadowRoot
                            .querySelector(`.${element}`)
                            .classList.add('off');
                    }
                );
            } else {
                this.shadowRoot
                    .querySelector(
                        `${this.parent.data.questionsSettings.feedback.hideElements}`
                    )
                    .classList.add('off');
            }
        }

        /* if (this.displayMode === 'one_instead_another') {
            this.shadowRoot
                .querySelector('.questionContainer')
                .classList.add('feedbackOnly');

            this.shadowRoot.querySelector('.question').classList.add('off');

            this.shadowRoot
                .querySelector('.answersContainer')
                .classList.add('off');
        } */

        // process answers feedbacks
        if ('answersFeedbackMode' in this.parent.data) {
            if (this.parent.data.answersFeedbackMode === 'answer') {
                this.userAnswer
                    .filter((a) => a[1] === true)
                    .forEach((a) => {
                        let answer = this.data.answers.filter(
                            (ans) => ans.id === a[0]
                        )[0];

                        let answerFeedback = this.shadowRoot.querySelector(
                            `.answerFeedback[data-id='${a[0]}']`
                        );
                        if (answer.feedback.length > 0) {
                            answerFeedback.innerHTML = answer.feedback;
                            answerFeedback.classList.remove('off');
                        }
                    });
            } else if (this.parent.data.answersFeedbackMode === 'question') {
                this.userAnswer
                    .filter((a) => a[1] === true)
                    .forEach((a) => {
                        let answer = this.data.answers.filter(
                            (ans) => ans.id === a[0]
                        )[0];

                        if (answer.feedback.length > 0) {
                            let aFeedback = document.createElement('div');
                            aFeedback.classList.add('answerFeedback');
                            aFeedback.innerHTML = AusFunctions.parseText(
                                answer.feedback,
                                answer
                            );
                            feedback.append(aFeedback);
                        }
                    });
            }
        }

        // process question feedback

        if (this.result) {
            if (this.data.feedback.correct) {
                let qFeedback = document.createElement('div');
                qFeedback.innerHTML = AuxFunctions.parseText(
                    this.data.feedback.correct,
                    this
                );
                feedback.append(qFeedback);
            }
            this.shadowRoot
                .querySelector('.questionContainer')
                .classList.add('correct');
        } else {
            if (this.data.feedback.incorrect) {
                let qFeedback = document.createElement('div');
                qFeedback.innerHTML = AuxFunctions.parseText(
                    this.data.feedback.incorrect,
                    this
                );
                feedback.append(qFeedback);
            }
            this.shadowRoot
                .querySelector('.questionContainer')
                .classList.add('incorrect');
        }

        // show pools
        if (
            this.data.showPoolsInFeedback === true &&
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

            feedback.prepend(poolsContainer);
        }

        // show feedback
        if (
            feedback.children.length > 0 ||
            this.data.feedback?.correct ||
            this.data.feedback?.incorrect ||
            this.userPoolsResult.length > 0
        ) {
            feedback.classList.remove('off');
        } else {
            feedback.classList.add('off');
        }

        this.setGridTemplateAreas();

        //show NEXT button
        if (
            this.parent.data.displayMode === 'one_instead_another' ||
            this.parent.data.displayMode === 'one_by_one'
        ) {
            if (!feedback.className.includes('off')) {
                let continueBtn = this.shadowRoot.querySelector('.continueBtn');
                let submitBtn = this.shadowRoot.querySelector('.submitBtn');
                submitBtn.classList.add('off');
                if (
                    this.parent.data.displayMode === 'one_instead_another' ||
                    this.parent.data.displayMode === 'one_by_one'
                ) {
                    continueBtn.classList.remove('off');
                }
                if (
                    this.parent.data.displayMode === 'one_by_one' &&
                    this.index < this.parent.lastQuestionIndex
                ) {
                    continueBtn.classList.add('off');
                }
            } else {
                this.emitEvent('continue');
            }
        } else if (this.parent.data.displayMode === 'all_at_once') {
            if (this.parent.data.submitMode === 'each') {
                this.emitEvent('continue');
            }
        }
    }

    get hasPools() {
        return this.data.answers.filter((a) => a.pools.length > 0).length > 0;
    }

    get userPoolsResult() {
        let that = this;
        if (that.userAnswer) {
            return that.userAnswer
                .filter((a) => a[1] === true)
                .map((a) => a[0])
                .map(
                    (id) =>
                        that.data.answers.filter((ans) => ans.id === id)[0]
                            .pools
                )
                .reduce((accum, unit) => {
                    if (unit && unit.length > 0) {
                        unit.forEach((item) => {
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
        } else {
            return [];
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

    disableElements() {
        let inputs = Array.from(this.shadowRoot.querySelectorAll('input'));
        let submitBtn = this.shadowRoot.querySelector('.submitBtn');

        if (this.parent.data?.buttons?.submit?.completed) {
            submitBtn.innerHTML = this.parent.data.buttons.submit.completed;
        }

        inputs.forEach((i) => (i.disabled = true));

        submitBtn.disabled = true;
    }
}

window.customElements.define('question-range', QuestionRange);