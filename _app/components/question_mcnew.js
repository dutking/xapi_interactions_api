import {Question} from './question.js'
import {Statement} from '../statement.js'
import {XAPI} from '../xapi.js'
import {STATUSES, SUPPORTED_VERBS, INTERACTION_TYPES, EVENTS, DISPLAY_MODES} from '../enums.js'
import {AuxFunctions} from '../auxFunctions.js'
import {Pool} from './pool.js'

const questionTemplate = document.createElement('template')
questionTemplate.innerHTML = `
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
            --this-questionContainer-grid-template-areas: var(--questionContainer-grid-template-areas);
            display: grid;
            grid-template-columns: var(--questionContainer-grid-template-columns);
            grid-template-rows: var(--questionContainer-grid-template-rows);
            grid-template-areas: var(--this-questionContainer-grid-template-areas);
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
        

        .questionContainer.likert {
            --questionContainer-grid-template-columns: 1fr 2fr;
            --this-questionContainer-grid-template-areas: 
            'question answersContainer';
            --answerContainer-label-font-size: 12px;
            column-gap: 2rem;
        }

        .questionContainer.likert.odd {
            background: hsla(var(--questionContainerLikert-color-odd-h), var(--questionContainerLikert-color-odd-s), var(--questionContainerLikert-color-odd-l), var(--questionContainerLikert-color-odd-a))
        }

        .questionContainer.likert.even {
            background: hsla(var(--questionContainerLikert-color-even-h), var(--questionContainerLikert-color-even-s), var(--questionContainerLikert-color-even-l), var(--questionContainerLikert-color-even-a))
        }

        .questionContainer.feedbackOnly {
            --this-questionContainer-grid-template-areas: 'subHeader' 'questionFeedback' 'buttonsContainer';
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
            transform: var(--question-correctnessMarker-transform, revert);
            width: calc(var(--inputbox-dimension) * 0.7);
            height: calc(var(--inputbox-dimension) * 0.7);
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

        .questionContainer.likert .question .story {
            font-size: 1rem;
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

        .questionContainer.likert .answersContainer {
            --answersContainer-grid-template-columns: auto;
        }

        .questionContainer .answersContainer.image {
            grid-template-columns: var(--answersContainerImage-grid-template-columns);
            width: 100%;
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

        .questionContainer .answersContainer .answerContainer label {
            box-sizing: border-box;
            display: grid;
            grid-template-columns: var(--answerContainer-label-grid-template-columns);
            grid-template-rows: var(--answerContainer-label-grid-template-rows);
            grid-template-areas: var(--answerContainer-label-grid-template-areas);
            row-gap: var(--answerContainer-label-row-gap);
            column-gap: var(--answerContainer-label-column-gap);
            justify-items: var(--answerContainer-justify-items);
            align-items: var(--answerContainer-align-items);
            justify-content: var(--answerContainer-justify-content);
            align-content: var(--answerContainer-align-content);

            color: var(--answerContainer-label-color);
            font-family: var(--answerContainer-label-font-family);
            font-size: var(--answerContainer-label-font-size);
            font-weight: var(--answerContainer-label-font-weight);
            font-style: var(--answerContainer-label-font-style);

            background: var(--answerContainer-label-background);

            padding: var(--answerContainer-label-padding);

            border-style: var(--answerContainer-label-border-style);
            border-width: var(--answerContainer-label-border-width);
            border-color: var(--answerContainer-label-border-color);
            border-radius: var(--answerContainer-label-border-radius);
        }

        .questionContainer.likert .answersContainer .answerContainer label {
            --answerContainer-label-grid-template-columns: 1fr;
            --answerContainer-label-grid-template-areas: 'text' 'inputMarker';
            --answerContainer-justify-items: center;
            --answerContainer-align-items: center;
            --answerContainer-justify-content: center;
            --answerContainer-align-content: center;
            line-height: 1;
        }

        questionContainer .answersContainer.image .answerContainer{
            width: var(--image-width);
        }        

        .questionContainer .answersContainer.image .answerContainer label {
            box-sizing: border-box;
            display: grid;
            grid-template-columns: var(--answerContainer-labelImage-grid-template-columns);
            grid-template-rows: var(--answerContainer-labelImage-grid-template-rows);
            grid-template-areas: var(--answerContainer-labelImage-grid-template-areas);
            row-gap: var(--answerContainer-labelImage-row-gap);
            column-gap: var(--answerContainer-labelImage-column-gap);
            justify-items: var(--answerContainer-justify-items);
            align-items: var(--answerContainer-align-items);
            justify-content: var(--answerContainer-justify-content);
            align-content: var(--answerContainer-align-content);

            color: var(--answerContainer-label-color);
            font-family: var(--answerContainer-label-font-family);
            font-size: var(--answerContainer-label-font-size);
            font-weight: var(--answerContainer-label-font-weight);
            font-style: var(--answerContainer-label-font-style);

            background: var(--answerContainer-label-background);            

            border-style: var(--answerContainer-label-border-style);
            border-width: var(--answerContainer-label-border-width);
            border-color: var(--answerContainer-label-border-color);
            border-radius: var(--answerContainer-label-border-radius);
            isolation: isolate;
        }

        .questionContainer .answersContainer.image .answerContainer label .imageContainer {
            grid-area: img;
            padding: var(--answerContainer-labelImage-padding);
            border: 2px solid transparent;
            border-radius: var(--answerContainer-labelImage-border-radius);
        }

        .questionContainer .answersContainer.image .answerContainer label .imageContainer:hover{
            border-color: var(--color-hover);
        }

        .questionContainer .answersContainer.image .answerContainer label .img{
            display: block;
            width: 100%;
        }

        .questionContainer .answersContainer .answerContainer label .text{
            grid-area: text;            
        }

        .questionContainer.likert .answersContainer .answerContainer label .text{
            text-align: center;
            line-height: 1.5;           
        }

        .questionContainer .answersContainer.image .answerContainer label .text{            
            padding: 0.5rem;
            display: grid;
            grid-template-columns: 1fr;
            align-content: center;
            justify-content: center;
            align-items: center;
            justify-items: center;
            background: color: var(--answerContainer-labelImage-background);
            /* white-space: nowrap; */
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

    .answerContainer label .text {
        align-self: center;
        width: 100%;
    }

    input{
        display: none;
    }

    label {
        cursor: pointer;
    }

    label > span.inputMarker {
        display: flex;
        align-items: center;
        position: relative;
        box-sizing: border-box;
    }

    input + label > span.inputMarker:before {
        content: '';
        display: inline-block;
        box-sizing: border-box;
        width: var(--inputbox-dimension);
        height: var(--inputbox-dimension);
        border-style: solid;
        border-color: var(--inputbox-border-color);
        border-width: var(--inputbox-border-width);
        border-radius: var(--inputbox-border-radius-mc);
        background: var(--inputbox-bg-color);
    } 

    input.correct + label > span.inputMarker:before {
        background: var(--color-correct);
    }

    input.incorrect + label > span.inputMarker:before {
        background: var(--color-incorrect);
    }

    .questionContainer .answersContainer.image input.correct + label .imageContainer {
        border: 2px solid var(--color-correct) !important;
    }

    .questionContainer .answersContainer.image input.incorrect + label .imageContainer {
        border: 2px solid var(--color-incorrect) !important;
    }

    input + label > span.inputMarker:after {
        content: '';
        display: inline-block;
        position: absolute;
        top:0;
        left:0;
        box-sizing: border-box;
        width: var(--inputbox-dimension);
        height: var(--inputbox-dimension);
        border-radius: var(--inputbox-border-radius-mc);
    } 

    input:checked + label > span.inputMarker:after {
        background: var(--inputbox-marker-color);
        clip-path: circle(0% at 50% 50%);
        animation-name: circle;
        animation-iteration-count: 1;
        animation-duration: 0.2s;
        animation-timing-function: ease-in;
        animation-fill-mode: forwards;
    }

    .questionContainer .answersContainer.image input:checked + label > span.imageContainer {
        border-color: var(--color-hover);
    }

    @keyframes circle {
        from {
            clip-path: circle(0% at 50% 50%);
        }
    
        to {
            clip-path: circle(25% at 50% 50%);
        }
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

    @media screen and (max-width: 640px) {
        .questionContainer.likert {
            --questionContainer-grid-template-columns: 1fr;
            --this-questionContainer-grid-template-areas: 
            'question' 'answersContainer';
            --questionContainer-row-gap: 2rem;
        }

        .questionContainer.likert .question .story {
            font-size: 1rem;
        }

        .questionContainer.likert .answersContainer .answerContainer label .text.off{
            display: block !important;          
        }

        
    }

    @media screen and (max-width: 480px) {
        .questionContainer.likert .answersContainer {
            --answersContainer-grid-template-columns: 1fr;
            --answersContainer-justify-items: start;
            --answersContainer-align-items: start;
            --answersContainer-justify-content: start;
            --answersContainer-align-content: start;
        }

        .questionContainer.likert .answersContainer .answerContainer label {
            --answerContainer-label-grid-template-columns: var(--inputbox-dimension) auto;
            --answerContainer-label-grid-template-areas: 'inputMarker text';
            --answerContainer-justify-items: start;
            --answerContainer-align-items: start;
            --answerContainer-justify-content: start;
            --answerContainer-align-content: start;
            line-height: 1;
        }
    }

</style>
<div class='question-mc questionContainer'>
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
        <button type='button' class='submitBtn btn' disabled></button>
        <button type='button' class='continueBtn btn off'></button>
        <button type='button' class='tryAgainBtn btn off'></button>
    </div>
</div>
`

