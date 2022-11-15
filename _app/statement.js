import {scoringFunctions} from './scoringFunctions.js'
import {statementFunctions} from './statementFunctions.js'
import {AuxFunctions} from './auxFunctions.js'
import {YTVideo} from './components/ytvideo.js'

export class Statement {
    constructor(obj, verb, extraData = {}) {
        this.obj = obj
        this.verbString = verb
        this.time = new Date()
        this.extraData = extraData
    }

    get id() {
        return {
            id: ADL.ruuid(), // replace with crypto.randomUUID() when better browser support
        }
    }

    get object() {
        const object = {
            object: {
                id: '',
                definition: {},
            },
        }

        if (this.verbString === 'send') {
            object.object.id = `${this.obj.iri}/message_${AuxFunctions.uuid()}`
            object.object.definition = {
                name: {
                    'ru-RU': AuxFunctions.clearFromTags(this.extraData.message),
                },
                type: 'http://id.tincanapi.com/activitytype/chat-message',
            }
            object.object.objectType = 'Activity'
        } else if (this.verbString === 'calculated') {
            let name = `${this.extraData.metric.nameRus}`
            if ('metricName' in this.obj.data) {
                name = `${name} - ${this.obj.data.metricName}`
            }

            object.object.id =
                this.obj.data?.metrics[0] ??
                this.obj?.parent?.data?.questionsSettings?.metrics[0]

            object.object.definition = {
                name: {
                    'en-US': name,
                    'ru-RU': name,
                },
                description: {
                    'en-US': name,
                    'ru-RU': name,
                },
                type: this.extraData.metric.metricType,
            }
        } else if (
            this.verbString === 'rated' ||
            this.verbString === 'commented'
        ) {
            object.object.id = this.obj.evaluatedObject.iri
            object.object.definition = {
                name: {
                    'en-US':
                        AuxFunctions.clearFromTags(
                            this.obj.evaluatedObject.data?.nameRus
                        ) || this.obj.evaluatedObject.iri,
                    'ru-RU':
                        AuxFunctions.clearFromTags(
                            this.obj.evaluatedObject.data?.nameRus
                        ) || this.obj.evaluatedObject.iri,
                },
                description: {
                    'en-US':
                        AuxFunctions.clearFromTags(
                            this.obj.evaluatedObject.data?.description
                        ) ||
                        AuxFunctions.clearFromTags(
                            this.obj.evaluatedObject.data?.nameRus
                        ) ||
                        this.obj.evaluatedObject.iri,
                    'ru-RU':
                        AuxFunctions.clearFromTags(
                            this.obj.evaluatedObject.data?.description
                        ) ||
                        AuxFunctions.clearFromTags(
                            this.obj.evaluatedObject.data?.nameRus
                        ) ||
                        this.obj.evaluatedObject.iri,
                },
            }
        } else {
            object.object.id = this.obj.iri

            object.object.definition = {
                name: {
                    'en-US':
                        AuxFunctions.clearFromTags(this.obj.data?.nameRus) ||
                        this.obj.iri,
                    'ru-RU':
                        AuxFunctions.clearFromTags(this.obj.data?.nameRus) ||
                        this.obj.iri,
                },
                description: {
                    'en-US':
                        AuxFunctions.clearFromTags(
                            this.obj.data?.description
                        ) ||
                        AuxFunctions.clearFromTags(this.obj.data?.nameRus) ||
                        this.obj.iri,
                    'ru-RU':
                        AuxFunctions.clearFromTags(
                            this.obj.data?.description
                        ) ||
                        AuxFunctions.clearFromTags(this.obj.data?.nameRus) ||
                        this.obj.iri,
                },
            }
        }

        if (this.obj.data?.answers) {
            if (
                this.verbString !== 'calculated' &&
                this.verbString !== 'send'
            ) {
                object.object.id = this.obj.iri
                if (
                    this.obj.data.type === 'mc' ||
                    this.obj.data.type === 'mr'
                ) {
                    Object.assign(object.object.definition, {
                        choices: this.choices,
                        correctResponsesPattern: this.correctResponsesPattern,
                        type: this.type,
                        interactionType: this.interactionType,
                    })
                } else if (
                    this.obj.data.type === 'range' ||
                    this.obj.data.type === 'fill-in' ||
                    this.obj.data.type === 'long-fill-in'
                ) {
                    Object.assign(object.object.definition, {
                        correctResponsesPattern: this.correctResponsesPattern,
                        type: this.type,
                        interactionType: this.interactionType,
                    })
                }
            }
        }

        return object
    }

