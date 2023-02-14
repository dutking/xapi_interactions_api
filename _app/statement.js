import {scoringFunctions} from './scoringFunctions.js'
import {statementFunctions} from './statementFunctions.js'
import {AuxFunctions} from './auxFunctions.js'
import {YTVideo} from './components/ytvideo.js'
import {QUESTION_TYPES, VERBS} from './enums.js'
import {Question} from './question.js'
import {verbObjects} from './verbs'
export class Statement {
    constructor(sourceObject, verb, extraData = {}) {
        this.verbName = verb
        this.sourceObject = (this.verbName === VERBS.COMMENTED || this.verbName === VERBS.RATED) ? sourceObject.evaluatedObject : sourceObject
        this.time = new Date()
        this.extraData = extraData
    }

    get idField() {
        return {
            id: AuxFunctions.getId(),
        }
    }

    get actorField() {
        return {
            actor: XAPI.data.actor,
        }
    }

    get verbField() {
        return {
            verb: verbObjects[this.verbName],
        }
    }

    get objectType() {
        return 'Activity'
    }

    get objectId() {
        switch(this.verbName){
            case VERBS.SEND:
                return `${this.sourceObject.iri}/message_${AuxFunctions.getId()}`
            case VERBS.CALCULATED:
                return this.sourceObject.data?.metrics[0] ??
                this.sourceObject?.parent?.data?.questionsSettings?.metrics[0]
            default:
                return this.sourceObject.iri
        }
    }

    get definitionName(){
        if (this.sourceObject instanceof Question) {
            return (`${this.sourceObject.commonQuestion} ${this.sourceObject.story} ${this.sourceObject.question}`).trim().replace('  ', ' ')
        }

        switch(this.verbName) {
            case VERBS.SEND: {
                return AuxFunctions.clearFromTags(this.extraData.message)
            }
            case VERBS.CALCULATED: {
                let name = `${this.extraData.metric.nameRus}`
                if ('metricName' in this.sourceObject.data) {
                    name = `${name} - ${this.sourceObject.data.metricName}`
                }
                return name
            }
            default: {
                return AuxFunctions.clearFromTags(this.sourceObject.data?.nameRus) ||
                this.sourceObject.iri
            }
        }

    }

    // TODO: add languages to DB for name and description
    get objectDefinition() {
        const definition = {
            name: {
                'en-US': this.definitionName,
                'ru-RU': this.definitionName,
            },
            description: {
                'en-US': AuxFunctions.clearFromTags(this.sourceObject.data.description) || this.definitionName,
                'ru-RU': AuxFunctions.clearFromTags(this.sourceObject.data.description) || this.definitionName,
            }
        }

        if (this.sourceObject instanceof Question) {
            definition.correctResponsesPattern = this.correctResponsesPattern
            definition.type = this.type
            definition.interactionType = this.interactionType

            if (
                this.sourceObject.data.type === QUESTION_TYPES.MC ||
                this.sourceObject.data.type === QUESTION_TYPES.MR
            ) {
                definition.choices = this.choices
            }

            return definition
        }

        switch(this.verbName) {
            case VERBS.SEND: {
                definition.type = this.type
                delete definition.description
            }
            break;
            case VERBS.CALCULATED: {
                definition.type = this.extraData.metric.metricType
            }
            break;
            default:
                break;
        }

        return definition
    }

    get objectField() {
        return {
            object: {
                id: this.objectId,
                definition: this.objectDefinition,
                objectType: this.objectType
            },
        }
    }

