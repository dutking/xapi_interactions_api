import {QuestionMC} from './question_mc.js'
import {QuestionMR} from './question_mr.js'
import {QuestionRange} from './question_range.js'
import {QuestionFillIn} from './question_fill-in.js'
import {QuestionLongFillIn} from './question_long-fill-in.js'
import {QuestionInlineFillIn} from './question_inline-fill-in.js'
import {ChartHTML} from './chart_html.js'
import {scoringFunctions} from '../scoringFunctions.js'
import {AuxFunctions} from '../auxFunctions.js'
import {Pool} from './pool.js'

const testTemplate = document.createElement('template')
testTemplate.innerHTML = `
<style>
* {
    margin: 0;
    padding: 0;
    line-height: var(--line-height);
    box-sizing: border-box;
}

    strong {
        font-weight: var(--font-weight-bold);
    }

    .testContainer {
        --this-test-grid-template-areas: var(--test-grid-template-areas);
        --z-index-base: 100;
        z-index: var(--z-index-base);
        display: grid;
        grid-template-columns: var(--test-grid-template-columns);
        grid-template-rows: var(--test-grid-template-rows);
        grid-template-areas: var(--this-test-grid-template-areas);
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
        line-height: var(--line-height-primary);

        background: var(--test-background);

        padding: var(--test-padding);
        margin: var(--test-margin);

        border-style: var(--test-border-style);
        border-width: var(--test-border-width);
        border-color: var(--test-border-color);
        border-radius: var(--test-border-radius);
        
        width: var(--test-best-width);
        max-width: var(--max-width);
    }    

    .testContainer .instruction {
        z-index: inherit;
        grid-area: instruction;
        display: grid;
        grid-template-columns: var(--test-instruction-grid-template-columns);
        grid-template-rows: var(--test-instruction-grid-template-rows);
        row-gap: var(--test-instruction-row-gap);
        column-gap: var(--test-instruction-column-gap);
        justify-items: var(--test-instruction-justify-items);
        align-items: var(--test-instruction-align-items);
        justify-content: var(--test-instruction-justify-content);
        align-content: var(--test-instruction-align-content);

        color: var(--test-instruction-color);
        font-family: var(--test-instruction-font-family);
        font-size: var(--test-instruction-font-size);
        font-weight: var(--test-instruction-font-weight);
        font-style: var(--test-instruction-font-style);

        background: var(--test-instruction-background);

        padding: var(--test-instruction-padding);

        border-style: var(--test-instruction-border-style);
        border-width: var(--test-instruction-border-width);
        border-color: var(--test-instruction-border-color);
        border-radius: var(--test-instruction-border-radius);
        width: 100%;
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
        width: 100%;
    }

    .testContainer .questionsContainer {
        position: relative;
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

        width: 100%;
    }

    .testContainer.likert .questionsContainer .likertHeader{
        box-sizing: border-box;
        position: sticky;
        top: 0;
        left: 0;
        display: grid;
        grid-template-columns: 1fr 2fr;
        padding: 2rem 0;
        background: rgba(255,255,255,0.8);
        font-size: 14px;
        line-height: 1.2;
        z-index: calc(var(--z-index-base) + 11);
        margin-bottom: 1rem;
    }

    .testContainer.likert .questionsContainer .likertHeader .statement {
        padding-left: 2rem;
        align-self: center;
    }

    .testContainer.likert .questionsContainer .likertHeader .answers {
        --amount-of-answers: 3;
        display: grid;
        grid-template-columns: repeat(var(--amount-of-answers), 1fr);
        column-gap: 1.5rem;
    }

    .testContainer.likert .questionsContainer .likertHeader .answers div {
        text-align: center;
    }

    .testContainer.likert .questionsContainer .likertHeader .answers div:last-child{
        padding-right: 5px;
    }

    .testContainer .questionsContainer > * {
        overflow-y: clip;
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

        width: var(--feedbackContainer-width);
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

        width: calc(var(--test-best-width) - calc(var(--test-padding) * 2));;
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

    .btn.invisible {
        opacity: 0;
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

    @media screen and (max-width: 640px) {
        .testContainer.likert .questionsContainer .likertHeader{
            display: none;
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
`

