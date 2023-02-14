import {Statement} from '../statement.js'
import {XAPI} from '../xapi.js'
import {STATUSES, VERBS, EVENTS, DISPLAY_MODES, ANSWERS_FEEDBACK_MODES} from '../enums.js'
import {AuxFunctions} from '../auxFunctions.js'
import {Pool} from './pool.js'

// TODO: move questionTemplate to a separate file


export class Question extends HTMLElement {
    constructor() {
        super()
        this.status = STATUSES.INITIAL
        this.state = {}
    }

    // ! unique for components
    // return HTML Template Element
    get answerTemplate(){
        
    }

    init(data, index, parent, state) {
        this.data = data
        this.index = index
        this.parent = parent
        this.state = state
        this.setContent()
        this.setListeners()
    }

    // setting DOM
    setContent(){
        this.setSubHeader()
        this.setStory()
        this.setInstruction()
        this.setQuestionText()
        this.setTips()
        this.setAnswersOptions()
        this.setButtonsContent()
    }

    setSubHeader() {
        if (this.parent.data?.counter) {
            let subHeader = this.shadowRoot.querySelector('.subHeader')
            let counter = this.shadowRoot.querySelector('.counter')
            counter.innerHTML = AuxFunctions.parseText(
                parent.data.counter,
                this
            )
            counter.classList.remove('off')
            subHeader.classList.remove('off')
        }
    }

    setStory() {
        if (this.data.story) {
            let story = this.shadowRoot.querySelector('.story')
            story.innerHTML = AuxFunctions.parseText(this.data.story, this)
            story.classList.remove('off')
        }
    }

    setInstruction() {
        const instructionElement = this.shadowRoot.querySelector('.instruction')

        if (this.data.instruction === ' ') {
            instructionElement.classList.add('off')
            return
        }

        instructionElement.innerHTML = AuxFunctions.parseText(this.data.instruction, this)
    }

    setQuestionText() {
        this.shadowRoot.querySelector('.questionText').innerHTML =
            this.data.question
    }

    setTips() {
        if (this.data.tips) {
            const tipsContainer = this.shadowRoot.querySelector('.tipsContainer')
            tipsContainer.classList.remove('off')

            this.tipBtn = this.shadowRoot.querySelector('.tipBtn')
            this.tipBtn.dataset.tipnum = 1
            this.tipBtn.innerHTML =
                this.data.tips.length === 1
                    ? 'Показать подсказку'
                    : `Показать подсказку ${this.tipBtn.dataset.tipnum} из ${this.data.tips.length}`
        }
    }

    get answers() {
        if (this.data.shuffle) return AuxFunctions.shuffleArray(this.data.answers)
        return this.data.answers
    }

    // ! unique for components
    setAnswerContent(answer, index){
        const answersContainerElement = this.shadowRoot.querySelector('.answersContainer')
        const answerElement = Array.from(answersContainerElement.children).at(index)
        answerElement.setAttribute('data-id', answer.id)
        answerElement.querySelector('input').setAttribute('id', answer.id)
        answerElement.querySelector('input').setAttribute('name', this.data.id)
        answerElement.querySelector('label').setAttribute('for', answer.id)
        answerElement.querySelector('label span.text').innerHTML = answer.text
    }

    setAnswersOptions(){
        const answersContainerElement = this.shadowRoot.querySelector('.answersContainer')
        this.answers.forEach((answer, index) => {
            let answerElement = this.answerTemplate.content.cloneNode(true)
            console.log(answerElement)
            answersContainerElement.append(answerElement)
            console.log(answersContainerElement)
            answerElement = Array.from(answersContainerElement.children).at(index)
            this.setAnswerContent(answer, index)
            const answerFeedbackElement = answerElement.querySelector('.answerFeedback')
            answerFeedbackElement.dataset.id = answer.id
        }, this)
    }

    setButtonsContent(){
        Object.keys(this.parent.data.buttons).forEach((button) => {
            const btn = this.shadowRoot.querySelector(`.${button}Btn`)
            if (btn) {
                btn.innerHTML = this.parent.data.buttons[button].initial
                if (this.parent.data.buttons[button].icon === true) {
                    btn.classList.add('icon')
                }
            }
        })

        if (this.index + 1 === this.amountOfQuestions) {
            this.continueBtn.classList.add('continueLastBtn')
            this.continueBtn.innerHTML = this.parent.data.buttons.continue.last
        }

        if (this.status === 'completed' && this.displayMode === 'one_by_one') {
            this.continueBtn.classList.add('off')
        }

        if (this.submitMode === 'all_at_once') {
            this.shadowRoot
                .querySelector('.buttonsContainer')
                .classList.add('off')
        }
    }

