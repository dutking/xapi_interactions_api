import { App } from '../app.js'
import {Statement} from '../statement.js'
import {XAPI} from '../xapi.js'
import {STATUSES, SUPPORTED_VERBS, INTERACTION_TYPES, EVENTS} from '../enums.js'

export class Course {
    #status
    constructor (state) {
        this.data = config
        this.state = state
        this.placeholders = document.querySelectorAll('.placeholder')
        this.completedInteractions = new Set()
        this.currentInteractions = new Set()
        this.currentChapters = [] // to have access to order to check completion
        this.iri = `${this.data.trackIRI}/${this.data.id}`
        this.startTime = new Date()
        this.#status = STATUSES.INITIAL
        this.scores = []
        this.pools = config?.pools?.items ? config.pools.items : []
        this.metricsData = []
        this.attempt = 0
    }

    init() {
        if (this.resumed) this.restoreFromState()
        this.setInteractions()
        .then(() => this.setObservers)
    }

    get status() {
        return this.#status
    }

    set status(value) {
        switch(value){
            case STATUSES.IN_PROGRESS: {
                if (this.status === STATUSES.INITIAL) this.#status === value
            }
            break;
            case STATUS.COMPLETED: {
                if (this.status === STATUSES.IN_PROGRESS) this.#status === value
            }
            break;
            default:
                break;
        }
    }

    proceed(event, emitter) {
        // activated by interactions by their state changes to check new course state/status 
        // events
        // 1. any interaction state changed to IN_PROGRESS (only once) - if course status is INITIAL
        // 2. any interaction state changed to COMPLETED (affects score)
        // 3. pools change

        this.setState()

        switch(event){
            case EVENTS.COMPLETED: {
                if (this.completed) {
                    this.status = STATUSES.COMPLETED
                }
            }
            break;
            case EVENTS.STATE_CHANGED: {
                this.setState()
            }
            break;
        }

    }

    async setInteractions() {
        const statesResults = await Promise.allSettled(
            config.interactions.map((interaction) =>
                XAPI.getState(`${window.Course.iri}/${interaction.id}`)
            )
        )

        const states = statesResults.map((result) => result.value)

        states.forEach((state, index) => {
            const interaction = config.interactions[index]

            console.group(`State for ${state.id} recieved: ${state.stateExists}`)
            console.log(state)
            console.groupEnd()

            let interactionElement = document.createElement(`${interaction.type}-unit`)

            interactionElement.init(
                this.placeholders[index],
                interaction,
                state,
                this
            )

            this.currentInteractions.add(interactionElement) 
        })

        return Promise.resolve()
    }

    setObservers() {
        [...this.currentInteractions].forEach(interaction => {
            switch(interaction.type) {
                case 'chapter': {
                    App.currentChapters.push(interaction)
                    App.observerChapter.observe(interaction)
                }
                break;
                case 'longread': {
                    App.observerLongread.observe(interaction)
                }
                break;
                default: {
                    App.observer.observe(interaction)
                }
                break;
            }
        })
    }

    restoreFromState() {
        this.status = this.state.status
        this.scores = this.state.scores
        this.pools = this.state.pools
        this.attempt = this.state.attempt
    }

    async setState(msg) {
        const newState = {}
        newState.date = new Date() 
        newState.startTime = this.startTime // if we need to restore it for an attempt - methodological
        newState.status = this.status
        newState.scores = this.scores
        newState.pools = this.pools
        newState.duration = this.duration // if we need to restore it for an attempt - methodological 
        newState.attempt = this.attempt

        try {
            console.log(`Course state changed due to: ${msg}`)
            return await XAPI.postState(this.iri, newState)
        } catch (e) {
            console.error(e)
            return Promise.reject(e)
        }
    }

    calculateMetrics() {
        if(this.data?.metrics?.lengh > 0){
            return Promise.all(this.data.metrics.map(metric => App.handleMetric(metric)))
        }
    }

    finishCourse(){
        this.scores.at(this.attempt) = this.currentScore
        this.logCourseStatus()
        if(this.status = STATUSES.COMPLETED){
            this.attempt++
        }
        this.setState()
        .then(() => this.sendCompletionStatements())
        .then(() => this.sendExitStatments())
        .then(() => this.navigateTo('/back/', 3000))
        .catch((e) => console.log(e))
    }

    async sendExitStatments() {
        try{
        return await Promise.all([...this.currentInteractions, this].map(item => XAPI.sendStatement(new Statement(item, 'exited').statement)))
        } catch (e) {
            console.error(e)
            return Promise.reject(e)
        }
    }

    async sendCompletionStatements() {
        const statements = []
        if(this.completed) {
            statements.push(
                XAPI.sendStatement(
                    new Statement(window.Course, 'completed').statement
                )
            )

            if (this.passed) {
                statements.push(
                    XAPI.sendStatement(
                        new Statement(window.Course, 'passed').statement
                    )
                )
            } else {
                statements.push(
                    XAPI.sendStatement(
                        new Statement(window.Course, 'failed').statement
                    )
                )
            }
        }

        try {
            return await Promise.all(statements)
        } catch (e) {
            console.error(`Sending final statements failed`, e)
            return Promise.reject(e)
        }
    }

    static navigateTo(location, timeout) {
        console.log(
            `%cNavigating to ${location} in ${timeout}ms`,
            'color:lightblue; font-weight: bold; font-size: 18px;'
        )
        setTimeout(() => {
            ;(function () {
                if (window.top) {
                    return window.top
                }
                return window.parent
            })().location = location
            return false
        }, timeout)
    }

    logCourseStatus(){
        console.group('%cCOURSE STATUS:', 'font-size:18px;font-weight:bold;')
        if (this.completed) {
            console.log('%ccompleted', 'font-size:16px;font-weight:bold;color:green;')
            this.passed ? console.log('%cpassed', 'font-size:16px;font-weight:bold;color:green;') : console.log('%cfailed', 'font-size:16px;font-weight:bold;color:red;')
            console.log(`with score ${this.lastScore} out of ${this.maxPossibleScore}`)
        } else {
            console.log('%cincomplete', 'font-size:16px;font-weight:bold;color:red;')
        }
        console.groupEnd()
    }

    get completedIntractions () {
        return [...this.currentInteractions].filter(i => i.completed)
    }

    get requiredIntractions () {
        return [...this.currentInteractions].filter(i => i.data.required !== 'none')
    }

    get completed() {
        return this.requiredIntractions.every(i => i.completed)
    }

    get passed() {
        return this.currentScore >= this.passingScore
    }

    get duration() {
        moment
            .duration(
                Math.round(
                    (new Date() - this.startTime) / 1000
                ),
                'seconds'
            )
            .toISOString()
    }

    get currentScore () {
        return [...this.completedInteractions].reduce((accum, item) => {
            if(item.data.requiredState === 'none') return accum

            return accum += Number(item.data.weight)
        }, 0)
    }

    get maxRequiredScore () {
        return [...this.currentInteractions].reduce((accum, item) => {
            if(item.data.requiredState === 'none') return accum

            return accum += Number(item.data.weight)
        }, 0)
    }

    get maxPossibleScore(){
        return [...this.currentInteractions].reduce((accum, item) => {
            return accum += Number(item.data.weight)
        }, 0)
    }

    get passingScore(){
        if (this.data.passingScore === 'max') {
            return this.maxRequiredScore
        } 
        
        return Number(this.data.passingScore)
    }

    get lastScore () {
        return this.scores.at(-1)
    }
    
    get resumed() {
        return this.state.stateExists && this.data.resume === true
    }
    
}