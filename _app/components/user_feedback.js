import {AuxFunctions} from '../auxFunctions.js'

const userFeedbackTemplate = document.createElement('template')

userFeedbackTemplate.innerHTML = `
<style>

</style>

    <dialog class="userFeedbackContainer">
        <div class="content">
        </div>
        
        <button class="closeBtn" type="button"></button>
    </dialog>
`

export class Userfeedback extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({mode: 'open'})

        this.shadowRoot.appendChild(
            userFeedbackTemplate.content.cloneNode(true)
        )
        this.dialog = this.shadowRoot.querySelector('dialog')
    }

    init(objectId, rating, comment) {
        this.objectId = objectId
        this.rating = rating
        this.comment = comment
        this.setContent()
        this.setListeners()
        this.append()
    }

    append() {
        document.querySelector('body').append(this)
    }

    updateContent(header, content) {
        this.header = header
        this.content = content
        this.setContent()
    }

    setContent() {
        let headerElement = this.shadowRoot.querySelector('.header')
        let contentElement = this.shadowRoot.querySelector('.content')

        if (this.header) {
            headerElement.innerHTML = AuxFunctions.parseText(this.header)
        }

        contentElement.innerHTML = AuxFunctions.parseText(this.content)
    }

    setListeners() {
        let closeBtn = this.shadowRoot.querySelector('.closeBtn')
        closeBtn.addEventListener('click', this.closePopup.bind(this))

        let shade = this.shadowRoot.querySelector('.shade')
        shade.addEventListener('click', this.closePopup.bind(this))
    }

    showPopup() {
        document.querySelector('body').style.overflow = 'hidden'
        this.shadowRoot
            .querySelector('.popupContainer')
            .classList.remove('hidden')
    }

    closePopup() {
        document.querySelector('body').style.overflow = 'auto'
        this.shadowRoot.querySelector('.popupContainer').classList.add('hidden')
    }
}

window.customElements.define('userfeedback-unit', Userfeedback)
