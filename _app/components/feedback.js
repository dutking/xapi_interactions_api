import {AuxFunctions} from '../auxFunctions.js'

const commentItemTemplate = document.createElement('template')
commentItemTemplate.innerHTML = `
    <style>
        textarea.comment {
            font-family: var(--font-family-primary);
            font-size: var(--font-size-primary);
            box-sizing: border-box;
            width: 100%;
            padding: 1rem;
            outline: none;
            border-radius: var(--feedback-textarea-border-radius, .5rem);
        }

        textarea.comment:focus-within{
            border-color: --ratingItem-background-checked;
            box-shadow: inset 0 0 0 1px var(--ratingItem-background-checked);
        }

        textarea.comment::placeholder {
            color: --ratingItem-background;
        }

        textarea.comment:disabled {
            pointer-events: none;
        }
    </style>
    <textarea class="comment" placeholder="Напишите комментарий" rows="5"></textarea>
`

const ratingItemTemplate = document.createElement('template')
ratingItemTemplate.innerHTML = `
    <style>
        .ratingItem input {
            display: none;
        }

        .ratingItem input + label {
            display: block;
            box-sizing: border-box;
            width: var(--ratingItem-width, 50px);
            height: var(--ratingItem-height, 50px);
            background: var(--ratingItem-background, #eee);;
            -webkit-mask-image: url(_app/components/img/feedbackClippingMask.svg);
            -webkit-mask-size: 100% 100%;
            -webkit-mask-repeat: no-repeat;
            mask-image: url(_app/components/img/feedbackClippingMask.svg);
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
            position: fixed;
            box-sizing: border-box;
            width: var(--feedback-width, 30vw);
            padding: var(--feedback-padding, 2rem);
            display: flex;
            flex-direction: column;
            gap: var(--feedback-gap, 2rem);
            background: var(--feedback-background, white);
            color: var(--feedback-color, black);
            border: var(--feedback-border);
            border-radius: var(--feedback-border-radius);
            font-family: var(--font-family-primary);
        }

        .feedbackContainer > header {
            font-weight: bold;
            text-align: center;
            margin-bottom: 2rem;
        }

        .feedbackContainer .content {
            display: flex;
            flex-direction: column;
            gap: var(--feedback-gap, 2rem);
        }

        .ratingContainer {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: var(--ratingContainer-justify-content, center);
            align-items: var(--ratingContainer-align-items, center);
            gap: var(--ratingContainer-gap, 1rem);
        }

        .ratingContainer > header {
            flex-basis: 100%;
            flex-grow: 5;
            text-align: center;
        }

        .commentContainer {
            width: 100%;
        }

        .btn {
            padding: var(--button-padding);
            text-align: var(--button-text-align);
            color: var(--button-color-normal);
            font-family: var(--font-family-primary, "Arial");
            font-size: var(--button-font-size, 1rem);
            font-weight: var(--button-font-weight, normal);
            font-style: var(--button-font-style, normal)
            letter-spacing: var(--button-letter-spacing);
            background: var(--button-bg-color-normal, #1E2251);
            border-style: var(--button-border-style);
            border-radius: var(--button-border-radius);
            border-width: var(--button-border-width-normal);
            border-color: var(--button-border-color-normal);
            text-shadow: var(--button-text-shadow-normal);
            box-shadow: var(--button-box-shadow-normal);
            cursor: pointer;
        }

        .btn:hover {
            color: var(--button-color-hover);
            background: var(--button-bg-color-hover);
            border-width: var(--button-border-width-hover);
            border-color: var(--button-border-color-hover);
            text-shadow: var(--button-text-shadow-hover);
            box-shadow: var(--button-box-shadow-hover);
        }

        .btn:active {
            color: var(--button-color-active);
            background: var(--button-bg-color-active);
            border-width: var(--button-border-width-active);
            border-color: var(--button-border-color-active);
            text-shadow: var(--button-text-shadow-active);
            box-shadow: var(--button-box-shadow-active);
        }

        .btn:disabled {
            color: var(--button-color-disabled);
            background: var(--button-bg-color-disabled);
            border-width: var(--button-border-width-disabled);
            border-color: var(--button-border-color-disabled);
            text-shadow: var(--button-text-shadow-disabled);
            box-shadow: var(--button-box-shadow-disabled);
            pointer-events: none;
        }

        .closeBtn {
            position: absolute;
            box-sizing: border-box;
            padding: 0;
            top: var(--feedback-closeBtn-top, 1.5rem);
            right: var(--feedback-closeBtn-right, 1.5rem);
            width: var(--feedback-closeBtn-width, 3rem);
            height: var(--feedback-closeBtn-height, 3rem);
            border-radius: var(--feedback-closeBtn-border-radius, 0.5rem);
            border: var(--feedback-closeBtn-border, solid 0 transparent);
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .submitBtn {
            width: max-content;
            align-self: center;
        }

        .off {
            display: none;
        }
    </style>

    <dialog class="feedbackContainer">
        <header>Нам важно ваше мнение!</header>
        <div class="content">
            <div class="ratingContainer off">
            </div>
            <div class="commentContainer off"></div>
        </div>
        <button class="btn submitBtn" type="button">Отправить</button>
        <button class="btn closeBtn" type="button">&#x2715</button>
    </dialog>
`