// * tryAgainBtn above just added. 
// TODO: support this.parent.attemptsPerQuestion
// where to add this option:
// - in test settings?
// - in question settings?
// apply only when submitMode=each

export class QuestionMCnew extends Question {
    constructor() {
        super()
        this.attachShadow({mode: 'open'})

        this.shadowRoot.appendChild(questionTemplate.content.cloneNode(true))
    }

    get answerTemplate(){
        const answerTemplate = document.createElement('template')
        answerTemplate.innerHTML = `
                <div class='answerContainer'>
                    <div>
                        <input type='radio'/>
                        <label><span class='inputMarker'></span><span class='text'></span></label>
                        <div class='answerFeedback off'></div>
                    </div>
                </div>
        `
        return answerTemplate
    }

    restoreAnswersState() {
        let that = this
        if (this.state.userResponse) {
            this.inputs.forEach((input) => {
                let currentAnswer = this.state.userResponse.filter(
                    (response) => response.id === input.id
                )[0]
                if (currentAnswer.filled === true) {
                    input.checked = true
                }
            })

            if (this.responseIsGiven) {
                this.submitBtn.disabled = false
            }
        }
    }

    get responseIsGiven() {
        let respondedItems = this.inputs.filter((input) => input.checked).length 

        if (respondedItems === 1) {
            return true
        }
        return false
    }