    // set listeners
    setListeners(){
        this.setButtonsListeners()
        this.setInputsListeners()
    }

    get iri() {
        return `${this.parent.iri}/${this.data.id}`
    }

    get completed() {
        return this.status === STATUSES.COMPLETED
    }

    // Provide an answer id and if answer was checked
    // ! unique for components
    // return [{id: String, filled: Boolean}]
    get userResponse(){ // * former userAnswer
        return 
    }

    // A String combining texts of all given responses
    // return String
    get exactUserResponse(){
        return
    }

    // TODO: Add isOpenQuestion field to DB for fill-in/range questions
    get isOpenQuestion(){ 
        this.data.answers.length === 0 || 
        (this.data.answers.length === 1 && this.data.answers[0].text === '') // * to handle current db for fill-in and long-fill-in questions
    }

    // To check if any answer is checked/inputed
    // ! unique for components
    // return Boolean
    get responseIsGiven(){
        return
    }

    // Check if question is correctly answered
    // ! unique for components
    // return Boolean || undefined
    get result() {
        return
    }

    get score() {
        if(this.status === STATUSES.COMPLETED){
            if (this.isOpenQuestion) return 1

            return this.userResponse
            .filter((response) => response.filled === true)
            .map((response) => {
                return Number(this.data.answers.filter(
                    (ans) => ans.id === response.id
                )[0].weight)
            })
            .reduce((accum, weight) => accum + weight, 0)
        }
        
        return undefined
    }

    get scoreByPools() {
        return this.userResponse
            .filter((response) => response.filled === true)
            .map(
                (response) =>
                    this.data.answers.filter((ans) => ans.id === response.id)[0].pools
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
    }

    // TODO: unify button changing 
    updateSubmitBtnText(){
        if (this.parent.data.buttons?.submit?.completed) {
            this.shadowRoot.querySelector('.submitBtn').innerHTML =
                this.parent.data.buttons.submit.completed
        }
    }

    submitResponse(){
        this.status = STATUSES.COMPLETED
        this.updateSubmitBtnText()
        this.disableElements()
        this.showFeedback()

        if (this.displayMode === DISPLAY_MODES.ONE_INSTEAD_ANOTHER) {
            const continueBtn = this.shadowRoot.querySelector('.continueBtn')
            continueBtn.classList.remove('off')
        }

        console.log(`Question ${this.data.id} answered. Result: ${this.result}`)
    }

    // restores from state
    restoreQuestionState(){
        this.status = this.state.status
        if (this.status === STATUSES.IN_PROGRESS) {
            this.restoreAnswers()
        } else if (this.status ===STATUSES.COMPLETED) {
            this.restoreAnswers()
            this.disableElements()
            this.showFeedback()
        }
    }

    // ! unique for components
    restoreAnswersState(){

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
            this.parent.status !== STATUSES.INITIAL
        )
    }

    get hasFeedback() {
        if (this.data.showPoolsInFeedback || this.data.feedback?.correct || this.data.feedback?.incorrect) return true
        
        return false
    }

    get hasPools() {
        return this.data.answers.filter((a) => a.pools.length > 0).length > 0
    }

    async setState(msg = '') {
        const newState = {}
        // TODO: define really applicable fields
        newState.date = new Date()
        newState.status = this.status
        newState.result = this.result
        newState.userResponse = this.userResponse
        newState.exactUserAnswer = this.exactUserAnswer
        newState.userPoolsResult = this.userPoolsResult
        newState.score = this.score

        try {
            console.log(`Question ${this.data.id} state changed due to: ${msg}`)
            return await XAPI.postState(this.iri, newState)
        } catch (e) {
            console.error(e)
            return Promise.reject(e)
        }
    }

    // To apply correct/incorrect styling to question
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

    // Mark USER-SELECTED answers as correct/incorrect
    // ! unique for components
    markResponsesCorrectness() {
        
    }

    // Mark ALL answers as correct/incorrect
    // ! unique for components
    showCorrectAnswers() {

    }

    answerHasFeedback(answer){
        return answer?.feedback?.length > 0
    }

    showAnswerFeedback(answerObject) {
        if(this.answerHasFeedback(answerObject)){
            switch(this.parent.data.feedback.answersFeedbackMode) {
                case ANSWERS_FEEDBACK_MODES.BELOW_ANSWER: {
                    const answerFeedbackElement = this.shadowRoot.querySelector(`.answerContainer[data-id=${answerObject.id}] .answerFeedback`)
                    answerFeedbackElement.innerHTML = AuxFunctions.parseText(answerObject.feedback)
                    answerFeedbackElement.classList.remove('off')
                }
                break;
                case ANSWERS_FEEDBACK_MODES.POPUP: {
                    // TODO: after updating popup
                }
            }
        }
    }