export class Test extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({
            mode: 'open',
        })

        this.shadowRoot.appendChild(testTemplate.content.cloneNode(true))
    }

    init(placeholder, interaction, stateData = {}, parent) {
        this.parent = parent
        this.placeholder = placeholder
        this.data = interaction
        this.attempt = 0
        this.questionsToTake = []
        this.state = stateData
        this.completed = false
        this.scores = []
        /* this.processedScores = []; */
        this.questionsOrder = []
        this.lastQuestionShownId = ''
        this.resumed = false
        this.status = 'initial'

        placeholder.appendChild(this)

        if (!('isFake' in this.state)) {
            this.resumed = true
            this.attempt = this.state.attempt
            this.completed = this.state.completed
            this.scores = this.state.scores
            this.questionsOrder = this.state.questionsOrder
            this.lastQuestionShownId = this.state.lastQuestionShownId
        }

        if (this.resumed === true) {
            if (this.data.resume.resume === true) {
                if ('status' in this.state) {
                    console.log(
                        `%cResumed status for ${this.data.id}: ${this.state.status}`,
                        'color:#FA9401;font-weight:bold;font-size:16px;'
                    )
                    this.status = this.state.status
                }
            }
        }

        this.setStaticContent()
        this.setLikert()
        this.setDynamicContent(this.status).then(() => {
            this.setClasses()
            this.setListeners()
            if (this.status === 'completed') {
                this.showResumed()
            }
            this.setGridTemplateAreas()
            // this.logTestData()
        })
    }

    logTestData() {
        console.log(
            `%cTEST DATA FOR ${this.data.id}`,
            'color:red;font-weigth:bold;font-size:18px;'
        )
        try {
            const data = {
                dbData: this.data,
                state: this.state,
                attempt: this.attempt,
                questionsToTake: this.questionsToTake,
                completed: this.completed,
                passed: this.passed,
                result: this.result,
                scores: this.scores,
                maxPossibleScore: this.maxPossibleScore,
                score: this.score,
                questionsOrder: this.questionsOrder,
                lastQuestionShownId: this.lastQuestionShownId,
                resumed: this.resumed,
                status: this.status,
                iri: this.iri,
                globalTestGridAreas: this.globalTestGridAreas,
                amountOfQuestions: this.amountOfQuestions,
                amountOfQuestionsToPass: this.amountOfQuestionsToPass,
                lastQuestionIndex: this.lastQuestionIndex,
                passingScore: this.passingScore,
                attemptCompleted: this.attemptCompleted,
                correctlyAnsweredQuestions: this.correctlyAnsweredQuestions,
                hasFeedback: this.hasFeedback,
                sendStmtMessage: this.sendStmtMessage,
            }
            console.log(data)
            this.questionsElements.forEach((e) => e.logQuestionData())
        } catch (e) {
            console.log(e)
        }
    }

    setClasses() {
        this.placeholder.classList.add(this.data.structure[0])

        if (this.data?.classes) {
            this.data.classes.split(' ').forEach((cl) => {
                this.placeholder.classList.add(cl)
                this.shadowRoot
                    .querySelector('.testContainer')
                    .classList.add(cl)
            })
        }
    }

    get iri() {
        return `${this.parent.iri}/${this.data.id}`
    }

    /* <- SETTING GRID */

    get currentStylesheets() {
        return Array.from(document.styleSheets).filter(
            (ss) =>
                ss.href !== null &&
                (ss.href.includes('_app/custom.css') ||
                    ss.href.includes('_app/style.css'))
        )
    }

    getCSSPropertyValue(selector, property) {
        const applicableStylesheets = this.currentStylesheets.filter(
            (ss) =>
                Array.from(ss.cssRules).filter((rule) =>
                    rule?.selectorText?.endsWith(selector)
                ).length > 0
        )

        let stylesheet
        if (applicableStylesheets.length > 1) {
            stylesheet = applicableStylesheets.filter((ss) =>
                ss.href.includes('_app/custom.css')
            )[0]
        } else if (applicableStylesheets.length === 1) {
            stylesheet = applicableStylesheets[0]
        } else if (applicableStylesheets.length === 0) {
            console.log('selector not found. using style.css')
            stylesheet = this.currentStylesheets.filter((ss) =>
                ss.href.includes('_app/style.css')
            )[0]
        }

        const selectors = Array.from(stylesheet.cssRules).filter((rule) =>
            String(rule.selectorText).endsWith(selector)
        )

        let style
        if (selectors.length === 1) {
            style = selectors[0].style
        } else if (selectors.length === 0) {
            console.log('selector not found. using ":root"')
            style = Array.from(stylesheet.cssRules).filter((rule) =>
                String(rule.selectorText).endsWith(':root')
            )[0].style
        } else {
            console.error('found more than one selector')
        }

        // style.getPropertyValue(property)
        // style.setProperty(property)

        const propertyValue = style.getPropertyValue(property)
        return {style, propertyValue}
    }

    get globalTestGridAreas() {
        return getComputedStyle(document.documentElement)
            .getPropertyValue('--test-grid-template-areas')
            .trim()
            .split('" "')
            .map((i) => i.replaceAll('"', ''))
    }

    setGridTemplateAreas() {
        const testContainer = this.shadowRoot.querySelector('.testContainer')
        const currentAreas = Array.from(testContainer.children)
            .map((element) => {
                if (!element.className.includes('off')) {
                    return element.className.split(' ')[0]
                }
                return ''
            })
            .filter((i) => i !== '')

        /* console.log(`CURRENT AREAS FOR ${this.data.id}: ${currentAreas}`) */
        const currentAreasString = this.globalTestGridAreas
            .map((unit) => {
                const subunits = unit.split(' ')

                if (subunits.every((u) => currentAreas.includes(u))) {
                    return `"${unit}"`
                }
                return ''
            })
            .filter((unit) => unit !== '')
            .join(' ')

        /* console.log(
            `currentAreasString for ${this.data.id}: ${currentAreasString}`
        ) */

        Array.from(this.shadowRoot.styleSheets[0].cssRules)
            .filter((rule) => rule.selectorText === '.testContainer')[0]
            .style.setProperty(
                '--this-test-grid-template-areas',
                currentAreasString
            )
    }

    /* SETTING GRID -> */

    /* setGridTemplateAreas() {
        let testContainer = this.shadowRoot.querySelector('.testContainer')
        let currentAreas = Array.from(testContainer.children)
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
                if (currentAreas.includes(unit)) {
                    return `"${unit}"`
                } else {
                    return ''
                }
            })
            .filter((unit) => unit !== '')
            .join(' ')

        console.log(`TEST AREAS ARE: ${currentAreasString}`)

        Array.from(this.shadowRoot.styleSheets[0].cssRules)
            .filter((rule) => rule.selectorText === '.testContainer')[0]
            .style.setProperty(
                '--this-test-grid-template-areas',
                currentAreasString
            )
    } */

    setStaticContent() {
        const instructionDiv = this.shadowRoot.querySelector('.instruction')
        if (this.data?.instruction && this.data.instruction.length > 0) {
            instructionDiv.innerHTML = AuxFunctions.parseText(
                this.data.instruction,
                this
            )
        } else {
            instructionDiv.classList.add('off')
        }

        const commonQuestionDiv =
            this.shadowRoot.querySelector('.commonQuestion')
        if (this.data?.commonQuestion && this.data.commonQuestion.length > 0) {
            commonQuestionDiv.innerHTML = this.data.commonQuestion
            commonQuestionDiv.classList.remove('off')
        } else {
            commonQuestionDiv.classList.add('off')
        }

        const buttonsContainer =
            this.shadowRoot.querySelector('.buttonsContainer')
        if (this.data.displayMode !== 'all_at_once') {
            buttonsContainer.classList.add('off')
        }

        this.setButtons()
    }

    setButtons() {
        Object.keys(this.data.buttons).forEach((k) => {
            const btn = this.shadowRoot.querySelector(`.${k}Btn`)
            if (btn) {
                btn.innerHTML = this.data.buttons[k].initial
                if (this.data.buttons[k].icon === true) {
                    btn.classList.add('icon')
                }
            }
        })
    }

    get amountOfQuestions() {
        const data = this.data.amountOfQuestions
        if (!isNaN(data)) {
            const val = Number(data)

            if (val === 0) {
                return this.data.iterables.length
            }

            return val
        }
        if (data.endsWith('%')) {
            return Math.floor(
                (this.data.iterables.length / 100) *
                    Number(data.split(':')[1].split('%')[0])
            )
        }

        if (data.startsWith('groups')) {
            const groups = data
                .split('groups:')[1]
                .split('</>')
                .map((i) => i.split('='))
            return groups.reduce((sum, e) => {
                let key = e[0]
                const value = e[1]
                if (key.startsWith('http')) {
                    key = `group_${
                        window.XAPI.data.context.contextActivities?.grouping[0]
                            ?.definition.extensions[e[0]]
                    }`
                }
                if (Number(value) === 0) {
                    return (sum += this.data.iterables.filter(
                        (i) => i.group === key
                    ).length)
                }
                if (Number(value) > 0) {
                    return (sum += Number(value))
                }
            }, 0)
        }

        return null
    }

    setCurrentAttemptQuestions(restore = false) {
        this.questionsToTake = []
        const that = this
        if (restore === false) {
            if (!this.data.amountOfQuestions.startsWith('groups')) {
                if (this.data?.shuffleQuestions === true) {
                    console.log(
                        '%cQuestions shuffled',
                        'color:lightblue;font-weight:bold;font-size:16px;'
                    )
                    this.questionsToTake = AuxFunctions.shuffleArray(
                        this.data.iterables.slice(0, this.amountOfQuestions)
                    )
                } else {
                    this.questionsToTake = Array.from(
                        this.data.iterables.slice(0, this.amountOfQuestions)
                    )
                }
            }

            if (this.data.amountOfQuestions.startsWith('groups')) {
                const groups = this.data.amountOfQuestions
                    .split('groups:')[1]
                    .split('</>')
                    .map((i) => i.split('='))
                groups.forEach((e) => {
                    let group = e[0]
                    if (group.startsWith('http')) {
                        group = `group_${
                            window.XAPI.data.context.contextActivities
                                ?.grouping[0]?.definition.extensions[e[0]]
                        }`
                    }
                    let questionsFromGroup = Number(e[1])
                    if (questionsFromGroup === 0) {
                        questionsFromGroup = that.data.iterables.filter(
                            (i) => i.group === group
                        ).length
                    }
                    let currentGroupQuestions = []
                    if (this.data.shuffleQuestions === true) {
                        currentGroupQuestions = AuxFunctions.shuffleArray(
                            that.data.iterables.filter((i) => i.group === group)
                        )
                    } else {
                        currentGroupQuestions = that.data.iterables.filter(
                            (i) => i.group === group
                        )
                    }

                    that.questionsToTake = [
                        ...that.questionsToTake,
                        ...Array.from(
                            currentGroupQuestions.slice(0, questionsFromGroup)
                        ),
                    ]
                })
            }

            this.questionsOrder = this.questionsToTake.map((q) => q.id)
            this.lastQuestionShownId = this.questionsOrder[0]
        } else if (restore === true) {
            this.questionsToTake = this.questionsOrder.map(
                (qId) => this.data.iterables.filter((i) => i.id === qId)[0]
            )
        }
    }

    setState(msg = '') {
        this.state.date = new Date()
        this.state.id = this.data.id
        this.state.completed = this.completed
        this.state.passed = this.passed
        this.state.result = this.result
        this.state.scores = this.scores
        this.state.userPoolsResult = this.userPoolsResult
        this.state.questionsOrder = this.questionsOrder
        this.state.lastQuestionShownId = this.lastQuestionShownId
        this.state.status = this.status
        this.state.attempt = this.attempt
        this.state.duration = moment
            .duration(
                Math.round((this.state.date - this.startTime) / 1000),
                'seconds'
            )
            .toISOString()

        if (this.data?.statements?.send) {
            this.state.sendStmtMessage = AuxFunctions.clearFromTags(
                this.sendStmtMessage
            )
        }

        if ('isFake' in this.state) {
            delete this.state.isFake
        }
        console.log(
            `%c...setting test state due to: ${msg}`,
            'color:#4AACDA;font-weight:bold;'
        )
        console.log(this.state)
        this.emitEvent('state_changed')
    }

    async setDynamicContent(status) {
        const that = this

        if (status === 'inProgress' || status === 'completed') {
            // true parameter set to restore questions based on questionsOrder got from state
            this.setCurrentAttemptQuestions(true)
        } else {
            this.setCurrentAttemptQuestions()
        }

        const createdQuestions = []

        if (this.data.displayMode === 'all_at_once') {
            this.questionsToTake.forEach((q) => {
                createdQuestions.push(that.createQuestion(q.id))
            })
        } else if (
            this.data.displayMode === 'one_by_one' ||
            this.data.displayMode === 'one_instead_another'
        ) {
            if (status === 'initial') {
                createdQuestions.push(
                    this.createQuestion(this.questionsToTake[0].id)
                )
            } else {
                let index = 0

                while (
                    this.questionsToTake[index].id !== this.lastQuestionShownId
                ) {
                    createdQuestions.push(
                        this.createQuestion(this.questionsToTake[index].id)
                    )
                    index++
                }

                // question with this.lastQuestionShownId
                createdQuestions.push(
                    this.createQuestion(this.questionsToTake[index].id)
                )
            }
        }

        const questions = await Promise.all(createdQuestions)

        if (
            status !== 'initial' &&
            this.questionsElements.length > 1 &&
            this.data.displayMode === 'one_instead_another'
        ) {
            // setting status to Completed for questions whose status is inProgress due to connection errors
            questions.forEach((q, i, arr) => {
                if (q.status === 'inProgress' && i < arr.length - 1) {
                    q.status = 'completed'
                    q.completed = true
                    q.setState('not last question cannot be inProgress')
                    q.emitEvent('continue')
                }
            })

            questions.slice(0, -1).forEach((i) => {
                i.classList.add('off')
            })
        }

        this.submitBtn = this.shadowRoot.querySelector('.submitBtn')
        if (this.data.submitMode === 'all_at_once') {
            if (status !== 'completed') {
                this.submitBtn.classList.remove('off')
            }
        }

        if (this.allChecked) {
            this.enableElement(this.submitBtn)
        }

        return Promise.resolve()

        /* return Promise.allSettled(createdQuestions).then(() => {
            if (
                status !== 'initial' &&
                this.questionsElements.length > 1 &&
                this.data.displayMode === 'one_instead_another'
            ) {
                // setting status to Completed for questions whose status is inProgress due to connection errors
                this.questionsElements.forEach((q, i, arr) => {
                    if (q.status === 'inProgress' && i < arr.length - 1) {
                        q.status = 'completed'
                        q.completed = true
                        q.setState('not last question cannot be inProgress')
                        q.emitEvent('continue')
                    }
                })

                this.questionsElements.slice(0, -1).forEach((i) => {
                    i.classList.add('off')
                })
            }

            this.submitBtn = this.shadowRoot.querySelector('.submitBtn')
            if (this.data.submitMode === 'all_at_once') {
                if (status !== 'completed') {
                    this.submitBtn.classList.remove('off')
                }
            }

            if (this.allChecked) {
                this.enableElement(this.submitBtn)
            }

            return new Promise((resolve, reject) => resolve())
        }) */
    }

    setLikert() {
        if (this.data.classes.includes('likert')) {
            const header = document.createElement('div')
            header.className = 'likertHeader'
            const answers = this.data.iterables[0].answers
                .map((a) => `<div class="answer">${a.text}</div>`)
                .join('')
            header.innerHTML = `<div class="statement">Вопрос</div><div class="answers">${answers}</div>`
            this.shadowRoot.querySelector('.questionsContainer').prepend(header)

            Array.from(this.shadowRoot.styleSheets[0].cssRules)
                .filter(
                    (rule) =>
                        rule.selectorText ===
                        '.testContainer.likert .questionsContainer .likertHeader .answers'
                )[0]
                .style.setProperty(
                    '--amount-of-answers',
                    this.data.iterables[0].answers.length
                )
        }
    }

    get likertData() {
        if (this.data.classes.includes('likert')) {
            const answers = this.questionsElements[0].data.answers.map(
                (a) => a.text
            )

            return this.questionsElements
                .map((e) =>
                    [
                        e.data.question,
                        e.userAnswer.filter((i) => i[1] === true),
                    ].flat()
                )
                .map((i) => i.flat())
                .map((i) => [i[0], i[1].split('a')[1]])
                .reduce(
                    (accum, item) => {
                        const position = Number(item[1]) - 1
                        accum[position].score += 1
                        accum[position].questions.push(item[0])
                        return accum
                    },
                    Array(answers.length)
                        .fill(null)
                        .map((i) => ({questions: [], score: 0}))
                )
                .map((i, index) => ({
                    text: answers[index],
                    score: i.score,
                    questions: i.questions.join(', '),
                }))
        }
        return undefined
    }

    get questionsElements() {
        const children = Array.from(
            this.shadowRoot.querySelector('.questionsContainer').children
        )
        const filtered = children.filter(
            (c) => !c.className.includes('likertHeader')
        )
        return filtered
    }

    get allChecked() {
        if (this.questionsElements.length === this.questionsToTake.length) {
            return this.questionsElements
                .map((i) => i.checked)
                .every((i) => i === true)
        }
        return false
    }

    getQuestionElement(id) {
        return this.questionsElements.filter((e) => e.data.id === id)[0]
    }

    async createQuestion(id) {
        const question = this.data.iterables.filter((q) => q.id === id)[0]
        const questionElement = document.createElement(
            `question-${question.type}`
        )

        this.shadowRoot
            .querySelector('.questionsContainer')
            .appendChild(questionElement)

        const qState = await window.XAPI.getState(`${this.iri}/${id}`)

        questionElement.setFields(
            question,
            this.questionsOrder.indexOf(id),
            this,
            qState
        )

        return new Promise((resolve, reject) => {
            resolve(questionElement)
        })
    }

    get lastQuestionIndex() {
        return this.questionsElements.length - 1
    }

    async deleteQuestionsStates() {
        const deleted = this.data.iterables.map((i) =>
            window.XAPI.deleteState(`${this.iri}/${i.id}`)
        )
        return await Promise.allSettled(deleted)
    }

    async restart() {
        this.attempt += 1
        this.resumed = false
        this.status = 'initial'
        console.log(
            `%cTest restarted. Attempt ${this.attempt}`,
            'color:lightblue;font-weight:bold;font-size:16px;'
        )

        this.questionsElements.forEach((child) => child.remove())

        await this.deleteQuestionsStates()

        const testContainer = this.shadowRoot.querySelector('.testContainer')
        testContainer.classList.remove('resumed')
        testContainer.classList.remove('correct')
        testContainer.classList.remove('incorrect')

        const buttonsContainer =
            this.shadowRoot.querySelector('.buttonsContainer')
        const tryAgainBtn = this.shadowRoot.querySelector('.tryAgainBtn')
        const submitBtn = this.shadowRoot.querySelector('.submitBtn')

        this.shadowRoot
            .querySelector('.questionsContainer')
            .classList.remove('off')

        const feedbackContainer =
            this.shadowRoot.querySelector('.feedbackContainer')
        feedbackContainer.classList.add('off')

        if (this.data.displayMode !== 'all_at_once') {
            buttonsContainer.classList.add('off')
            submitBtn.classList.add('off')
        }

        tryAgainBtn.classList.add('off')

        this.disableElement(submitBtn)
        this.questionsOrder = []
        this.completedQuestions = new Set()
        this.emitEvent('interacted')
        this.setStaticContent()
        this.setDynamicContent('initial').then(() => {
            this.setGridTemplateAreas()
            this.startTime = new Date()
            this.scrollIntoView()
            this.setState('test restarted')
            this.logTestData()
        })
    }

    emitEvent(eventName) {
        const that = this
        const event = new CustomEvent(eventName, {
            bubbles: true,
            composed: true,
            detail: {
                obj: that,
            },
        })
        console.log(`Event "${eventName}" was dispatched by ${this.data.id}`)
        this.dispatchEvent(event)
    }

    submitAll() {
        if (this.allChecked) {
            if (this.data?.buttons?.submit?.completed?.text) {
                this.submitBtn.innerHTML =
                    this.data.buttons.submit.completed.text
            }

            this.questionsElements.forEach((q) => q.checkAnswer())

            if (this.attemptCompleted) {
                this.setScore()
                this.completeTest()
            }
        }
    }

    markTestCorrectness() {
        const testContainer = this.shadowRoot.querySelector('.testContainer')
        if (this.passed) {
            console.log(
                `%cTest "${this.data.id}" passed`,
                'color:green;font-weight:bold;font-size:16px;'
            )

            testContainer.classList.add('correct')
            testContainer.classList.remove('incorrect')
        } else {
            console.log(
                `%cTest "${this.data.id}" failed`,
                'color:red;font-weight:bold;font-size:16px;'
            )
            testContainer.classList.remove('correct')
            testContainer.classList.add('incorrect')
        }
    }

    markQuestionsCorrectness(question = null) {
        if (
            this.data.feedback?.markQuestionsCorrectness &&
            this.data.feedback.markQuestionsCorrectness !== ''
        ) {
            if (
                this.data.feedback.markQuestionsCorrectness === 'answer' &&
                question
            ) {
                question.markQuestionCorrectness()
            } else if (
                this.data.feedback.markQuestionsCorrectness === 'completed' &&
                (this.attemptCompleted ||
                    (this.resumed && this.status === 'completed'))
            ) {
                this.questionsElements.forEach((q) =>
                    q.markQuestionCorrectness()
                )
            } else if (
                this.data.feedback.markQuestionsCorrectness ===
                    'passingAttempt' &&
                this.attempt + 1 === this.passingAttempt &&
                (this.attemptCompleted ||
                    (this.resumed && this.status === 'completed'))
            ) {
                this.questionsElements.forEach((q) =>
                    q.markQuestionCorrectness()
                )
            } else if (
                'markQuestionsCorrectness' in this.data.feedback &&
                this.data.feedback.markQuestionsCorrectness.startsWith(
                    'attempt'
                ) &&
                this.attempt + 1 ===
                    Number(
                        this.feedback.markQuestionsCorrectness.split(':')[1]
                    ) &&
                (this.attemptCompleted ||
                    (this.resumed && this.status === 'completed'))
            ) {
                this.questionsElements.forEach((q) =>
                    q.markQuestionCorrectness()
                )
            }
        }
    }

    showCorrectAnswers(question = null) {
        if (
            this.data.feedback?.showCorrectAnswers &&
            this.data.feedback.showCorrectAnswers !== ''
        ) {
            if (this.data.feedback.showCorrectAnswers === 'answer') {
                if (question) {
                    question.showCorrectAnswers()
                }
                if (this.resumed === true && this.completed === true) {
                    this.questionsElements.forEach((q) =>
                        q.showCorrectAnswers()
                    )
                }
            } else if (
                this.data.feedback.showCorrectAnswers === 'completed' &&
                (this.attemptCompleted ||
                    (this.resumed && this.status === 'completed'))
            ) {
                this.questionsElements.forEach((q) => q.showCorrectAnswers())
            } else if (
                this.data.feedback.showCorrectAnswers === 'passingAttempt' &&
                this.attempt + 1 === this.passingAttempt &&
                (this.attemptCompleted ||
                    (this.resumed && this.status === 'completed'))
            ) {
                this.questionsElements.forEach((q) => q.showCorrectAnswers())
            } else if (
                this.data.feedback.showCorrectAnswers.startsWith('attempt') &&
                this.attempt + 1 ===
                    Number(
                        this.data.feedback.showCorrectAnswers.split(':')[1]
                    ) &&
                (this.attemptCompleted ||
                    (this.resumed && this.status === 'completed'))
            ) {
                this.questionsElements.forEach((q) => q.showCorrectAnswers())
            }
        }
    }

    markResponsesCorrectness(question = null) {
        if (
            this.data.feedback?.markResponsesCorrectness ??
            this.data.feedback.markResponsesCorrectness !== ''
        ) {
            if (
                this.data.feedback.markResponsesCorrectness === 'answer' &&
                question
            ) {
                question.markResponsesCorrectness()
            } else if (
                this.data.feedback.markResponsesCorrectness === 'completed' &&
                (this.attemptCompleted ||
                    (this.resumed && this.status === 'completed'))
            ) {
                this.questionsElements.forEach((q) =>
                    q.markResponsesCorrectness()
                )
            } else if (
                this.data.feedback.markResponsesCorrectness ===
                    'passingAttempt' &&
                this.attempt + 1 === this.passingAttempt &&
                (this.attemptCompleted ||
                    (this.resumed && this.status === 'completed'))
            ) {
                this.questionsElements.forEach((q) =>
                    q.markResponsesCorrectness()
                )
            } else if (
                this.data.feedback.markResponsesCorrectness.startsWith(
                    'attempt'
                ) &&
                this.attempt + 1 ===
                    Number(
                        this.feedback.markResponsesCorrectness.split(':')[1]
                    ) &&
                (this.attemptCompleted ||
                    (this.resumed && this.status === 'completed'))
            ) {
                this.questionsElements.forEach((q) =>
                    q.markResponsesCorrectness()
                )
            }
        }
    }

    showResumed() {
        if (
            this.data.resume?.hideElements &&
            this.data.resume.hideElements.length > 0
        ) {
            this.data.resume.hideElements.forEach((element) => {
                this.shadowRoot.querySelector(`${element}`).classList.add('off')
            })
        }

        if (this.data.displayMode === 'one_instead_another') {
            this.shadowRoot.querySelector('.instruction').classList.add('off')
            this.shadowRoot
                .querySelector('.commonQuestion')
                .classList.add('off')
            this.shadowRoot
                .querySelector('.questionsContainer')
                .classList.add('off')
        }

        const feedbackContainer =
            this.shadowRoot.querySelector('.feedbackContainer')

        if (
            this.data.resume?.common !== '' ||
            this.data.resume?.passed !== '' ||
            this.data.resume?.failed !== '' ||
            (this.data.resume?.byScore &&
                this.data.resume.byScore.length > 0) ||
            this.data.resume?.showUserPoolsResult === true ||
            this.data.feedback.chartFunction !== ''
        ) {
            feedbackContainer.classList.remove('off')
        } else {
            feedbackContainer.classList.add('off')
        }

        if (
            this.data?.resume?.showUserPoolsResult &&
            this.data.resume.showUserPoolsResult === true &&
            this.userPoolsResult.length > 0
        ) {
            const poolsContainer = document.createElement('div')
            poolsContainer.classList.add('poolsContainer')

            this.userPoolsResult.forEach((r) => {
                const poolContainer = document.createElement('div')
                poolContainer.classList.add('poolContainer')

                const pool = new Pool()
                pool.init(r.id)
                poolContainer.append(pool)

                const userPoolResult = document.createElement('div')
                userPoolResult.classList.add('userPoolResult')
                userPoolResult.innerText = r.value > 0 ? `+${r.value}` : r.value
                poolContainer.append(userPoolResult)

                poolsContainer.append(poolContainer)
            })

            feedbackContainer.prepend(poolsContainer)
        }

        if (this.data.resume?.common !== '') {
            const text = document.createElement('p')
            text.innerHTML = AuxFunctions.parseText(
                this.data.resume.common,
                this
            )
            feedbackContainer.appendChild(text)
        }

        if (
            this.passed &&
            this.data.resume.passed &&
            this.data.resume.passed !== ''
        ) {
            const text = document.createElement('p')
            text.innerHTML = AuxFunctions.parseText(
                this.data.resume.passed,
                this
            )
            feedbackContainer.appendChild(text)
        }

        if (
            !this.passed &&
            this.data.resume.failed &&
            this.data.resume.failed !== ''
        ) {
            const text = document.createElement('p')
            text.innerHTML = AuxFunctions.parseText(
                this.data.resume.failed,
                this
            )
            feedbackContainer.appendChild(text)
        }

        if (this.data?.resume?.byScore && this.data.resume.byScore.length > 0) {
            const text = document.createElement('p')
            text.innerHTML = AuxFunctions.parseText(
                this.data.resume.byScore.filter(
                    (item) =>
                        this.score >= Number(item.interval[0]) &&
                        this.score <= Number(item.interval[1])
                )[0].text,
                this
            )
            feedbackContainer.appendChild(text)
        }

        this.setButtons()
        this.showTryAgainBtn()
        this.setGridTemplateAreas()
        this.markResponsesCorrectness()
        this.showCorrectAnswers()
        this.markQuestionsCorrectness()
    }

    showFeedback() {
        this.markTestCorrectness()

        if (
            this.data.feedback?.hideElements &&
            this.data.feedback.hideElements.length > 0
        ) {
            this.data.feedback.hideElements.forEach((element) => {
                this.shadowRoot.querySelector(`${element}`).classList.add('off')
            })
        }

        if (this.data.displayMode === 'one_instead_another') {
            this.shadowRoot.querySelector('.instruction').classList.add('off')
            this.shadowRoot
                .querySelector('.commonQuestion')
                .classList.add('off')
            this.shadowRoot
                .querySelector('.questionsContainer')
                .classList.add('off')
        }

        const feedbackContainer =
            this.shadowRoot.querySelector('.feedbackContainer')

        if (this.data.displayMode === 'one_instead_another') {
            this.scrollIntoView({block: 'center'})
        }

        if (this.hasFeedback) {
            feedbackContainer.classList.remove('off')
        } else {
            feedbackContainer.classList.add('off')
        }

        Array.from(feedbackContainer.childNodes).forEach((node) =>
            node.remove()
        )

        if (
            this.data.feedback?.showUserPoolsResult === true &&
            this.userPoolsResult.length > 0
        ) {
            const poolsContainer = document.createElement('div')
            poolsContainer.classList.add('poolsContainer')

            this.userPoolsResult.forEach((r) => {
                const poolContainer = document.createElement('div')
                poolContainer.classList.add('poolContainer')

                const pool = new Pool()
                pool.init(r.id)
                poolContainer.append(pool)

                const userPoolResult = document.createElement('div')
                userPoolResult.classList.add('userPoolResult')
                userPoolResult.innerText = r.value > 0 ? `+${r.value}` : r.value
                poolContainer.append(userPoolResult)

                poolsContainer.append(poolContainer)
            })

            feedbackContainer.prepend(poolsContainer)
        }

        if (this.data.feedback?.common !== '') {
            const text = document.createElement('p')
            text.innerHTML = AuxFunctions.parseText(
                this.data.feedback.common,
                this
            )
            feedbackContainer.appendChild(text)
        }

        if (
            this.data?.feedback?.chartFunction &&
            this.data.feedback.chartFunction !== ''
        ) {
            const chart = document.createElement('chart-html')
            feedbackContainer.appendChild(chart)
            chart.init(
                scoringFunctions[`${this.data.feedback.chartFunction}`](this)
            )
        }

        if (
            this.passed &&
            this.data.feedback.passed &&
            this.data.feedback.passed !== ''
        ) {
            const text = document.createElement('p')
            text.innerHTML = AuxFunctions.parseText(
                this.data.feedback.passed,
                this
            )
            feedbackContainer.appendChild(text)
        }

        if (
            !this.passed &&
            this.data.feedback.failed &&
            this.data.feedback.failed !== ''
        ) {
            const text = document.createElement('p')
            text.innerHTML = AuxFunctions.parseText(
                this.data.feedback.failed,
                this
            )
            feedbackContainer.appendChild(text)
        }

        if (this.data?.feedback?.byScore.length > 0) {
            const text = document.createElement('p')
            text.innerHTML = AuxFunctions.parseText(
                this.data.feedback.byScore.filter(
                    (item) =>
                        this.score >= Number(item.interval[0]) &&
                        this.score <= Number(item.interval[1])
                )[0].text,
                this
            )
            feedbackContainer.appendChild(text)
        }

        if (
            this.data?.feedback?.byAttempt &&
            this.data.feedback.byAttempt.length > 0 &&
            this.data.feedback.byAttempt.filter((i) => {
                if (
                    (i.attempt === 'passingAttempt' &&
                        this.passingAttempt === this.attempt + 1) ||
                    Number(i.attempt) === this.attempt + 1
                ) {
                    return true
                }
                return false
            }).length > 0
        ) {
            const text = document.createElement('p')
            text.innerHTML = AuxFunctions.parseText(
                this.data.feedback.byAttempt.filter((i) => {
                    if (
                        (i.attempt === 'passingAttempt' &&
                            this.passingAttempt === this.attempt + 1) ||
                        Number(i.attempt) === this.attempt + 1
                    ) {
                        return true
                    }
                    return false
                })[0].text,
                this
            )
            feedbackContainer.appendChild(text)
        }

        this.shadowRoot.querySelector('.submitBtn').classList.add('off')
        this.showTryAgainBtn()
        this.setGridTemplateAreas()
        this.markResponsesCorrectness()
        this.showCorrectAnswers()
        this.markQuestionsCorrectness()
    }

    showTryAgainBtn() {
        const buttonsContainer =
            this.shadowRoot.querySelector('.buttonsContainer')
        const tryAgainBtn = this.shadowRoot.querySelector('.tryAgainBtn')

        if (this.data.tryAgain === 'until_all_attempts') {
            if (
                Number(this.data.attemptsPerTest) === 0 ||
                this.attempt + 1 < Number(this.data.attemptsPerTest)
            ) {
                buttonsContainer.classList.remove('off')
                tryAgainBtn.classList.remove('off')
                this.enableElement(tryAgainBtn)
            } else {
                buttonsContainer.classList.add('off')
                tryAgainBtn.classList.add('off')
            }
        } else if (this.data.tryAgain === 'until_max_score') {
            if (
                (this.attempt + 1 < Number(this.data.attemptsPerTest) ||
                    Number(this.data.attemptsPerTest) === 0) &&
                this.score < this.maxPossibleScore
            ) {
                buttonsContainer.classList.remove('off')
                tryAgainBtn.classList.remove('off')
                this.enableElement(tryAgainBtn)
            } else {
                buttonsContainer.classList.add('off')
                tryAgainBtn.classList.add('off')
            }
        } else if (this.data.tryAgain === 'until_passed') {
            if (
                (this.attempt + 1 < Number(this.data.attemptsPerTest) ||
                    Number(this.data.attemptsPerTest) === 0) &&
                !this.passed
            ) {
                buttonsContainer.classList.remove('off')
                tryAgainBtn.classList.remove('off')
                this.enableElement(tryAgainBtn)
            } else {
                buttonsContainer.classList.add('off')
                tryAgainBtn.classList.add('off')
            }
        } else if (this.data.tryAgain === 'until_result') {
            if (
                (this.attempt + 1 < Number(this.data.attemptsPerTest) ||
                    Number(this.data.attemptsPerTest) === 0) &&
                !this.result
            ) {
                buttonsContainer.classList.remove('off')
                tryAgainBtn.classList.remove('off')
                this.enableElement(tryAgainBtn)
            } else {
                buttonsContainer.classList.add('off')
                tryAgainBtn.classList.add('off')
            }
        } else {
            buttonsContainer.classList.add('off')
            tryAgainBtn.classList.add('off')
        }
    }

    get passingScore() {
        if (typeof this.data.passingScore === 'string') {
            if (this.data.passingScore.includes('%')) {
                const multiplier = Number(
                    this.data.passingScore.replace('%', '')
                )
                return Math.round((this.maxPossibleScore / 100) * multiplier)
            }
            return Number(this.data.passingScore)
        }
        if (typeof this.data.passingScore === 'number') {
            return this.data.passingScore
        }

        return 0
    }

    get attemptCompleted() {
        if (this.questionsElements.length === this.questionsToTake.length) {
            const statuses = this.questionsElements.map((i) => i.status)

            return statuses.every((i) => i === 'completed')
        }

        return false
    }

    get amountOfQuestionsToPass() {
        if (this.data.scoring === 'questions') {
            const singleWeight = this.data.iterables[0].weight
            const sameWeights = this.data.iterables.every(
                (q) => q.weight === singleWeight
            )
            if (sameWeights) {
                const value = this.passingScore / Number(singleWeight)
                // attempt to remove floating point calculation deviations
                if (value - Math.round(value) < 0.01) {
                    return Math.round(value)
                }
                return Math.ceil(value)
            }
            console.log(
                'amountOfQuestionsToPass. Unable to count - weights are not the same.'
            )
            return null
        }
    }

    get correctlyAnsweredQuestions() {
        return this.questionsElements.filter((i) => i.result === true).length
    }

    setScore() {
        let currentAttemptScore = 0
        const completedQuestions = this.questionsElements.filter(
            (i) => i.status === 'completed'
        )

        if (this.data?.scoring === 'questions') {
            completedQuestions.forEach((q) => {
                if (q.result) {
                    currentAttemptScore += Number(q.data.weight)
                }
            })
        } else if (this.data?.scoring === 'answers') {
            completedQuestions.forEach((q) => {
                currentAttemptScore += q.score
            })
        } else if (this.data?.scoring === 'userInput') {
            completedQuestions.forEach((q) => {
                currentAttemptScore += Number(q.exactUserAnswer)
            })
        }

        this.scores[this.attempt] = AuxFunctions.roundAccurately(
            currentAttemptScore,
            2
        )
    }

    get processedScores() {
        if (this.data?.scoringFunction) {
            return scoringFunctions[this.data.scoringFunction](this)
        }
        return Array.from(this.scores)
    }

    get hasFeedback() {
        const that = this

        if (this.data.showPoolsInFeedback) {
            return true
        }

        if (this.data?.feedback?.common && this.data.feedback.common !== '') {
            return true
        }

        if (
            this.result &&
            this.data?.feedback?.passed &&
            this.data.feedback.passed !== ''
        ) {
            return true
        }

        if (
            !this.result &&
            this.data?.feedback?.failed &&
            this.data.feedback.failed !== ''
        ) {
            return true
        }

        if (
            this.data?.feedback?.byScore &&
            this.data.feedback.byScore.length > 0
        ) {
            return true
        }

        if (
            this.data?.feedback?.byAttempt &&
            this.data.feedback.byAttempt.length > 0 &&
            this.data.feedback.byAttempt.filter((i) => {
                if (
                    i.attempt === 'passingAttempt' &&
                    that.passingAttempt === that.attempt + 1
                ) {
                    return true
                }

                if (Number(i.attempt) === that.attempt + 1) {
                    return true
                }

                return false
            }).length > 0
        ) {
            return true
        }

        return false
    }

    get score() {
        return this.scores[this.scores.length - 1]
    }

    get processedScore() {
        return this.processedScores[this.processedScores.length - 1]
    }

    get passed() {
        if (this.score >= this.passingScore) {
            return true
        }
        if (this.score < this.passingScore) {
            return false
        }
    }

    get sendStmtMessage() {
        if (this.data?.statements?.send) {
            return AuxFunctions.clearFromTags(
                AuxFunctions.parseText(this.data.statements.send.message, this)
            )
        }

        return null
    }

    get passingAttempt() {
        if (this.data.requiredState.startsWith('attempt')) {
            const passingAttempt = Number(this.data.requiredState.split(':')[1])
            return passingAttempt
        }

        return undefined
    }

    get result() {
        if (this.data.requiredState.startsWith('attempt')) {
            if (this.passed) {
                return true
            }
            const requiredAttempt =
                Number(this.data.requiredState.split(':')[1]) - 1
            if (this.attempt >= requiredAttempt) {
                return true
            }
            return false
        }

        if (this.data.requiredState === 'passed') {
            if (this.passed) {
                return true
            }
            return false
        }

        if (this.data.requiredState === 'completed') {
            if (this.completed) {
                return true
            }
            return false
        }

        if (this.data.requiredState === 'none') {
            return true
        }
    }

    get maxPossibleScore() {
        if (this.data.scoring === 'questions') {
            return this.questionsToTake.reduce(
                (sum, item) => (sum += Number(item.weight)),
                0
            )
        }
        if (this.data.scoring === 'answers') {
            let sum = 0
            this.questionsToTake.forEach((q) => {
                if (q.type === 'mc' || q.type === 'fill-in') {
                    sum += Math.max(...q.answers.map((a) => Number(a.weight)))
                } else if (q.type === 'mr') {
                    q.answers.forEach((a) => {
                        sum += Number(a.weight)
                    })
                } else if (q.type === 'range') {
                    sum += Number(q.range[1])
                }
            })

            return sum
        }
    }

    get weight() {
        return this.data.weight
    }

    completeTest() {
        this.setScore()
        this.completed = true
        this.status = 'completed'
        this.setState('test completed')
        this.questionsElements.forEach((element) =>
            element.setState('test completed')
        )

        this.showFeedback()
        console.log(
            `%cTest "${this.data.id}" completed: ${this.completed}`,
            'color:green;font-weight:bold;font-size:16px;'
        )

        if (this.result) {
            this.emitEvent('completed')
            this.emitEvent('passed')
        } else {
            this.emitEvent('completed')
            this.emitEvent('failed')
        }

        console.log(
            `%cTest "${this.data.id}" status: ${this.status}`,
            'color:green;font-weight:bold;font-size:16px;'
        )
    }

    setListeners() {
        const that = this
        this.addEventListener('continue', (e) => {
            console.log('continue event has been caught')
            if (this.data.displayMode === 'one_instead_another') {
                e.detail.obj.classList.add('off')
            }

            if (
                this.data.displayMode === 'one_by_one' ||
                this.data.displayMode === 'one_instead_another'
            ) {
                if (this.lastQuestionIndex + 1 < that.questionsToTake.length) {
                    this.createQuestion(
                        this.questionsToTake[that.lastQuestionIndex + 1].id
                    ).then((qElement) => {
                        this.lastQuestionShownId = qElement.data.id

                        this.setState('lastQuestionShownId changed')
                        /* if (that.data.displayMode === 'one_by_one') {
                            qElement.scrollIntoView();
                        } */
                        if (this.data.displayMode === 'one_instead_another') {
                            this.scrollIntoView({block: 'center'})
                        }
                    })
                }
            }

            console.log(`Attempt ${this.attempt}: ${this.attemptCompleted}`)

            if (this.attemptCompleted) {
                this.completeTest()
            }

            this.markQuestionsCorrectness()
            this.markResponsesCorrectness()
            this.showCorrectAnswers()
        })

        this.addEventListener('answered', (e) => {
            if (this.data.submitMode === 'each') {
                this.setScore()
                this.showCorrectAnswers(e.detail.obj)
                this.markResponsesCorrectness(e.detail.obj)
                this.markQuestionsCorrectness(e.detail.obj)
            }
        })

        const tryAgainBtn = this.shadowRoot.querySelector('.tryAgainBtn')
        tryAgainBtn.addEventListener('click', this.restart.bind(this))

        const submitBtn = this.shadowRoot.querySelector('.submitBtn')
        submitBtn.addEventListener('click', this.submitAll.bind(this))

        this.addEventListener('questionInProgress', this.processTest.bind(this))
    }

    get userPoolsResult() {
        const questions = this.questionsElements.filter(
            (child) => !child.className.includes('likertHeader')
        )

        return questions
            .map((q) => q.userPoolsResult)
            .reduce((accum, arr) => {
                if (arr.length > 0) {
                    arr.forEach((item) => {
                        const pool = accum.filter((i) => i.id === item.id)

                        if (pool.length === 0) {
                            accum.push({...item})
                        } else {
                            pool[0].value = pool[0].value + item.value
                        }
                    })
                }
                return accum
            }, [])
    }

    processTest() {
        if (this.status === 'initial') {
            this.status = 'inProgress'
            this.setState('test status changed to inProgress')
        }

        const submitBtn = this.shadowRoot.querySelector('.submitBtn')

        if (this.allChecked) {
            this.enableElement(submitBtn)
        } else {
            this.disableElement(submitBtn)
        }
    }

    disableElement(element) {
        element.disabled = true
        element.classList.add('inactive')
    }

    enableElement(element) {
        element.disabled = false
        element.classList.remove('inactive')
    }
}

window.customElements.define('test-unit', Test)