    get userResponse() {
        return this.inputs.map((input) => {
            return {id: input.id, filled: input.checked}
        })
    }

    get result() {
        if(this.status === STATUSES.COMPLETED){
            const answerCorrectness = this.userResponse.map((userAns) => {
                const [answer] = this.data.answers.filter((ans) => ans.id === userAns.id)
                return answer.correct === userAns.filled
            })
    
            return answerCorrectness.every((a) => a === true)
        }

        return undefined
    }

    get exactUserResponse() {
        let exactUserResponse = []

        this.userResponse
            .filter((response) => response.filled === true)
            .forEach((response) => {
                let [answer] = this.data.answers.filter(
                    (ans) => ans.id === response.id
                )

                exactUserResponse.push(AuxFunctions.clearFromTags(answer.text))
            })

        return exactUserResponse.map((reponse, index) => `${index + 1}) ${response}`).join('   ')
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
        let inputs = Array.from(this.shadowRoot.querySelectorAll('input'))
        inputs.forEach((i) => {
            if (that.data.answers.filter((a) => a.id === i.id)[0].correct) {
                i.classList.add('correct')
            } else {
                i.classList.add('incorrect')
            }
        })
    }

    markResponsesCorrectness() {
        let that = this
        let inputs = Array.from(
            this.shadowRoot.querySelectorAll('input')
        ).filter((i) => i.checked)
        inputs.forEach((i) => {
            if (that.data.answers.filter((a) => a.id === i.id)[0].correct) {
                i.classList.add('correct')
            } else {
                i.classList.add('incorrect')
            }
        })
    }

}

window.customElements.define('question-mcnew', QuestionMCnew)
