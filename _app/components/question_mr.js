import { AuxFunctions } from '../auxFunctions.js';
import { Pool } from './pool.js';

const answerTemplateMR = document.createElement('template');
answerTemplateMR.innerHTML = `
        <div class='answerContainer'>
            <div>
                <input type='checkbox'/>
                <label><span class='inputMarker'></span><span class='text'></span></label>
                <div class='answerFeedback off'></div>
            </div>
        </div>
`;

const answerTemplateMRImage = document.createElement('template');
answerTemplateMRImage.innerHTML = `
<div class='answerContainer'>
<div>
    <input type='checkbox'/>
    <label>
    <span class='imageContainer'>
    <img src='' alt='picture' class='img'>
    </span>
    <span class='text'></span></label>
    <div class='answerFeedback off'></div>
</div>
</div>
`;

const templateMR = document.createElement('template');
templateMR.innerHTML = `
<style>
* {
    margin: 0;
    padding: 0;
    line-height: var(--line-height-primary);
    box-sizing: border-box;
    font-family: var(--font-family-primary);
    font-size: var(--font-size-primary);
    color: var(--color-dark-primary);
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

            border-style: var(--questionContainer-border-style);
            border-width: var(--questionContainer-border-width);
            border-color: var(--questionContainer-border-color);
            border-radius: var(--questionContainer-border-radius);
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

        .questionContainer .answersContainer.image .answerContainer{
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

    /* .correctnessMarker.correct {
        background-color: var(--color-correct);
        clip-path: polygon(20% 40%, 40% 40%, 40% 20%, 60% 20%, 60% 40%, 80% 40%, 80% 60%, 60% 60%, 60% 80%, 40% 80%, 40% 60%, 20% 60%);
        
    }

    .correctnessMarker.incorrect {
        background-color: var(--color-incorrect);
        clip-path: polygon(20% 40%, 80% 40%, 80% 60%, 20% 60%);
    } */

    .answerContainer label .text {
        align-self: center;
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
        display: block;
        box-sizing: border-box;
        width: var(--inputbox-dimension);
        height: var(--inputbox-dimension);
        border-style: solid;
        border-color: var(--inputbox-border-color);
        border-width: var(--inputbox-border-width);
        background: var(--inputbox-bg-color);
        border-radius: var(--inputbox-border-radius-mr);
        z-index:1;
    } 

    input.correct + label > span.inputMarker:before {
        background: var(--color-correct);
    }

    input.incorrect + label > span.inputMarker:before {
        background: var(--color-incorrect);
    }

    input + label > span.inputMarker:after {
        content: '';
        display: block;
        position: absolute;
        top:0;
        left:0;
        box-sizing: border-box;
        width: var(--inputbox-dimension);
        height: var(--inputbox-dimension);
        border-radius: var(--inputbox-border-radius-mr);
        z-index: 2;
    } 

    input:checked + label > span.inputMarker:after {
        content: '';
        background: var(--inputbox-marker-color);
        clip-path: inset(calc((var(--inputbox-dimension) / 2)));
        animation-name: inset;
        animation-iteration-count: 1;
        animation-duration: 0.2s;
        animation-timing-function: ease-in;
        animation-fill-mode: forwards;
    }

    .order input:checked + label > span.inputMarker:after {
        counter-reset: variable var(--order);
        content: counter(variable);
        background: transparent;
        clip-path: revert;
        animation: none;
        color: var(--inputbox-marker-color, var(--color-dark-primary));
        font-size: var(--font-size-primary);
        text-align: center;
    }

    .questionContainer .answersContainer.image input:checked + label > span.imageContainer {
        border-color: var(--color-hover);
    }

    @keyframes inset {
        from {
            clip-path: inset(50%);
        }
    
        to {
            clip-path: inset(calc((var(--inputbox-dimension) * 0.25)));
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

    @media screen and (max-width: 800px) {

    }

    @media screen and (max-width: 370px) {

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
        <button type='button' class='submitBtn btn invisible' disabled></button>
        <button type='button' class='continueBtn btn off'></button>
    </div>
</div>
`;