    get context() {
        const object = {
            context: {
                registration: XAPI.data.registration,
                contextActivities: {
                    grouping:
                        XAPI.data?.context?.contextActivities?.grouping || [],
                },
            },
        }

        if (this.verbString === 'send') {
            Object.assign(object.context.contextActivities, {
                parent: [
                    {
                        id: `${this.obj.iri}/conversation`,
                        objectType: 'Activity',
                        definition: {
                            name: {
                                'ru-RU': 'conversation',
                            },
                        },
                    },
                ],
            })

            Object.assign(object.context, {
                extensions: {
                    'contextExt:learnerId': [XAPI.data.actor],
                },
            })
        }

        if (this.verbString === 'calculated') {
            Object.assign(object.context.contextActivities, {
                parent: [
                    {
                        id: App.course.iri,
                    },
                ],
                category: [
                    {
                        id: this.extraData.metric.metricProfile,
                    },
                ],
            })
        }

        if (this.obj instanceof YTVideo) {
            Object.assign(object.context.contextActivities, {
                category: [
                    {
                        id: 'https://w3id.org/xapi/video',
                    },
                ],
            })

            Object.assign(object.context, {
                extensions: {
                    'contextExt:viewId': this.obj.viewId,
                    'contextExt:videoDuration': this.obj.vidData.duration,
                },
            })

            if (this.verb === 'played') {
                Object.assign(object.context.extensions, {
                    'contextExt:speed': this.obj.vidData.speed,
                    'contextExt:volume': this.obj.vidData.volume,
                    'contextExt:fullScreen': this.obj.vidData.fullscreen,
                    'contextExt:quality': this.obj.vidData.quality,
                    'contextExt:screenSize': this.obj.vidData.screenSize,
                    'contextExt:focus': this.obj.vidData.focus,
                })
            }

            if (this.verb === 'interacted') {
                Object.assign(object.context.extensions, {
                    'contextExt:speed': this.obj.vidData.speed,
                })
            }
        }

        if (this.obj.parent) {
            if (
                this.verbString !== 'calculated' &&
                this.verbString !== 'send'
            ) {
                Object.assign(object.context.contextActivities, {
                    parent: [
                        {
                            id: this.obj.parent.iri,
                            objectType: 'Activity',
                        },
                    ],
                })
            }
        }

        if (
            !App.testMode &&
            'context' in object &&
            'contextActivities' in object.context &&
            'grouping' in object.context.contextActivities &&
            object.context.contextActivities.grouping.length > 0 &&
            'extensions' in object.context.contextActivities.grouping[0] &&
            'https://urbanlearning.mguu.ru/xapi/extension/character' in
                object.context.contextActivities.grouping[0].extensions
        ) {
            delete object.context.contextActivities.grouping[0].extensions
        }

        return object
    }

    get verb() {
        return {
            verb: verbs[this.verbString],
        }
    }

    get actor() {
        return {
            actor: XAPI.data.actor,
        }
    }

    get result() {
        const object = {
            result: {},
        }

        if (this.verbString === 'completed') {
            Object.assign(object.result, {
                completion: true,
                duration: moment
                    .duration(
                        Math.round((this.time - this.obj.startTime) / 1000),
                        'seconds'
                    )
                    .toISOString(),
            })
        }

        if (this.verbString === 'passed' || this.verbString === 'failed') {
            Object.assign(object.result, {
                success: this.verbString === 'passed',
                score: {
                    raw: this.obj.score,
                    scaled: (1 / this.obj.maxPossibleScore) * this.obj.score,
                    min: 0,
                    max: this.obj.maxPossibleScore,
                },
                duration: moment
                    .duration(
                        Math.round((this.time - this.obj.startTime) / 1000),
                        'seconds'
                    )
                    .toISOString(),
            })
        }

        if (this.verbString === 'rated') {
            Object.assign(object.result, {
                score: {
                    raw: this.obj.rating,
                },
            })
        }

        if (this.verbString === 'commented') {
            Object.assign(object.result, {
                response: {
                    title: this.obj.comment,
                    text: this.obj.comment,
                    tag: this.obj.comment,
                },
            })
        }

        if (this.verbString === 'exited') {
            Object.assign(object.result, {
                duration: moment
                    .duration(
                        Math.round((this.time - this.obj.startTime) / 1000),
                        'seconds'
                    )
                    .toISOString(),
            })
        }

        if (this.verbString === 'send') {
            Object.assign(object.result, {
                success: true,
                response: '',
            })
        }

        if (this.verbString === 'answered') {
            if (this.obj.data.type === 'mc' || this.obj.data.type === 'mr') {
                Object.assign(object.result, {
                    success: this.obj.result,
                    response: this.obj.userAnswer
                        .filter((e) => e[1] === true)
                        .map((e) => e[0])
                        .join('[,]'),
                })
            } else if (
                this.obj.data.type === 'range' ||
                this.obj.data.type === 'fill-in' ||
                this.obj.data.type === 'long-fill-in'
            ) {
                Object.assign(object.result, {
                    success: this.obj.result,
                    response: this.obj.exactUserAnswer,
                })
            }
        }

        if (this.verbString === 'calculated') {
            if (
                'statement' in this.extraData.metric &&
                'result' in this.extraData.metric.statement
            ) {
                AuxFunctions.mergeDeep(
                    object.result,
                    this.extraData.metric.statement.result
                )
            } else {
                Object.assign(object.result, {
                    score: {
                        raw: this.metricScore.raw,
                    },
                    extensions: {
                        'resultExt:changed': this.metricScore.changed,
                    },
                })
            }
        }

        if (this.obj instanceof YTVideo) {
            Object.assign(object.result, {
                extensions: {
                    'resultExt:viewedRanges': this.obj.vidData.ranges,
                },
            })
            delete object.result.duration
            if (this.verbString === 'seeked') {
                Object.assign(object.result.extensions, {
                    'resultExt:from': this.obj.vidData.seekedData[0],
                    'resultExt:to': this.obj.vidData.seekedData[1],
                })
            }
            if (this.verbString === 'paused') {
                Object.assign(object.result.extensions, {
                    'resultExt:paused': this.obj.vidData.currentTime,
                })
            }
            if (this.verbString === 'played') {
                Object.assign(object.result.extensions, {
                    'resultExt:resumed': this.obj.vidData.resumed,
                })
            }
        }

        return object
    }

