import {AuxFunctions} from '../auxFunctions.js'

const answerTemplateLongFillIn = document.createElement('template')
answerTemplateLongFillIn.innerHTML = `
        <div class='answerContainer'>
            <textarea rows='7' cols='50' placeholder='Поле ввода'></textarea>        
            <div class='answerFeedback off'></div>
        </div>
`

const templateLongFillIn = document.createElement('template')
templateLongFillIn.innerHTML = `
<style>
* {
    margin: 0;
    padding: 0;
    line-height: var(--line-height-primary);
    box-sizing: border-box;
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

            transform-origin: var(--questionEntrance-transform-origin);
            animation: var(--questionEntrance-animation);
        }

        @keyframes questionEntrance {
            from {
                translate: 0 -100%;
            }
    
            to {
                translate: 0;
            }
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

        .questionContainer .answersContainer .answerContainer textarea {
            box-sizing: border-box;
            display: block;
            min-width: var(--fillin-min-width);
            border-radius: var(--fillin-border-radius);
            border-width: var(--fillin-border-width-normal);
            border-style: var(--fillin-border-style);
            border-color: var(--fillin-border-color-normal);
            box-shadow: var(--fillin-box-shadow);
            background: var(--fillin-bg-color);
            padding: var(--fillin-padding);
            font-size: var(--fillin-font-size);
            font-family: var(--fillin-font-family);
            outline: none;
            color: black;
        }

        .questionContainer .answersContainer .answerContainer textarea.correct{
            background: var(--color-correct);
        }

        .questionContainer .answersContainer .answerContainer textarea.incorrect{
            background: var(--color-incorrect);
        }

        .questionContainer .answersContainer .answerContainer textarea:focus-within {
            border-width: var(--fillin-border-width-focus);
            border-color: var(--fillin-border-color-focus);
            padding: var(--fillin-padding-focus);
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

        .questionContainer .tipsContainer .tipBtn {
            padding: 0;
            background: transparent;
            color: black;
            font-style: italic;
            text-decoration: underline;
            transition: all 300ms linear;
            border-width: 0;
        }

        .questionContainer .tipsContainer .tipBtn:hover {
            text-decoration: none;
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
            width: var(--questionFeedback-width);
            padding: var(--questionFeedback-padding);

            border-style: var(--questionFeedback-border-style);
            border-width: var(--questionFeedback-border-width);
            border-color: var(--questionFeedback-border-color);
            border-radius: var(--questionFeedback-border-radius);
        }

        .questionContainer.correct .questionFeedback{
            background: var(--questionFeedback-bg-color-correct, var(--questionFeedback-background));
        }

        .questionContainer.incorrect .questionFeedback{
            background: var(--questionFeedback-bg-color-incorrect, var(--questionFeedback-background));
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

    .questionContainer.correct .subHeader .correctnessMarker, .questionContainer.incorrect .subHeader .correctnessMarker{
        display: block;
        position: relative;
        width: calc(var(--inputbox-dimension) * 0.7);
        height: calc(var(--inputbox-dimension) * 0.7);
        border-radius: 360px;
    }

    .questionContainer .subHeader .correctnessMarker::before, .questionContainer .subHeader .correctnessMarker::after{
        content: '';
        display: block;
        position: absolute;
        inset: 0;
        border-radius: 360px;        
    }

    .questionContainer.correct .subHeader .correctnessMarker {
        background: var(--color-correct);
    }

    .questionContainer.incorrect .subHeader .correctnessMarker {
        background: var(--color-incorrect);
    }

    .questionContainer.correct .subHeader .correctnessMarker::before{        
        clip-path: polygon(12% 47%, 29% 47%, 48% 62%, 75% 33%, 91% 33%, 48% 78%);
        background: black;
        opacity: 0.3;
    }

    .questionContainer.incorrect .subHeader .correctnessMarker::before{        
        clip-path: polygon(30% 20%, 20% 30%, 40% 50%, 20% 70%, 30% 80%, 50% 60%, 70% 80%, 80% 70%, 60% 50%, 80% 30%, 70% 20%, 50% 40%);
        background: black;
        opacity: 0.3;
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
        text-align: center;
        justify-content: center;
        justify-items: center;
        opacity: 1;
        transition: all 200ms linear;
    }

    .btn.invisible {
        opacity: 0;
    }

    .btn:hover{
        color: var(--button-color-hover);
        background: var(--button-bg-color-hover);
        border-width: var(--button-border-width-hover);
        border-color: var(--button-border-color-hover);
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
        background: var(--button-bg-color-disabled);
        border-width: var(--button-border-width-disabled);
        border-color: var(--button-border-color-disabled);
        text-shadow :var(--button-text-shadow-disabled, none);
        box-shadow :var(--button-box-shadow-disabled, none);
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

    @media screen and (max-width: 800px) {
        
    }

    @media screen and (max-width: 370px) {
        
    }
</style>
<div class='question-long-fill-in questionContainer'>
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
        <button type='button' class='submitBtn btn invisible' disabled></button>
        <button type='button' class='continueBtn btn off'></button>
    </div>
</div>
`