    createElement(tag, text) {
        const element = document.createElement(tag)
        element.innerHTML = AuxFunctions.parseText(text, this)
        return element
    }

    showQuestionFeedback() {
        if(this.hasFeedback) {
            const questionFeedbackElement = this.shadowRoot.querySelector('.questionFeedback')

            questionFeedbackElement.append(this.createElement('div', this.result ? this.data.feedback.correct : this.data.feedback.incorrect))
        }
    }

    showFeedback() {
        const answerObjects = this.userResponse.filter((response) => response.filled === true)
        answerObjects.forEach(answerObject => this.showAnswerFeedback(answerObject))

        this.showQuestionFeedback()
    }

    get submitBtn() {
        return this.shadowRoot.querySelector('.submitBtn')
    }

    get continueBtn() {
        return this.shadowRoot.querySelector('.continueBtn')
    }

    get tipBtn() {
        return this.shadowRoot.querySelector('.tipBtn')
    }

    setButtonsListeners(){
        this.submitBtn.addEventListener('click', this.proceed.bind(this, EVENTS.ANSWERED))

        if((this.displayMode === DISPLAY_MODES.ONE_BY_ONE || this.displayMode === DISPLAY_MODES.ONE_INSTEAD_ANOTHER) && this.hasFeedback) {
            this.continueBtn.addEventListener('click', this.proceed.bind(this, EVENTS.CONTINUE))
        }

        this.tipBtn.addEventListener('click', () => {
            const currentTip = Number(this.tipBtn.dataset.tipnum)
            if (currentTip === 1) {
                const pp = document.createElement('popup-unit')
                pp.init(
                    `tips_for_${this.data.id}`,
                    'Подсказки',
                    `<div class='tip'><p class='tipHeader'>Подсказка 1:</p><p>${
                        this.data.tips[currentTip - 1]
                    }</p></div>`
                )
                pp.showPopup()
            } else {
                const pp = document.querySelector(`#tips_for_${this.data.id}`)
                const tips = this.data.tips
                    .filter((_, index) => index < currentTip)
                    .map(
                        (tip, index) =>
                            `<div class='tip'><p class='tipHeader'>Подсказка ${
                                index + 1
                            }:</p><p>${tip}</p></div>`
                    )
                    .join('')
                pp.updateContent('Подсказки', tips)
                pp.showPopup()
            }
            const nextTip =
                currentTip + 1 > this.data.tips.length
                    ? this.data.tips.length
                    : currentTip + 1
            this.tipBtn.dataset.tipnum = nextTip
            this.tipBtn.innerHTML =
                this.data.tips.length === 1
                    ? 'Показать подсказку'
                    : `Показать подсказку ${this.tipBtn.dataset.tipnum} из ${this.data.tips.length}`
        })
    }

    get inputs(){
        return [...this.shadowRoot.querySelectorAll('input'), ...this.shadowRoot.querySelectorAll('textarea')]
    }

    setInputsListeners(){
        this.inputs.forEach((input) => input.addEventListener('input', this.proceed.bind(this, EVENTS.PROCEEDED)))
    }

    disableElements() {
        this.inputs.forEach((input) => (input.disabled = true))

        const labels = Array.from(this.shadowRoot.querySelectorAll('label'))
        if (labels) labels.forEach((l) => l.classList.add('inactive'))

        this.submitBtn.disabled = true
        if (this.parent.data?.buttons?.submit?.completed) {
            this.submitBtn.innerHTML = this.parent.data.buttons.submit.completed
        }
    }

    // TODO: handle all these events in test.js
    proceed(event) {
        switch(event) {
            case EVENTS.ANSWERED: {
                this.submitResponse()
                this.setState(`completion`)
                .then(() => XAPI.sendStatement(new Statement(this, VERBS.ANSWERED)))
                .then(() => this.parent.proceed(event, this))
            }
            break;
            case EVENTS.CONTINUE: {
                if (this.displayMode === DISPLAY_MODES.ONE_BY_ONE) {
                    this.continueBtn.classList.add('off')
                }
                this.parent.proceed(event, this)
            }
            break;
            case EVENTS.PROCEEDED: {
                console.log('proceeded')
                if (this.responseIsGiven) {
                    this.submitBtn.disabled = false
                    if (this.status === STATUSES.INITIAL) this.status = STATUSES.IN_PROGRESS
                } else {
                    this.submitBtn.disabled = true
                }
                
                this.setState('question proceeded').then(() => this.parent.proceed(event, this))
            }
            default:
                break;
        }
    }

    // for debug
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
}