export class Feedback extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({mode: 'open'})
        this.shadowRoot.appendChild(feedbackTemplate.content.cloneNode(true))
        this.data = {id: 'feedbackForm'}
        this.rating = 0
        this.comment = ''
        this.initiated = false
    }

    connectedCallback() {
        this.data = {id: 'feedbackForm'}
        this.rating = 0
        this.comment = ''
        this.dialog = this.shadowRoot.querySelector('dialog')
        this.content = this.shadowRoot.querySelector('.content')
        this.ratingContainer = this.shadowRoot.querySelector('.ratingContainer')
        this.commentContainer =
            this.shadowRoot.querySelector('.commentContainer')
        this.closeBtn = this.shadowRoot.querySelector('.closeBtn')
        this.submitBtn = this.shadowRoot.querySelector('.submitBtn')

        this.setCommonListeners()
        this.classList.add('off')
    }

    init(evaluatedObjectID, amountOfRatingItems, commentPlaceholderText) {
        console.log('INIT')
        this.evaluatedObjectID = evaluatedObjectID // string
        this.amountOfRatingItems = amountOfRatingItems // number
        this.commentPlaceholderText = commentPlaceholderText // string
        this.evaluatedObject = [...window.App.course.currentInteractions].filter((i) => i.data.id === evaluatedObjectID)[0]
        this.submitBtn.disabled = false
    }

    clearContent() {
        this.ratingContainer.innerHTML = ''
        this.commentContainer.innerHTML = ''
    }

    setRating() {
        console.log('SET RATING')
        this.ratingContainer.classList.remove('off')
        let header = document.createElement('header')
        header.innerHTML = `Оцените ${this.evaluatedObject.data.nameRus} от 1 до ${this.amountOfRatingItems}`
        this.ratingContainer.append(header)

        for (let i = 0; i < this.amountOfRatingItems; i++) {
            let item = ratingItemTemplate.content.cloneNode(true)
            let input = item.querySelector('input')
            input.setAttribute('id', `inp_${i}`)
            input.dataset.value = i + 1

            item.querySelector('label').setAttribute('for', `inp_${i}`)
            this.ratingContainer.append(item)
        }
    }

    setComment() {
        console.log('SET COMMENT')
        this.commentContainer.classList.remove('off')
        let item = commentItemTemplate.content.cloneNode(true)
        item.querySelector('textarea').setAttribute(
            'placeholder',
            this.commentPlaceholderText
        )

        this.commentContainer.append(item)
    }

    setContent() {
        console.log('SET CONTENT')
        if (this.amountOfRatingItems) this.setRating()
        if (this.commentPlaceholderText) this.setComment()
    }

    setCommonListeners() {
        this.closeBtn.addEventListener('click', () => {
            console.log('CLOSE')
            this.dialog.close()
            this.classList.add('off')
            document.querySelector('body').style.overflow = 'auto'
        })

        this.submitBtn.addEventListener('click', (e) => {
            this.emitEvent('feedbackSubmitted')
            e.target.innerHTML = 'Отправлено'
            e.target.disabled = true

            if (this.amountOfRatingItems) {
                let inputs = Array.from(
                    this.ratingContainer.querySelectorAll('input')
                )
                inputs.forEach((input) => (input.disabled = true))
            }

            if (this.commentPlaceholderText) {
                let textarea = this.shadowRoot.querySelector('textarea')
                textarea.disabled = true
            }
        })
    }

    setCurrentListeners() {
        if (this.amountOfRatingItems) {
            let inputs = Array.from(
                this.ratingContainer.querySelectorAll('input')
            )
            inputs.forEach((input, index) => {
                input.addEventListener('click', () => {
                    this.rating = Number(input.dataset.value)
                    inputs.forEach((i, ind) => {
                        i.checked = ind <= index
                    })
                })
            })
        }

        if (this.commentPlaceholderText) {
            let textarea = this.shadowRoot.querySelector('textarea')
            textarea.addEventListener('input', (e) => {
                this.comment = e.target.value
            })
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

    show(evaluatedObjectID, amountOfRatingItems, commentPlaceholderText) {
        if (amountOfRatingItems || commentPlaceholderText) {
            this.clearContent()
            this.init(
                evaluatedObjectID,
                amountOfRatingItems,
                commentPlaceholderText
            )
            this.setContent()
            this.setCurrentListeners()
            document.querySelector('body').style.overflow = 'hidden'
            this.classList.remove('off')
            this.dialog.showModal()
        }
    }
}

window.customElements.define('feedback-unit', Feedback)