export class QuestionLongFillIn extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({mode: 'open'})

        this.shadowRoot.appendChild(templateLongFillIn.content.cloneNode(true))

        this.completed = false
        this.result = false
        this.status = 'initial'
        this.score = 0
        this.state = {}
    }

    get iri() {
        return `${this.parent.iri}/${this.data.id}`
    }

    get amountOfQuestions() {
        return this.parent.amountOfQuestions
    }

    get submitMode() {
        return this.parent.data.submitMode
    }

    get displayMode() {
        return this.parent.data.displayMode
    }

    get attemptsPerTest() {
        return this.parent.data.attemptsPerTest
    }

    get passingScore() {
        return this.parent.data.passingScore
    }

    get resume() {
        return (
            this.parent.resumed === true &&
            this.parent.data.resume.resume === true &&
            this.parent.status !== 'initial'
        )
    }

    setFields(data, index, parent, state) {
        this.parent = parent
        this.data = data
        this.index = index
        this.state = state
        this.data.evaluated = parent.data.evaluated

        // <- for statements only

        let question = ''
        if (parent.data?.commonQuestion !== '') {
            question = `${parent.data.commonQuestion} ${data.question}`
        } else {
            question = data.question
        }

        this.data.description =
            data.story !== ''
                ? AuxFunctions.clearFromTags(data.story)
                : AuxFunctions.clearFromTags(question)
        this.data.nameRus = question

        // for statements only ->

        let that = this

        // adding subtype as a class
        this.questionContainer =
            this.shadowRoot.querySelector('.questionContainer')
        if (this.data.subtype !== '') {
            this.classList.add(this.data.subtype)
            this.questionContainer.classList.add(this.data.subtype)
        }

        if (this.parent.data?.counter && this.parent.data.counter != '') {
            let subHeader = this.shadowRoot.querySelector('.subHeader')
            let counter = this.shadowRoot.querySelector('.counter')
            counter.innerHTML = AuxFunctions.parseText(
                parent.data.counter,
                this
            )
            counter.classList.remove('off')
            subHeader.classList.remove('off')
        }

        if (this.data.story.length > 0) {
            let story = this.shadowRoot.querySelector('.story')
            story.innerHTML = this.data.story
            story.classList.remove('off')
        }

        if (this.data.instruction !== ' ') {
            this.shadowRoot.querySelector('.instruction').innerHTML =
                AuxFunctions.parseText(this.data.instruction, this)
        } else {
            this.shadowRoot.querySelector('.instruction').classList.add('off')
        }

        this.shadowRoot.querySelector('.questionText').innerHTML =
            this.data.question

        if (this.data.help.length !== 0 && this.data.help[0] !== '') {
            let tipsContainer = this.shadowRoot.querySelector('.tipsContainer')
            tipsContainer.classList.remove('off')
            this.tipBtn = this.shadowRoot.querySelector('.tipBtn')
            this.tipBtn.dataset.tipnum = 1
            this.tipBtn.innerHTML =
                this.data.help.length === 1
                    ? 'Показать подсказку'
                    : `Показать подсказку ${this.tipBtn.dataset.tipnum} из ${this.data.help.length}`
            //дописать логику показа подсказок
            this.tipBtn.addEventListener('click', () => {
                let currentTip = Number(this.tipBtn.dataset.tipnum)
                if (currentTip === 1) {
                    let pp = document.createElement('popup-unit')
                    pp.init(
                        `tips_for_${that.data.id}`,
                        'Подсказки',
                        `<div class='tip'><p class='tipHeader'>Подсказка 1:</p><p>${
                            this.data.help[currentTip - 1]
                        }</p></div>`
                    )
                    pp.showPopup()
                } else {
                    let pp = document.querySelector(`#tips_for_${that.data.id}`)
                    let tips = this.data.help
                        .filter((t, i) => i < currentTip)
                        .map(
                            (h, i) =>
                                `<div class='tip'><p class='tipHeader'>Подсказка ${
                                    i + 1
                                }:</p><p>${h}</p></div>`
                        )
                        .join('')
                    pp.updateContent('Подсказки', tips)
                    pp.showPopup()
                }
                let nextTip =
                    currentTip + 1 > this.data.help.length
                        ? this.data.help.length
                        : currentTip + 1
                this.tipBtn.dataset.tipnum = nextTip
                this.tipBtn.innerHTML =
                    this.data.help.length === 1
                        ? 'Показать подсказку'
                        : `Показать подсказку ${this.tipBtn.dataset.tipnum} из ${this.data.help.length}`
            })
        }

        let answersContainer =
            this.shadowRoot.querySelector('.answersContainer')

        let newAnswer = answerTemplateLongFillIn.content.cloneNode(true)
        answersContainer.append(newAnswer)

        if (this.submitMode === 'all_at_once') {
            this.shadowRoot.querySelector('.submitBtn').classList.add('off')
        }

        this.setButtons()
        this.setGridTemplateAreas()
        this.emitEvent('created')
        this.setListeners()
        if (!('isFake' in this.state)) {
            if (this.resume === true) {
                if (!('status' in this.state)) {
                    // to handle old version without states
                    this.state.status = 'completed'
                }
                this.restoreState()
            }
        }
    }

    setButtons() {
        let continueBtn = this.shadowRoot.querySelector('.continueBtn')
        let submitBtn = this.shadowRoot.querySelector('.submitBtn')
        Object.keys(this.parent.data.buttons).forEach((k) => {
            let btn = this.shadowRoot.querySelector(`.${k}Btn`)
            if (btn) {
                btn.innerHTML = this.parent.data.buttons[k].initial
                if (this.parent.data.buttons[k].icon === true) {
                    btn.classList.add('icon')
                }
            }
        })

        if (this.index + 1 === this.amountOfQuestions) {
            let continueBtn = this.shadowRoot.querySelector('.continueBtn')
            continueBtn.classList.add('continueLastBtn')
            continueBtn.innerHTML = this.parent.data.buttons.continue.last
        }

        if (this.status === 'completed' && this.displayMode === 'one_by_one') {
            continueBtn.classList.add('off')
        }

        if (this.submitMode === 'all_at_once') {
            this.shadowRoot
                .querySelector('.buttonsContainer')
                .classList.add('off')
        }

        submitBtn.classList.remove('invisible')
    }

    get globalTestGridAreas() {
        return getComputedStyle(document.documentElement)
            .getPropertyValue('--questionContainer-grid-template-areas')
            .trim()
            .split('" "')
            .map((i) => i.replaceAll('"', ''))
    }

    setGridTemplateAreas() {
        let questionContainer =
            this.shadowRoot.querySelector('.questionContainer')
        let currentAreas = Array.from(questionContainer.children)
            .map((element) => {
                if (!element.className.includes('off')) {
                    return element.className.split(' ')[0]
                } else {
                    return ''
                }
            })
            .filter((i) => i !== '')

        let currentAreasString = this.globalTestGridAreas
            .map((unit) => {
                let subunits = unit.split(' ')
                if (subunits.every((u) => currentAreas.includes(u))) {
                    return `"${unit}"`
                } else {
                    return ''
                }
            })
            .filter((unit) => unit !== '')
            .join(' ')

        Array.from(this.shadowRoot.styleSheets[0].cssRules)
            .filter((rule) => rule.selectorText === '.questionContainer')[0]
            .style.setProperty(
                '--questionContainer-grid-template-areas',
                currentAreasString
            )
    }

    restoreState() {
        this.status = this.state.status
        if (this.status === 'inProgress') {
            this.restoreAnswers()
        } else if (this.status === 'completed') {
            this.completed = true
            this.result = this.state.result
            this.restoreAnswers()
            this.disableElements()
            this.showFeedback()
        }
    }

    restoreAnswers() {
        if ('exactUserAnswer' in this.state) {
            let textarea = this.shadowRoot.querySelector('textarea')
            textarea.value = this.state.exactUserAnswer

            let submitBtn = this.shadowRoot.querySelector('.submitBtn')
            if (this.checked) {
                submitBtn.disabled = false
            }
        }
    }

    get checked() {
        let value = this.shadowRoot.querySelector('textarea').value

        if (value.length > 0) {
            return true
        }
        return false
    }

    setListeners() {
        let that = this
        // Disable/enable submitBtn on textarea changes.

        let input = this.shadowRoot.querySelector('textarea')
        let submitBtn = this.shadowRoot.querySelector('.submitBtn')
        let continueBtn = this.shadowRoot.querySelector('.continueBtn')

        input.addEventListener('input', (e) => {
            if (e.target.value.length > 0) {
                submitBtn.disabled = false
                this.emitEvent('questionInProgress')
            } else {
                submitBtn.disabled = true
            }
        })

        input.addEventListener('focusout', (e) => {
            if (this.checked) {
                if (this.status === 'initial') {
                    this.status = 'inProgress'
                }

                submitBtn.disabled = false
            } else {
                submitBtn.disabled = true
            }

            this.setState('user input')
            this.emitEvent('questionInProgress')
        })

        // submitBtn action
        submitBtn.addEventListener('click', this.checkAnswer.bind(this))

        // continueBtn action
        continueBtn.addEventListener('click', (e) => {
            if (that.displayMode === 'one_by_one') {
                e.target.classList.add('off')
            }
            that.emitEvent('continue')
        })
    }

    get exactUserAnswer() {
        let input = this.shadowRoot.querySelector('textarea')
        return input.value
    }

    checkAnswer() {
        let that = this
        if (this.checked) {
            this.completed = true
            this.status = 'completed'

            let answerFeedback =
                this.shadowRoot.querySelector('.answerFeedback')

            if (this.parent.data?.buttons?.submit?.completed) {
                this.shadowRoot.querySelector('.submitBtn').innerHTML =
                    this.parent.data.buttons.submit.completed
            }

            if (
                this.data.answers.length === 1 &&
                this.data.answers[0].text === ''
            ) {
                this.result = this.data.answers[0].correct
                this.score = this.data.answers[0].weight
            } else {
                this.data.answers.forEach((a) => {
                    if (
                        a.text.toLowerCase().trim() ===
                        this.exactUserAnswer.toLowerCase().trim()
                    ) {
                        this.result = a.correct
                        this.score = a.weight

                        if (a.feedback !== '') {
                            answerFeedback.innerHTML = a.feedback
                            answerFeedback.classList.remove('off')
                        }
                    }
                })
            }

            console.log(`Question ${this.iri} answered. Result: ${this.result}`)

            this.disableElements()

            if ('isFake' in this.state) {
                delete this.state.isFake
            }
            that.emitEvent('answered')
            that.setState('question completed')
            that.showFeedback()
        }
    }

    logQuestionData() {
        console.log(
            `%cQuestion data for ${this.data.id}`,
            'color:red;font-weigth:bold;font-size:16px;'
        )
        try {
            let data = {
                initialData: this.data,
                state: this.state,
                status: this.status,
                result: this.result,
                userAnswer: this.userAnswer,
                exactUserAnswer: this.exactUserAnswer,
                userPoolsResult: this.userPoolsResult,
                completed: this.completed,
                score: this.score,
                hasPools: this.hasPools,
                hasFeedback: this.hasFeedback,
            }
            console.log(data)
        } catch (e) {
            console.log(e)
        }
    }

    get userAnswer() {
        let that = this
        if (
            that.data.answers.length === 1 &&
            that.data.answers[0].text === ''
        ) {
            return [[that.data.answers[0].id, true]]
        } else {
            let answers = that.data.answers.filter((a) => {
                a.text.toLowerCase().trim() ===
                    that.exactUserAnswer.toLowerCase().trim()
            })

            if (answers.length > 0) {
                return [[answers[0].id, true]]
            } else {
                return undefined
            }
        }
    }

    setState(msg = '') {
        console.log(
            `%c...setting question ${this.iri} state due to: ${msg}`,
            'color:blue;font-weight:bold;'
        )
        this.state.date = new Date()
        this.state.status = this.status
        this.state.result = this.result
        this.state.userAnswer = this.userAnswer
        this.state.exactUserAnswer = this.exactUserAnswer
        this.state.userPoolsResult = this.userPoolsResult
        this.state.completed = this.completed
        this.state.score = this.score

        if ('isFake' in this.state) {
            delete this.state.isFake
        }

        this.emitEvent('state_changed')
    }

    get hasFeedback() {
        if (this.data.showPoolsInFeedback) {
            return true
        }

        if (this.data?.feedback?.correct && this.data.feedback.correct !== '') {
            return true
        }

        if (
            this.data?.feedback?.incorrect &&
            this.data.feedback.incorrect !== ''
        ) {
            return true
        }

        if (
            this.data.answers.filter((a) => a.feedback !== '').length > 0 &&
            this.parent.data.feedback.answersFeedbackMode === 'question'
        ) {
            return true
        }

        return false
    }

    markQuestionCorrectness() {
        let question = this.shadowRoot.querySelector('.questionContainer')
        let marker = question.querySelector('.subHeader .correctnessMarker')
        marker.classList.remove('off')

        if (this.result) {
            question.classList.add('correct')
            question.classList.remove('incorrect')
        } else {
            question.classList.add('incorrect')
            question.classList.remove('correct')
        }
    }

    showCorrectAnswers() {
        let that = this
        let input = this.shadowRoot.querySelector('textarea')

        if (this.result) {
            input.classList.add('correct')
        } else {
            input.classList.add('incorrect')
            let correctResponse = that.data.answers.filter((a) => a.correct)[0]
                .text
            let feedback = this.shadowRoot.querySelector('.answerFeedback')
            feedback.classList.remove('off')
            let node = document.createElement('p')
            node.innerText = `Ваш ответ: ${this.exactUserAnswer}. Возможный верный ответ: ${correctResponse}`
            feedback.append(node)
        }
    }

    markResponsesCorrectness() {
        let input = this.shadowRoot.querySelector('textarea')

        if (this.result) {
            input.classList.add('correct')
        } else {
            input.classList.add('incorrect')
        }
    }

    showFeedback() {
        let feedback = this.shadowRoot.querySelector('.questionFeedback')
        feedback.scrollIntoView()

        if (
            this.parent.data?.questionsSettings?.feedback?.hideElements &&
            this.parent.data.questionsSettings.feedback.hideElements.length > 0
        ) {
            this.parent.data.questionsSettings.feedback.hideElements.forEach(
                (element) => {
                    this.shadowRoot
                        .querySelector(`${element}`)
                        .classList.add('off')
                }
            )
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
        if ('answersFeedbackMode' in this.parent.data.feedback) {
            if (this.parent.data.feedback.answersFeedbackMode === 'answer') {
                this.userAnswer
                    .filter((a) => a[1] === true)
                    .forEach((a) => {
                        let answer = this.data.answers.filter(
                            (ans) => ans.id === a[0]
                        )[0]

                        let answerFeedback = this.shadowRoot.querySelector(
                            `.answerFeedback[data-id='${a[0]}']`
                        )
                        if (answer.feedback.length > 0) {
                            answerFeedback.innerHTML = answer.feedback
                            answerFeedback.classList.remove('off')
                        }
                    })
            } else if (
                this.parent.data.feedback.answersFeedbackMode === 'question'
            ) {
                this.userAnswer
                    .filter((a) => a[1] === true)
                    .forEach((a) => {
                        let answer = this.data.answers.filter(
                            (ans) => ans.id === a[0]
                        )[0]

                        if (answer.feedback.length > 0) {
                            let aFeedback = document.createElement('div')
                            aFeedback.classList.add('answerFeedback')
                            aFeedback.innerHTML = AuxFunctions.parseText(
                                answer.feedback,
                                answer
                            )
                            feedback.append(aFeedback)
                        }
                    })
            }
        }

        // process question feedback

        if (this.result) {
            if (this.data.feedback.correct) {
                let qFeedback = document.createElement('div')
                qFeedback.innerHTML = AuxFunctions.parseText(
                    this.data.feedback.correct,
                    this
                )
                feedback.append(qFeedback)
            }
            this.shadowRoot
                .querySelector('.questionContainer')
                .classList.add('correct')
        } else {
            if (this.data.feedback.incorrect) {
                let qFeedback = document.createElement('div')
                qFeedback.innerHTML = AuxFunctions.parseText(
                    this.data.feedback.incorrect,
                    this
                )
                feedback.append(qFeedback)
            }
            this.shadowRoot
                .querySelector('.questionContainer')
                .classList.add('incorrect')
        }

        // show pools
        if (
            this.data.showPoolsInFeedback === true &&
            this.userPoolsResult.length > 0
        ) {
            let poolsContainer = document.createElement('div')
            poolsContainer.classList.add('poolsContainer')

            this.userPoolsResult.forEach((r) => {
                let poolContainer = document.createElement('div')
                poolContainer.classList.add('poolContainer')

                let pool = new Pool()
                pool.init(r.id)
                poolContainer.append(pool)

                let userPoolResult = document.createElement('div')
                userPoolResult.classList.add('userPoolResult')
                userPoolResult.innerText = r.value > 0 ? `+${r.value}` : r.value
                poolContainer.append(userPoolResult)

                poolsContainer.append(poolContainer)
            })

            feedback.prepend(poolsContainer)
        }

        // show feedback
        // show feedback
        if (this.hasFeedback) {
            feedback.classList.remove('off')
        } else {
            feedback.classList.add('off')
        }

        this.setGridTemplateAreas()

        //show NEXT button
        if (
            this.parent.data.displayMode === 'one_instead_another' /* ||
            this.parent.data.displayMode === 'one_by_one' */
        ) {
            if (this.hasFeedback) {
                let continueBtn = this.shadowRoot.querySelector('.continueBtn')
                let submitBtn = this.shadowRoot.querySelector('.submitBtn')
                submitBtn.classList.add('off')
                if (
                    this.parent.data.displayMode === 'one_instead_another' /* ||
                    this.parent.data.displayMode === 'one_by_one' */
                ) {
                    continueBtn.classList.remove('off')
                }
                /* if (
                    this.parent.data.displayMode === 'one_by_one' &&
                    this.index < this.parent.lastQuestionIndex
                ) {
                    continueBtn.classList.add('off');
                } */
            } else {
                this.emitEvent('continue')
            }
        } else if (
            this.parent.data.displayMode === 'all_at_once' ||
            this.parent.data.displayMode === 'one_by_one'
        ) {
            if (this.parent.data.submitMode === 'each') {
                this.emitEvent('continue')
            }
        }
    }

    get hasPools() {
        return (
            this.data.answers.filter(
                (answer) => 'pools' in answer && answer.pools.length > 0
            ).length > 0
        )
    }

    get userPoolsResult() {
        let that = this
        if (this.userAnswer) {
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
                            let pool = accum.filter((i) => i.id === item.id)

                            if (pool.length === 0) {
                                accum.push(Object.assign({}, item))
                            } else {
                                pool[0].value = pool[0].value + item.value
                            }
                        })
                    }
                    return accum
                }, [])
        } else {
            return []
        }
    }

    emitEvent(eventName) {
        let that = this
        let event = new CustomEvent(eventName, {
            bubbles: true,
            composed: true,
            detail: {
                obj: that,
            },
        })
        console.log(`Event "${eventName}" was dispatched by ${this.iri}`)
        this.dispatchEvent(event)
    }

    disableElements() {
        let inputs = Array.from(this.shadowRoot.querySelectorAll('textarea'))
        let submitBtn = this.shadowRoot.querySelector('.submitBtn')

        if (this.parent.data?.buttons?.submit?.completed) {
            submitBtn.innerHTML = this.parent.data.buttons.submit.completed
        }

        inputs.forEach((i) => (i.disabled = true))

        submitBtn.disabled = true
    }
}

window.customElements.define('question-long-fill-in', QuestionLongFillIn)
