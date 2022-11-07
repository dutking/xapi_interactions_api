export class Chapter extends HTMLElement {
    constructor() {
        super()
        this.innerHTML = ``
        this.startTime = new Date()
        this.completedTime = new Date()
        this.score = 0
        this.completed = false
        this.order = this.dataset.order
        this.status = 'initial'
    }

    init(placeholder, data, state, parent) {
        this.placeholder = placeholder
        this.state = state
        this.data = data
        this.parent = parent
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
            this.score = this.data.weight
            this.completedTime = new Date()
            this.emitEvent('completed')
            this.emitEvent('passed')
            this.setState(`Chapter ${this.data.id} completed`)
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
