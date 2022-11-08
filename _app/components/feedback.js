import {AuxFunctions} from '../auxFunctions.js'

const commentItemTemplate = document.createElement('template')
commentItemTemplate.innerHTML = `
    <style>
        textarea.comment {
            width: 100%;
        }

        textarea.comment:disabled {
            pointer-events: none;
        }
    </style>
    <textarea class="comment" placeholder="Введите Ваш отзыв">
    </textarea>
`

const ratingItemTemplate = document.createElement('template')
ratingItemTemplate.innerHTML = `
    <style>
        .ratingItem input {
            display: none;
        }

        .ratingItem input + label {
            box-sizing: border-box;
            width: var(--ratingItem-width, 100px);
            height: var(--ratingItem-height, 100px);
            background: var(--ratingItem-background, #eee);;
            -webkit-mask-image: url(_app/img/feedbackClippingMask.svg);
            -webkit-mask-size: 100% 100%;
            -webkit-mask-repeat: no-repeat;
            mask-image: url(_app/img/feedbackClippingMask.svg);
            mask-size: 100% 100%;
            mask-repeat: no-repeat;
            cursor: pointer;
        }

        .ratingItem input + label:hover {
            background: var(--ratingItem-background, #ccc);
        }

        .ratingItem input:checked + label {
            background: var(--ratingItem-background-checked, yellow);
        }

        .ratingItem input:disabled + label {
            pointer-events: none;
        }
    </style>

    <div class="ratingItem">
        <input type="checkbox" id="inp" data-value=""/>
        <label for="inp"></label>
    </div>
`

const feedbackTemplate = document.createElement('template')
feedbackTemplate.innerHTML = `
    <style>
        .feedbackContainer {
            box-sizing: border-box;
            width: var(--feedback-width, 30vw);
            padding: var(--feedback-padding, 2rem);
            display: flex;
            flex-direction: column;
            gap: var(--feedback-gap, 2rem);
        }

        .ratingContainer {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: var(--ratingContainer-justify-content, center);
            align-items: var(--ratingContainer-align-items, center);
            gap: var(--ratingContainer-gap, 1rem);
        }

        .commentContainer {
            width: 100%;
        }

        .off {
            display: none;
        }
    </style>

    <dialog class="feedbackContainer">
        <div class="content">
            <div class="ratingContainer off"></div>
            <div class="commentContainer off"></div>
        </div>
        <button class="submitBtn" type="button">Отправить</button>
        <button class="closeBtn" type="button">&#x2715</button>
    </dialog>
`

export class Feedback extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({mode: 'open'})

        this.shadowRoot.appendChild(feedbackTemplate.content.cloneNode(true))
        this.data.id = 'feedbackForm'
        this.dialog = this.shadowRoot.querySelector('dialog')
        this.content = this.dialog.querySelector('.content')
        this.ratingContainer = this.content.querySelector('.ratingContainer')
        this.commentContainer = this.content.querySelector('.contentContainer')
        this.currentRating = 0
        this.comment = ''
    }

    init(evaluatedObjectID, amountOfRatingItems, hasCommentField) {
        this.evaluatedObjectID = evaluatedObjectID // string
        this.amountOfRatingItems = amountOfRatingItems // number
        this.hasCommentField = hasCommentField // bool
    }

    clearContent() {
        this.currentRating = 0
        this.comment = ''
        this.ratingContainer.innerHTML = ''
        this.commentContainer.innerHTML = ''
    }

    setRating() {
        this.ratingContainer.classList.remove('off')

        for (let i = 0; i < this.amountOfRatingItems; i++) {
            let item = ratingItemTemplate.content.cloneNode(true)
            ratingContainer.append(item)
            let input = item.querySelector('input')
            input.setAttribute('id', `inp_${i}`)
            input.dataset.value = i + 1

            item.querySelector('label').setAttribute('for', `inp_${i}`)
        }
    }

    setComment(placeholderText) {
        this.commentContainer.classList.remove('off')
        this.commentContainer
            .querySelector('textarea')
            .setAttribute('placeholder', placeholderText)
    }

    setContent() {
        if (this.amountOfRatingItems) this.setRating
        if (this.hasCommentField) this.setComment
    }

    setListeners() {
        let closeBtn = this.shadowRoot.querySelector('.closeBtn')
        let submitBtn = this.shadowRoot.querySelector('.submitBtn')
        let inputs = Array.from(this.ratingContainer.querySelectorAll('input'))

        closeBtn.addEventListener('click', () => {
            this.dialog.close()
        })

        submitBtn.addEventListener('click', (e) => {
            this.emitEvent('feedbackSubmitted')
            e.target.innerHTML = 'Отправлено'
            e.target.disabled = true
            inputs.forEach((input) => (input.disabled = true))
        })

        inputs.forEach((input, index) => {
            input.addEventListener('click', () => {
                this.currentRating = input.dataset.value
                inputs.forEach((i, ind) => {
                    i.checked = ind <= index
                })
            })
        })
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

    showModal(
        evaluatedObjectID,
        amountOfRatingItems,
        hasCommentField,
        placeholderText
    ) {
        this.clearContent()
        this.init(evaluatedObjectID, amountOfRatingItems, hasCommentField)
        this.setContent(placeholderText)
        this.dialog.showModal()
    }
}

window.customElements.define('feedback-unit', Feedback)
