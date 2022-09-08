import { AuxFunctions } from '../auxFunctions.js';
import { STATUS } from '../enums.js';
import { Pool } from './pool.js';
import { Popup } from './popup.js';

const answerTemplate = document.createElement('template');
answerTemplate.innerHTML = ``;

const elementTemplate = document.createElement('template');
elementTemplatetemplate.innerHTML = ``;

export class QuestionOriginal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.appendChild(elementTemplate.content.cloneNode(true));
        this.completed = false;
        this.score = 0;
        this.result = false;
        this.status = 'initial';
        this.state = {};
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

    get attemptsPerQuestion() {
        return this.parent.data.attemptsPerQuestion;
    }

    get passingScore() {
        return this.parent.data.passingScore;
    }

    get resume() {
        return (
            this.parent.resumed === true &&
            this.parent.data.resume.resume === true &&
            this.parent.status !== STATUS.INITIAL
        );
    }

    get iri() {
        return `${this.parent.iri}/${this.data.id}`;
    }

    /* STATEMENTS PARTS GETTERS start */
    /* 1) Засунуть все в 1 объект СТЕЙТМЕНТ или раскидать по полям - ПРЕДПОЧТИТЕЛЬНЕЕ - изучить memoization
       2) Или организовать это все в классе Statement - там сейчас каша из-за типов вопросов
    */

    get nameRus () {
        if (this.data.story !== '') {
            return AuxFunctions.clearFromTags(`${this.data.story} ${this.data.question}`);
        }
        
        return AuxFunctions.clearFromTags(this.data.question);

    }

    get description () {
        if(this.parent.data.commonQuestion !== '') {
            return AuxFunctions.clearFromTags(this.parent.data.commonQuestion)
        }
        return this.nameRus;
    }



    /* STATEMENTS PARTS GETTERS end */

    async init(data, index, parent) {
        this.state = await window.XAPI.getState(this.iri)
        this.parent = parent;
        this.data = data;
        this.index = index;
        this.data.evaluated = parent.data.evaluated;
        this.questionContainer = this.shadowRoot.querySelector(".questionContainer")

        this.getState()
        AuxFunctions.addClasses(this)
        this.setCounter()
        this.setStory()
        this.setInstruction()
        this.setQuestion()
        this.setHelp()
        this.setAnswers()
        this.setButtons()
        this.setGridTemplateAreas()
        this.emitEvent('created')
        this.setListeners()

        if (!('isFake' in this.state)) {
            if (this.resume === true) {
                this.restoreState();
            }
        }
    }

    setAnswers() {
        let answersContainer = this.shadowRoot.querySelector('.answersContainer');

        let answersData = this.data.shuffle ? AuxFunctions.shuffleArray(this.data.answers) : this.data.answers;

        answersData.map(setAnswer).forEach(answerElement => answersContainer.append(answerElement));
    }

    setAnswer(answer, index) {
        let answerElement = answerTemplate.content.cloneNode(true).querySelector('div');

        answerElement.setAttribute('data-id', answer.id);
        answerElement.querySelector('input').setAttribute('id', answer.id);
        answerElement.querySelector('input').setAttribute('name', this.data.id);
        answerElement.querySelector('label').setAttribute('for', answer.id);
        answerElement.querySelector('label span.text').innerHTML = answer.text;
        
        let feedback = answerElement.querySelector('.answerFeedback');
        feedback.dataset.id = a.id;

        if(index%2 === 1) {
            answerElement.classList.add('even')
        } else {
            answerElement.classList.add('odd')
        }

        AuxFunctions.addClasses(answerElement)
        return answerElement
    }

    setHelp() {
        if (this.data.help.length !== 0 && this.data.help[0] !== '') {
            let tipsContainer = this.shadowRoot.querySelector('.tipsContainer');
            tipsContainer.classList.remove('off');
            this.tipBtn = this.shadowRoot.querySelector('.tipBtn');
            this.tipBtn.dataset.tipnum = 1
            this.tipBtn.innerHTML = this.data.help.length === 1 ? 'Показать подсказку' : `Показать подсказку ${this.tipBtn.dataset.tipnum} из ${this.data.help.length}`;
            this.tipBtn.addEventListener('click', () => {
                let currentTip = Number(this.tipBtn.dataset.tipnum)
                if(currentTip === 1) {
                    let pp = document.createElement('popup-unit')
                    pp.init(`tips_for_${that.data.id}`, 'Подсказки', `<div class='tip'><p class='tipHeader'>Подсказка 1:</p><p>${this.data.help[currentTip-1]}</p></div>`)
                    pp.showPopup()
                } else {
                    let pp = document.querySelector(`#tips_for_${that.data.id}`)
                    let tips = this.data.help.filter((t,i) => i < currentTip).map((h,i) => `<div class='tip'><p class='tipHeader'>Подсказка ${i + 1}:</p><p>${h}</p></div>`).join('')
                    pp.updateContent('Подсказки', tips)
                    pp.showPopup()

                }
                let nextTip = currentTip + 1 > this.data.help.length ? this.data.help.length : (currentTip + 1)
                this.tipBtn.dataset.tipnum = nextTip
                this.tipBtn.innerHTML = this.data.help.length === 1 ? 'Показать подсказку' : `Показать подсказку ${this.tipBtn.dataset.tipnum} из ${this.data.help.length}`;
            })
        }
    }

    setQuestion() {
        this.shadowRoot.querySelector('.questionText').innerHTML =
            this.data.question;
    }

    setInstruction() {
        if(this.data.instruction !== ' ') {
            this.shadowRoot.querySelector('.instruction').innerHTML =
            AuxFunctions.parseText(this.data.instruction, this);
            return
        } 
        
        this.shadowRoot.querySelector('.instruction').classList.add('off')
    }

    setStory() {
        if (this.data.story.length > 0) {
            let story = this.shadowRoot.querySelector('.story');
            story.innerHTML = this.data.story;
            story.classList.remove('off');
        }
    }

    setCounter() {
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

                submitBtn.classList.add('off');
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

    setState(msg = '') {
        console.log(
            `%c...setting question ${this.data.id} state due to: ${msg}`,
            'color:lightblue;font-weight:bold;'
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
        if ('userAnswer' in this.state) {
            let inputs = Array.from(this.shadowRoot.querySelectorAll('input'));

            inputs.forEach((i) => {
                let currentAnswer = this.state.userAnswer.filter(
                    (a) => a[0] === i.id
                )[0];
                if (currentAnswer[1] === true) {
                    i.checked = true;
                }
            });

            if (this.checked) {
                let submitBtn = this.shadowRoot.querySelector('.submitBtn');
                submitBtn.disabled = false;
            }
        }
    }

    get checked() {
        let inputs = Array.from(this.shadowRoot.querySelectorAll('input'));
        let checkedItems = inputs.filter((input) => input.checked).length;

        if (checkedItems === 1) {
            return true;
        }
        return false;
    }

    setListeners() {
        this.setInputListener()
        this.setSubmitBtnListener()
        this.setContinueBtnListener()
    }

    setInputListener(){
        let inputs = Array.from(this.shadowRoot.querySelectorAll('input'));
        inputs.forEach((i) => {
            i.addEventListener('change', (e) => {
                if (this.checked) {
                    submitBtn.disabled = false;
                    if (this.status === 'initial') {
                        this.status = 'inProgress';
                    }
                } else {
                    submitBtn.disabled = true;
                }
                this.emitEvent('questionInProgress');
                this.setState('user input');
            });
        });
    }

    setContinueBtnListener() {
        let continueBtn = this.shadowRoot.querySelector('.continueBtn');
        continueBtn.addEventListener('click', (e) => {
            this.emitEvent('continue');
            if (this.displayMode === 'one_by_one') {
                e.target.classList.add('off');
            }
        });
    }

    setSubmitBtnListener() {
        let submitBtn = this.shadowRoot.querySelector('.submitBtn');
        submitBtn.addEventListener('click', this.checkAnswer.bind(this));
    }

    get userAnswer() {
        let that = this;
        let inputs = Array.from(that.shadowRoot.querySelectorAll('input'));
        return inputs.map((i) => {
            return [i.id, i.checked];
        });
    }

    checkAnswer() {

        this.status = 'completed';

        if (this.parent.data?.buttons?.submit?.completed) {
            this.shadowRoot.querySelector('.submitBtn').innerHTML =
                this.parent.data.buttons.submit.completed;
        }

        this.userAnswer
            .filter((a) => a[1] === true)
            .forEach((a) => {
                let answer = this.data.answers.filter(
                    (ans) => ans.id === a[0]
                )[0];

                this.score = this.score + Number(answer.weight);
            });

        let correctAnswers = this.data.answers
            .filter((a) => a.correct === true)
            .map((a) => a.id);

        let userChecked = this.userAnswer
            .filter((a) => a[1] === true)
            .map((a) => a[0])[0];

        if (correctAnswers.includes(userChecked)) {
            this.result = true;
        } else {
            this.result = false;
        }

        this.emitEvent('answered');
        console.log(
            `Question ${this.data.id} answered. Result: ${this.result}`
        );

        this.disableElements();
        this.showFeedback();

        if ('isFake' in this.state) {
            delete this.state.isFake;
        }
        this.setState('question completed');
    }

    get exactUserAnswer() {
        let that = this;
        let exactUserAnswer = [];

        this.userAnswer
            .filter((a) => a[1] === true)
            .forEach((a) => {
                let answer = this.data.answers.filter(
                    (ans) => ans.id === a[0]
                )[0];

                exactUserAnswer.push(AuxFunctions.clearFromTags(answer.text));
            });

        return exactUserAnswer.map((a, ind) => `${ind + 1}) ${a}`).join('   ');
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
            this.parent.data.fedback.answersFeedbackMode === 'question'
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
        feedback.scrollIntoView(); // нужно ли тут скролить к нему?

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

window.customElements.define('question-mc', QuestionMC);
