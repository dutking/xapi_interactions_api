import {Statement} from '../statement.js'
import {XAPI} from '../xapi.js'

export class Course {
    constructor (state) {
        this.data = config
        this.state = state
        this.placeholders = document.querySelectorAll('.placeholder')
        this.completedInteractions = new Set()
        this.currentInteractions = new Set()
        this.currentChapters = []
        this.iri = `${this.data.trackIRI}/${this.data.id}`
        this.startTime = new Date()
        this.status = 'initial'
        this.scores = []
        this.pools = config?.pools?.items ? config.pools.items : []
        this.metricsData = []
    }

    init() {
        if (this.resumed) this.restoreFromState()
        this.setInteractions().then(() => this.setObservers)
    }

    async setInteractions() {
        const statesResults = await Promise.allSettled(
            config.interactions.map((interaction, index) =>
                XAPI.getState(`${App.course.iri}/${interaction.id}`)
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
    }

    setState(msg) {
        this.state.date = new Date()
        this.state.startTime = this.startTime
        this.state.completed = this.completed
        this.state.status = this.status
        this.state.scores = this.scores
        this.state.passed = this.passed
        this.state.pools = this.pools
        this.state.duration = this.duration

        console.log(`Course state changed due to: ${msg}`)

        // TO DO: change state form within app when state of interactions changes
    }

    async finishCourse() {
        const statements = []
        if(this.completed) {
            console.log(
                '%cCOURSE COMPLETED',
                'color:green;font-size:18px;font-weight:bold;'
            )
            statements.push(
                XAPI.sendStatement(
                    new Statement(App.course, 'completed').statement
                )
            )

            if (this.passed) {
                console.log(
                    '%cCOURSE PASSED',
                    'color:green;font-size:18px;font-weight:bold;'
                )
                statements.push(
                    XAPI.sendStatement(
                        new Statement(App.course, 'passed').statement
                    )
                )
            } else {
                console.log(
                    '%cCOURSE FAILED',
                    'color:red;font-size:18px;font-weight:bold;'
                )
                statements.push(
                    XAPI.sendStatement(
                        new Statement(App.course, 'failed').statement
                    )
                )
            }
        } else {
            console.log(
                '%cCOURSE INCOMPLETE',
                'color:red;font-size:18px;font-weight:bold;'
            )
        }

        try {
            let statementsSent = await Promise.all(statements)
            return statementsSent
        } catch (e) {
            console.error(`Sending final statements failed`, e)
            return Promise.reject()
        }
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