export class QuestionMR extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.appendChild(templateMR.content.cloneNode(true));

        this.completed = false;
        this.result = false;
        this.status = 'initial';
        this.score = 0;
        this.state = {};
        this.answersOrder = new Set();
    }

    get iri() {
        return `${this.parent.iri}/${this.data.id}`;
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
        this.score = 0;
        this.index = index;
        this.data.evaluated = parent.data.evaluated;

        this.state = state;

        // <- for statements only

        let question = '';
        if (parent.data.commonQuestion !== '') {
            question = `${parent.data.commonQuestion} ${data.question}`;
        } else {
            question = data.question;
        }

        this.data.description = data.story !== '' ? data.story : question;
        this.data.nameRus = question;

        // for statements only ->

        let that = this;

        // adding subtype as a class
        this.questionContainer = this.shadowRoot.querySelector(".questionContainer")
        if (this.data.subtype !== "") {
            this.classList.add(this.data.subtype)
            this.questionContainer.classList.add(this.data.subtype)
        }

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

        if (this.data.help.length !== 0 && this.data.help[0] !== '') {
            let tipsContainer = this.shadowRoot.querySelector('.tipsContainer');
            tipsContainer.classList.remove('off');
            this.tipBtn = this.shadowRoot.querySelector('.tipBtn');
            this.tipBtn.innerHTML = `${this.data.help.length} tip(s) available`;
            //дописать логику показа подсказок
        }

        let answers = this.shadowRoot.querySelector('.answersContainer');

        let answersData = this.data.answers;

        if (this.data.shuffle) {
            answersData = AuxFunctions.shuffleArray(this.data.answers);
        }

        answersData.forEach(async (a, i) => {
            let newAnswer;

            if (that.data?.subtype !== '') {
                answers.classList.add(that.data.subtype);
                if (that.data.subtype === 'image') {
                    newAnswer = answerTemplateMRImage.content.cloneNode(true);
                    
                } else {
                    newAnswer = answerTemplateMR.content.cloneNode(true);
                }
            } else {
                newAnswer = answerTemplateMR.content.cloneNode(true);
            }

            answers.appendChild(newAnswer);

            newAnswer = Array.from(answers.children)[i];

            if (that.data?.subtype === 'image') {
                let folder = this.data.id.split('_').slice(0, 2).join('_');
                try {
                    let svg = await fetch(`./_app/img/${folder}/${a.id}.svg`, { method: 'HEAD' })
                    
                    if (svg.ok) {
                        newAnswer
                            .querySelector('img')
                            .setAttribute('src', `./_app/img/${folder}/${a.id}.svg`);
                    } else {
                        newAnswer
                            .querySelector('img')
                            .setAttribute('src', `./_app/img/${folder}/${a.id}.png`);
                    }
                } catch (e) {
                    console.log(e)
                }
            }

            newAnswer.setAttribute('data-id', a.id);
            newAnswer.querySelector('input').setAttribute('id', a.id);
            newAnswer.querySelector('input').setAttribute('name', that.data.id);
            newAnswer.querySelector('label').setAttribute('for', a.id);
            newAnswer.querySelector('label span.text').innerHTML = a.text;
            let feedback = newAnswer.querySelector('.answerFeedback');
            feedback.dataset.id = a.id;
        });

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
        let submitBtn = this.shadowRoot.querySelector('.submitBtn');
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

        submitBtn.classList.remove('invisible');
    }

    get globalTestGridAreas() {
        return getComputedStyle(document.documentElement)
            .getPropertyValue('--questionContainer-grid-template-areas')
            .trim()
            .split('" "')
            .map((i) => i.replaceAll('"', ''));
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
                let subunits = unit.split(' ');
                if (subunits.every((u) => currentAreas.includes(u))) {
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
        let that = this;

        if ('userAnswer' in this.state) {
            let inputs = Array.from(this.shadowRoot.querySelectorAll('input'));
            let inputMarkers = Array.from(
                this.shadowRoot.querySelectorAll('.inputMarker')
            );
            inputs.forEach((i, index) => {
                let currentAnswer = that.state.userAnswer.filter(
                    (a) => a[0] === i.id
                )[0];
                if (currentAnswer[1] === true) {
                    i.checked = true;
                }
                if (that.data.subtype === 'order') {
                    if (currentAnswer[2]) {
                        inputMarkers[index].style.setProperty(
                            '--order',
                            currentAnswer[2]
                        );
                    }
                }
            });

            let submitBtn = this.shadowRoot.querySelector('.submitBtn');
            if (this.checked) {
                submitBtn.disabled = false;
            }
        }
    }

    get validation() {
        let result = {
            min: null,
            max: null
        }

        if(this.data.validation !== null && 'max' in this.data.validation && this.data.validation.max !== null){
            result.max = this.data.validation.max
        } else {
            result.max = this.data.answers.length
        }

        if(this.data.validation !== null && 'min' in this.data.validation && this.data.validation.min !== null){
            result.min = this.data.validation.min
        } else {
            result.min = 1
        }

        return result
    }

    get checked() {
        let inputs = Array.from(this.shadowRoot.querySelectorAll('input'));
        let checkedItems = inputs.filter((input) => input.checked).length;

        if (
            checkedItems >= this.validation.min &&
            checkedItems <= this.validation.max
        ) {
            return true;
        }
        return false;
    }

    setAnswersOrder(id) {
        let that = this;
        if (this.answersOrder.has(id)) {
            this.answersOrder.delete(id);
        } else {
            this.answersOrder.add(id);
        }

        console.log(this.answersOrder);
        let markers = Array.from(
            this.shadowRoot.querySelectorAll('.inputMarker')
        );
        let arr = [...this.answersOrder];

        markers.forEach((m) => {
            let mId = m.parentElement.getAttribute('for');
            m.style.setProperty('--order', '');

            if (that.answersOrder.has(mId)) {
                m.style.setProperty('--order', arr.indexOf(mId) + 1);
            }
        });
    }

    setListeners() {
        let that = this;
        // Disable/enable submitBtn on inputs' changes.

        let inputs = Array.from(this.shadowRoot.querySelectorAll('input'));
        let submitBtn = this.shadowRoot.querySelector('.submitBtn');
        let continueBtn = this.shadowRoot.querySelector('.continueBtn');

        inputs.forEach((i) => {
            i.addEventListener('change', (e) => {
                if (this.data?.subtype === 'order') {
                    that.setAnswersOrder(e.target.id);
                }
                if (that.checked) {
                    submitBtn.disabled = false;
                    if (that.status === 'initial') {
                        that.status = 'inProgress';
                    }
                } else {
                    submitBtn.disabled = true;
                }
                that.emitEvent('questionInProgress');
                that.setState('user input');
            });
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

    get userAnswer() {
        let that = this;
        let inputs = Array.from(that.shadowRoot.querySelectorAll('input'));

        if (this.data.subtype === 'order') {
            let order = Array.from(
                that.shadowRoot.querySelectorAll('.inputMarker')
            ).map((i) => {
                if (i.style.getPropertyValue('--order')) {
                    return i.style.getPropertyValue('--order');
                } else {
                    return '';
                }
            });
            return inputs.map((i, index) => {
                return [i.id, i.checked, order[index]];
            });
        }

        return inputs.map((i) => {
            return [i.id, i.checked];
        });
    }

    checkAnswer() {
        let that = this;

        this.status = 'completed';

        this.userAnswer
            .filter((a) => a[1] === true)
            .forEach((a) => {
                let answer = this.data.answers.filter(
                    (ans) => ans.id === a[0]
                )[0];

                that.score = that.score + Number(answer.weight);
            });

        if (this.parent.data?.buttons?.submit?.completed) {
            this.shadowRoot.querySelector('.submitBtn').innerHTML =
                this.parent.data.buttons.submit.completed;
        }

        let answerCorrectness = this.userAnswer.map((a) => {
            let answer = this.data.answers.filter((ans) => ans.id === a[0])[0];
            let isCorrect = answer.correct === a[1];
            return [answer.id, isCorrect];
        });

        if (answerCorrectness.some((a) => a[1] === false)) {
            this.result = false;
        } else {
            this.result = true;
        }

        this.emitEvent('answered');
        console.log(
            `Question ${this.data.id} answered. Result: ${this.result}`
        );

        this.disableElements();

        this.disableElements();
        this.showFeedback();

        if ('isFake' in this.state) {
            delete this.state.isFake;
        }
        this.setState('question completed');
    }

    get exactUserAnswer() {
        let exactUserAnswer = [];

        this.userAnswer
            .filter((a) => a[1] === true)
            .forEach((a) => {
                let answer = this.data.answers.filter(
                    (ans) => ans.id === a[0]
                )[0];

                if (this.data.subtype === 'order') {
                    exactUserAnswer.push(`${a[2]}. ${answer.text}`);
                } else {
                    exactUserAnswer.push(answer.text);
                }
            });

        return exactUserAnswer.map((a, ind) => `${ind + 1}) ${a}`).join('   ');
    }

    setState(msg = '') {
        console.log(
            `%c...setting question ${this.data.id} state due to: ${msg}`,
            'color:blue;font-weight:bold;'
        );
        this.state.date = new Date();
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

    get hasPools() {
        return this.data.answers.filter((a) => a.pools.length > 0).length > 0;
    }

    get hasFeedback() {
        if (this.data.showPoolsInFeedback) {
            return true;
        }

        if (this.data?.feedback?.correct && this.data.feedback.correct !== '') {
            return true;
        }

        if (
            this.data?.feedback?.incorrect &&
            this.data.feedback.incorrect !== ''
        ) {
            return true;
        }

        if (
            this.data.answers.filter((a) => a.feedback !== '').length > 0 &&
            this.parent.data.feedback.answersFeedbackMode === 'question'
        ) {
            return true;
        }

        return false;
    }

    markQuestionCorrectness() {
        let question = this.shadowRoot.querySelector('.questionContainer');
        let marker = question.querySelector('.subHeader .correctnessMarker');
        marker.classList.remove('off');

        if (this.result) {
            question.classList.add('correct');
            question.classList.remove('incorrect');
        } else {
            question.classList.add('incorrect');
            question.classList.remove('correct');
        }
    }

    showCorrectAnswers() {
        let that = this;
        let inputs = Array.from(this.shadowRoot.querySelectorAll('input'));
        inputs.forEach((i) => {
            if (that.data.answers.filter((a) => a.id === i.id)[0].correct) {
                i.classList.add('correct');
            } else {
                i.classList.add('incorrect');
            }
        });
    }

    markResponsesCorrectness() {
        let that = this;
        let inputs = Array.from(
            this.shadowRoot.querySelectorAll('input')
        ).filter((i) => i.checked);
        inputs.forEach((i) => {
            if (that.data.answers.filter((a) => a.id === i.id)[0].correct) {
                i.classList.add('correct');
            } else {
                i.classList.add('incorrect');
            }
        });
    }

    showFeedback() {
        let feedback = this.shadowRoot.querySelector('.questionFeedback');
        feedback.scrollIntoView();

        if (
            this.parent.data?.questionsSettings?.feedback?.hideElements &&
            this.parent.data.questionsSettings.feedback.hideElements.length > 0
        ) {
            
                this.parent.data.questionsSettings.feedback.hideElements.forEach(
                    (element) => {
                        this.shadowRoot
                            .querySelector(`${element}`)
                            .classList.add('off');
                    }
                );
            
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
                        )[0];

                        let answerFeedback = this.shadowRoot.querySelector(
                            `.answerFeedback[data-id='${a[0]}']`
                        );
                        if (answer.feedback.length > 0) {
                            answerFeedback.innerHTML = answer.feedback;
                            answerFeedback.classList.remove('off');
                        }
                    });
            } else if (this.parent.data.feedback.answersFeedbackMode === 'question') {
                this.userAnswer
                    .filter((a) => a[1] === true)
                    .forEach((a) => {
                        let answer = this.data.answers.filter(
                            (ans) => ans.id === a[0]
                        )[0];

                        if (answer.feedback.length > 0) {
                            let aFeedback = document.createElement('div');
                            aFeedback.classList.add('answerFeedback');
                            aFeedback.innerHTML = AuxFunctions.parseText(
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
        if (this.hasFeedback) {
            feedback.classList.remove('off');
        } else {
            feedback.classList.add('off');
        }

        this.setGridTemplateAreas();

        //show NEXT button
        if (
            this.parent.data.displayMode === 'one_instead_another' /* ||
            this.parent.data.displayMode === 'one_by_one' */
        ) {
            if (this.hasFeedback) {
                let continueBtn = this.shadowRoot.querySelector('.continueBtn');
                let submitBtn = this.shadowRoot.querySelector('.submitBtn');
                submitBtn.classList.add('off');
                if (
                    this.parent.data.displayMode === 'one_instead_another' /* ||
                    this.parent.data.displayMode === 'one_by_one' */
                ) {
                    continueBtn.classList.remove('off');
                }
                /* if (
                    this.parent.data.displayMode === 'one_by_one' &&
                    this.index < this.parent.lastQuestionIndex
                ) {
                    continueBtn.classList.add('off');
                } */
            } else {
                this.emitEvent('continue');
            }
        } else if (
            this.parent.data.displayMode === 'all_at_once' ||
            this.parent.data.displayMode === 'one_by_one'
        ) {
            if (this.parent.data.submitMode === 'each') {
                this.emitEvent('continue');
            }
        }
    }

    get userPoolsResult() {
        let that = this;
        return that.userAnswer
            .filter((a) => a[1] === true)
            .map((a) => a[0])
            .map(
                (id) =>
                    that.data.answers.filter((ans) => ans.id === id)[0].pools
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
        let labels = Array.from(this.shadowRoot.querySelectorAll('label'));
        let submitBtn = this.shadowRoot.querySelector('.submitBtn');

        if (this.parent.data?.buttons?.submit?.completed) {
            submitBtn.innerHTML = this.parent.data.buttons.submit.completed;
        }

        inputs.forEach((i) => (i.disabled = true));

        labels.forEach((l) => l.classList.add('inactive'));

        submitBtn.disabled = true;
    }
}

window.customElements.define('question-mr', QuestionMR);
