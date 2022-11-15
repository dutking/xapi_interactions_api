export class Course {
    constructor (state) {
        this.state = state
        this.placeholders = document.querySelectorAll('.placeholder')
        this.completedInteractions = new Set()
        this.currentInteractions = new Set()
        this.currentChapters = []
        this.iri = `${config.trackIRI}/${config.id}`
    }

    
}