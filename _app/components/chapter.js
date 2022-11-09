export class Chapter extends HTMLElement {
    constructor() {
        super()
        this.innerHTML = ``
        this.startTime = new Date()
        this.completedTime = new Date()
        this.completed = false
        this.status = 'initial'
    }

    init(placeholder, data, state, parent) {
        this.placeholder = placeholder
        this.state = state
        this.data = data
        this.parent = parent

        if (!('isFake' in this.state)) {
            this.completed = this.state.completed
            this.status = this.state.status
        }

        this.placeholder.append(this)
    }

    setState(msg = '') {
        this.state.date = new Date()
        this.state.id = this.data.id
        this.state.completed = this.completed
        this.state.status = this.status
        this.state.duration = moment
            .duration(
                Math.round((this.state.date - this.startTime) / 1000),
                'seconds'
            )
            .toISOString()

        if ('isFake' in this.state) {
            delete this.state.isFake
        }
        console.log(
            `%c...setting chapter state due to: ${msg}`,
            'color:#4AACDA;font-weight:bold;'
        )
        console.log(this.state)
        this.emitEvent('state_changed')
    }

    get score() {
        return this.completed ? this.data.weight : 0
    }

    get iri() {
        return `${this.parent.iri}/${this.data.id}`
    }

    get passed() {
        return this.completed
    }

    get result() {
        return this.completed
    }

    get duration() {
        return moment
            .duration(
                Math.round((this.completedTime - this.startTime) / 1000),
                'seconds'
            )
            .toISOString()
    }

    setCompleted() {
        if (!this.completed) {
            this.status = 'completed'
            this.completed = true
            this.completedTime = new Date()
            this.setState(`Chapter ${this.data.id} completed`)
            this.emitEvent('completed')
            this.emitEvent('passed')
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
        console.log(`Event "${eventName}" was dispatched by ${this.data.id}`)
        this.dispatchEvent(event)
    }
}

window.customElements.define('chapter-unit', Chapter)