    get contextField() {
        let contextField = {
            context: {
                registration: XAPI.data.registration,
                contextActivities: {
                    grouping:
                        XAPI.data?.context?.contextActivities?.grouping || [],
                },
            },
        }

        if (this.sourceObject instanceof YTVideo) {
            contextField.context.contextActivities.category = [
                {
                    id: 'https://w3id.org/xapi/video',
                },
            ]

            contextField.context.extensions = {
                'contextExt:viewId': this.sourceObject.viewId,
                'contextExt:videoDuration': this.sourceObject.vidData.duration,
            }

            switch(this.verbName) {
                case VERBS.PLAYED: {
                    contextField.context.extensions = {
                        ...contextField.context.extensions,
                        'contextExt:speed': this.sourceObject.vidData.speed,
                        'contextExt:volume': this.sourceObject.vidData.volume,
                        'contextExt:fullScreen': this.sourceObject.vidData.fullscreen,
                        'contextExt:quality': this.sourceObject.vidData.quality,
                        'contextExt:screenSize': this.sourceObject.vidData.screenSize,
                        'contextExt:focus': this.sourceObject.vidData.focus
                    }
                }
                break;
                case VERBS.INTERACTED: {
                    contextField.context.extensions = {
                        ...contextField.context.extensions,
                        'contextExt:speed': this.sourceObject.vidData.speed
                    }
                }
                break;
                default:
                    break;
            }
            
            return contextField
        }

        switch(this.verbName){
            case VERBS.SEND: {
                contextField.context.contextActivities.parent = [{
                    id: `${this.sourceObject.iri}/conversation`,
                    objectType: 'Activity',
                    definition: {
                        name: {
                            'ru-RU': 'conversation',
                        },
                    },
                }]
                
                contextField.context.extensions = {
                    'contextExt:learnerId': [XAPI.data.actor],
                }
            }
            break;
            case VERBS.CALCULATED: {
                contextField.context.contextActivities.parent = [
                    {
                        id: App.course.iri,
                    }
                ]
    
                contextField.context.contextActivities.category = [
                    {
                        id: this.extraData.metric.metricProfile,
                    },
                ]
            }
            break;
            default: {
                if (this.sourceObject.parent) {
                    contextField.context.contextActivities.parent = [
                        {
                            id: this.sourceObject.parent.iri,
                            objectType: 'Activity',
                        },
                    ]
                }
        
                if (contextField.context.contextActivities.grouping?.[0]?.extensions?.['https://urbanlearning.mguu.ru/xapi/extension/character']
                ) {
                    delete contextField.context.contextActivities.grouping[0].extensions
                }
            }
            break;
        }

        return contextField
    }

    get resultField() {
        let resultField = {
            result: {},
        }

        const duration = moment
            .duration(
                Math.round((this.time - this.sourceObject.startTime) / 1000),
                'seconds'
            )
            .toISOString()

        switch(this.verbName) {
            case VERBS.COMPLETED: {
                resultField.result.completion = true
                resultField.result.duration = duration
            }
            break;
            case VERBS.PASSED: {
                resultField.result.success = true
                resultField.result.score = {
                    raw: this.sourceObject.score,
                    scaled: (1 / this.sourceObject.maxPossibleScore) * this.sourceObject.score,
                    min: 0,
                    max: this.sourceObject.maxPossibleScore,
                }
                resultField.result.duration = duration
            }
            break;
            case VERBS.FAILED: {
                resultField.result.success = true
                resultField.result.score = {
                    raw: this.sourceObject.score,
                    scaled: (1 / this.sourceObject.maxPossibleScore) * this.sourceObject.score,
                    min: 0,
                    max: this.sourceObject.maxPossibleScore,
                }
                resultField.result.duration = duration
            }
            break;
            case VERBS.RATED: {
                resultField.result.score = {
                    raw: this.sourceObject.rating,
                }
            }
            break;
            case VERBS.COMMENTED: {
                resultField.result.response = `{
                    title: ${this.sourceObject.comments.at(-1)},
                    text: ${this.sourceObject.comments.at(-1)},
                    tag: ${this.sourceObject.comments.at(-1)},
                }`
            }
            break;
            case VERBS.EXITED: {
                resultField.result.duration = duration
            }
            break;
            case VERBS.SEND: {
                resultField.result.success = true
                resultField.result.response = ''
            }
            break;
            case VERBS.ANSWERED: {
                resultField.result.success = this.sourceObject.result
                if(this.sourceObject.data.type === QUESTION_TYPES.MC || this.sourceObject.data.type === QUESTION_TYPES.MR) {
                    resultField.result.response = this.sourceObject.userAnswer
                    .filter((e) => e[1] === true)
                    .map((e) => e[0])
                    .join('[,]')
                } else {
                    resultField.result.response = this.sourceObject.exactUserAnswer
                }
            }
            break;
            case VERBS.CALCULATED: {
                if(this.extraData?.metric?.statement?.result) {
                    resultField.result = this.extraData.metric.statement.result
                } else {
                    resultField.result.score = {
                        raw: this.metricScore.raw,
                    }
                    resultField.result.extensions = {
                        'resultExt:changed': this.metricScore.changed,
                    }
                }
            }
            break;
        }

        if (this.sourceObject instanceof YTVideo) {
            delete resultField.result.duration
            resultField.result.extensions = {
                'resultExt:viewedRanges': this.sourceObject.vidData.ranges,
            }

            switch(this.verbName) {
                case VERBS.SEEKED: {
                    resultField.result.extensions['resultExt:from'] = this.sourceObject.vidData.seekedData[0]
                    resultField.result.extensions['resultExt:to'] = this.sourceObject.vidData.seekedData[1]
                }
                break;
                case VERBS.PAUSED: {
                    resultField.result.extensions['resultExt:paused'] = this.sourceObject.vidData.currentTime
                }
                break;
                case VERBS.PLAYED: {
                    resultField.result.extensions['resultExt:resumed'] = this.sourceObject.vidData.resumed
                }
            }
        }

        return resultField
    }