    get metricScore() {
        const result = {
            changed: 0,
            raw: 0,
        }

        if (this.obj.processedScores.length === 1) {
            result.changed = this.obj.processedScores[0]
            result.raw = this.obj.processedScores[0]
        } else if (this.obj.processedScores.length > 1) {
            const lastValue =
                this.obj.processedScores[this.obj.processedScores.length - 1]
            const maxValue = Math.max(...this.obj.processedScores.slice(0, -1))
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
        if (this.obj.data.type === 'mc' || this.obj.data.type === 'mr') {
            return this.obj.data.answers.map((a) => ({
                id: a.id,
                description: {
                    'en-US': AuxFunctions.clearFromTags(a.text),
                    'ru-RU': AuxFunctions.clearFromTags(a.text),
                },
            }))
        }
    }

    get correctResponsesPattern() {
        if (this.obj.data.type === 'mr' || this.obj.data.type === 'mc') {
            return [
                this.obj.data.answers
                    .filter((a) => {
                        if (a.correct) {
                            return a
                        }
                    })
                    .map((a) => a.id)
                    .join('[,]'),
            ]
        }
        if (this.obj.data.type === 'range') {
            if (this.obj.data.answers.length > 0) {
                return this.obj.data.answers
                    .filter((a) => {
                        if (a.correct) {
                            return a
                        }
                    })
                    .map((a) => a.id)
            }
            const arr = []
            for (
                let i = this.obj.data.range[0];
                i <= this.obj.data.range[1];
                i++
            ) {
                arr.push(i.toString())
            }
            return arr
        }
        if (
            this.obj.data.type === 'fill-in' ||
            this.obj.data.type === 'long-fill-in'
        ) {
            const arr = []
            this.obj.data.answers.forEach((a) =>
                arr.push(AuxFunctions.clearFromTags(a.text))
            )
            return arr
        }
    }

    get type() {
        if (
            this.obj.data.type === 'mc' ||
            this.obj.data.type === 'mr' ||
            this.obj.data.type === 'range' ||
            this.obj.data.type === 'fill-in' ||
            this.obj.data.type === 'long-fill-in'
        ) {
            return 'http://adlnet.gov/expapi/activities/cmi.interaction'
        }
    }

    get interactionType() {
        if (this.obj.data.type === 'mc' || this.obj.data.type === 'mr') {
            return 'choice'
        }
        if (
            this.obj.data.type === 'range' ||
            this.obj.data.type === 'fill-in'
        ) {
            return 'fill-in'
        }
        if (this.obj.data.type === 'long-fill-in') {
            return 'long-fill-in'
        }
    }

    get timestamp() {
        return {
            timestamp: this.time,
        }
    }

    get statement() {
        const finalStatement = {
            ...this.id,
            ...this.actor,
            ...this.verb,
            ...this.object,
            ...this.context,
            ...this.timestamp,
            ...this.result,
        }

        if (
            this.verbString === 'interacted' ||
            this.verbString === 'launched'
        ) {
            delete finalStatement.result
        }

        return finalStatement
    }
}