    // TODO: define how to reimplement metrics
    get metricScore() {
        let result = {
            changed: 0,
            raw: 0,
        }

        if (this.sourceObject.processedScores.length === 1) {
            result.changed = this.sourceObject.processedScores[0]
            result.raw = this.sourceObject.processedScores[0]
        } else if (this.sourceObject.processedScores.length > 1) {
            let lastValue =
                this.sourceObject.processedScores[this.sourceObject.processedScores.length - 1]
            let maxValue = Math.max(...this.sourceObject.processedScores.slice(0, -1))
            if (lastValue >= maxValue) {
                result.changed = lastValue - maxValue
                result.raw = lastValue
            } else {
                result.changed = 0
                result.raw = maxValue
            }
        }
        return result
    }

    get choices() {
        if (this.sourceObject.data.type === QUESTION_TYPES.MC || this.sourceObject.data.type === QUESTION_TYPES.MR) {
            return this.sourceObject.data.answers.map((answer) => {
                const answerText = AuxFunctions.clearFromTags(answer.text)
                return {
                    id: answer.id,
                    description: {
                        'en-US': answerText,
                        'ru-RU': answerText,
                    },
                }
            })
        }
    }

    // TODO: maybe rewrite condition to this.interactionType
    get correctResponsesPattern() {
        if (this.sourceObject.data.type === QUESTION_TYPES.MC || this.sourceObject.data.type === QUESTION_TYPES.MR) {
            return [
                this.sourceObject.data.answers
                    .filter((answer) => {
                        if (answer.correct) {
                            return answer
                        }
                    })
                    .map((answer) => answer.id)
                    .join('[,]'),
            ]
        } else if (this.sourceObject.data.type === QUESTION_TYPES.RANGE) {
            if (this.sourceObject.data.answers.length > 0) {
                return this.sourceObject.data.answers
                    .filter((answer) => {
                        if (answer.correct) {
                            return answer
                        }
                    })
                    .map((answer) => answer.id)
            } else {
                let arr = []
                for (
                    let i = this.sourceObject.data.range[0];
                    i <= this.sourceObject.data.range[1];
                    i++
                ) {
                    arr.push(i.toString())
                }
                return arr
            }
        } else if (
            this.sourceObject.data.type === QUESTION_TYPES.FILL_IN ||
            this.sourceObject.data.type === QUESTION_TYPES.LONG_FILL_IN
        ) {
            let arr = []
            this.sourceObject.data.answers.forEach((answer) =>
                arr.push(AuxFunctions.clearFromTags(answer.text))
            )
            return arr
        }
    }

    get type() {
        if (this.sourceObject instanceof Question) return 'http://adlnet.gov/expapi/activities/cmi.interaction'
        if (this.verbName === VERBS.SEND) return 'http://id.tincanapi.com/activitytype/chat-message'
    }

    get interactionType() {
        switch(this.sourceObject.data.type) {
            case QUESTION_TYPES.MC:
                return 'choice'
            case QUESTION_TYPES.MR:
                return 'choice'
            case QUESTION_TYPES.RANGE:
                return 'fill-in'
            case QUESTION_TYPES.FILL_IN:
                return 'fill-in'
            case QUESTION_TYPES.LONG_FILL_IN:
                return 'long-fill-in'
        }
    }

    get timestampField() {
        return {
            timestamp: this.time,
        }
    }

    get statement() {
        let finalStatement = Object.assign(
            {},
            this.idField,
            this.actorField,
            this.verbField,
            this.objectField,
            this.contextField,
            this.resultField,
            this.timestampField,
        )

        if (
            this.verbName === VERBS.INTERACTED ||
            this.verbName === VERBS.LAUNCHED
        ) {
            delete finalStatement.resultField
        }

        return finalStatement
    }
}
