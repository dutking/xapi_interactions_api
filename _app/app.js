import {Test} from './components/test.js'
import {Chapter} from './components/chapter.js'
import {Branching} from './components/branching.js'
import {Longread} from './components/longread.js'
import {Feedback} from './components/feedback.js'
import {Sidebar} from './components/sidebar.js'
import {YTVideo} from './components/ytvideo.js'
import {Popup, PopupOpener} from './components/popup.js'
import {scoringFunctions} from './scoringFunctions.js'
import {statementFunctions} from './statementFunctions.js'
import {AuxFunctions} from './auxFunctions.js'
import {Statement} from './statement.js'
import {XAPI} from './xapi.js'
import {Course} from './components/course.js'

export class App {
    constructor() {}

    static async init() {
        App.checkTestMode()

        XAPI.data = await XAPI.getData()
    
        App.createCourse()
        .then(() => App.setGlobalPools())
        .then(() => App.createIntersectionObservers())
        .then(() => App.setListeners())
        .then(() => {
            App.setPopups()
            App.setSidebar()
            App.setUserFeedback()
        })
        .catch(e => console.error(e))
    }

    static async createCourse(){
        const courseState = await XAPI.getState(`${config.trackIRI}/${config.id}`)
        window.Course = new Course(courseState)
        window.Course.init()

        XAPI.sendStatement(new Statement(window.Course, 'launched').statement)

        console.log(
            `%cCourse ${window.Course.data.nameRus} is launched.`,
            'color:lightblue;font-size:18px;font-weight:bold;'
        )

        return Promise.resolve()
    }

    static async setGlobalPools() {
        const globalPoolsData = await XAPI.getState(
            `${config.trackIRI}/globalPools`
        )
        let contextData = null
        if ('globalMetrics' in config && config.globalMetrics.length > 0) {
            contextData =
                XAPI.data.context?.contextActivities?.grouping?.[0]?.definition
                    ?.extensions?.[config.globalMetrics[0].metricExtension]
        }

        if (contextData) {
            window.Course.data.globalPools.forEach((p) => {
                let pool = contextData.filter((d) => d.id === p.id)[0]
                p.value.initial = pool.score
            })
        } else if (
            !contextData &&
            !(globalPoolsData.stateExists) &&
            !('errorId' in globalPoolsData)
        ) {
            window.Course.data.globalPools = globalPoolsData.globalPools || []
        }

        if ('globalPools' in config && config.globalPools.length > 0) {
            App.recalculateGlobalPools()
        }

        return Promise.resolve()
    }

    static setUserFeedback() {
        if (config?.appendUserFeedback) {
            window.userFeedback = document.createElement('feedback-unit')
            document.body.append(window.userFeedback)
        }
    }

    static setPopups() {
        if ('popups' in config) {
            config.popups.forEach((pp) => {
                const popup = document.createElement('popup-unit')
                popup.init(pp.id, pp.header, pp.content)
            })
        }
    }

    static setSidebar() {
        let sidebar = document.querySelector('.sidebar')
        if (sidebar) {
            let sb = document.createElement('sidebar-unit')
            window.Course.sidebar = sb
            sb.init(sidebar, {
                globalPools: window.Course.data.globalPools,
            })
        }
    }

    static recalculateGlobalPools() {
        if ('globalPools' in window.Course.data) {
            window.Course.data.globalPools.forEach((p) => {
                if ('scoringFunction' in p && p.scoringFunction !== '') {
                    scoringFunctions[p.scoringFunction](p)
                }
            })

            if ('sidebar' in window.Course) {
                window.Course.sidebar.updatePools()
            }
        }
    }

    

    static checkTestMode() {
        if (window.location.search === '' || !window.location.search.includes('XAPI') || !window.location.search.includes('actor')) {
            console.log(
                '%cCourse launched in the test mode.',
                'font-weight:bold; color: red; font-size: 18px;'
            )
            App.testMode = true
        } else {
            App.testMode = false
        }
    }

    static emitEvent(eventName) {
        let that = this
        let event = new CustomEvent(eventName, {
            bubbles: true,
            composed: true,
            detail: {
                obj: that,
            },
        })
        console.log(`Event "${eventName}" was dispatched by ${that.data.id}`)
        this.dispatchEvent(event)
    }

    static handleMetric(metric) {
            console.log(
                '%c...posting metrics',
                'font-size: 18px; color: lightblue; font-weight: bold;'
            )
            const [currentMetric] = config.globalMetrics.filter((globalMetric) =>
                metric.includes(globalMetric.iri)
            )

            return XAPI.sendStatement(
                    new Statement(window.Course, 'calculated', {
                        metric: currentMetric,
                    }).statement
                )
    }

    static processMetric(metric, obj) {
        if ('statementFunction' in metric) {
            statementFunctions[metric.statementFunction](metric, obj)
        }
    }

    static logCurrentTestsData() {
        App.currentInteractions.forEach((i) => {
            if (i instanceof Test) {
                i.logTestData()
            }
        })
    }

    static createIntersectionObservers() {
        let options = {
            root: null,
            rootMargin: '100px',
            threshold: 0,
        }

        let optionsLongread = {
            root: document,
            rootMargin: '300px',
            threshold: 0,
        }

        let optionsChapter = {
            root: document,
            rootMargin: '0px',
            threshold: 0.2,
        }

        let callback = (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    let interaction = entry.target
                    if (interaction.tagName !== 'longread-unit'.toUpperCase()) {
                        console.log(
                            `%c${interaction.tagName} ${interaction.iri} is in viewport.`,
                            'color:gray;'
                        )
                        interaction['startTime'] = new Date()
                        interaction.emitEvent('interacted')

                        if (
                            interaction.tagName === 'chapter-unit'.toUpperCase()
                        ) {
                            if (!interaction.completed) {
                                interaction.status = 'inProgress'
                                interaction.setState(
                                    `Chapter ${interaction.data.id} is inProgress`
                                )
                            }
                            if (App.currentChapters.indexOf(interaction) > 0) {
                                let currentChapterIndex =
                                    App.currentChapters.indexOf(interaction)
                                let prevChapter =
                                    App.currentChapters[currentChapterIndex - 1]
                                prevChapter.setCompleted()
                            }
                        }

                        observer.unobserve(interaction)
                    }
                }
                // Each entry describes an intersection change for one observed
                // target element:
                //   entry.boundingClientRect
                //   entry.intersectionRatio
                //   entry.intersectionRect
                //   entry.isIntersecting
                //   entry.rootBounds
                //   entry.target
                //   entry.time
            })
        }

        let callbackLongread = (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    if (
                        entry.target.tagName === 'longread-unit'.toUpperCase()
                    ) {
                        console.log(
                            `%c${entry.target.tagName} ${entry.target.iri} is in viewport.`,
                            'color:gray;'
                        )
                        if (App.currentChapters.length > 0) {
                            App.currentChapters[
                                App.currentChapters.length - 1
                            ].setCompleted()
                        }
                        entry.target.setCompleted()
                        observer.unobserve(entry.target)
                    }
                }
            })
        }

        App.observer = new IntersectionObserver(callback, options)
        App.observerChapter = new IntersectionObserver(callback, optionsChapter)
        App.observerLongread = new IntersectionObserver(
            callbackLongread,
            optionsLongread
        )
    }

    static returnToTrack() {
        console.log(
            '%cRETURN TO TRACK',
            'color:lightblue; font-weight: bold; font-size: 18px;'
        )
        setTimeout(() => {
            ;(function () {
                if (window.top) {
                    return window.top
                }
                return window.parent
            })().location = '/back/'
            return false
        }, 3000)
    }


    static exitCourse() {
        window.Course.setState().then(() => window.Course.finishCourse())

            .then((resp) => {
                let statements = Array.from(App.currentInteractions).map(
                    (i) => {
                        XAPI.sendStatement(new Statement(i, 'exited').statement)
                    }
                )

                return Promise.all(statements)
            })
            .then((resp) =>
                XAPI.sendStatement(
                    new Statement(window.Course, 'exited').statement
                )
            )
            .then((resp) => App.returnToTrack())
            .catch((e) => console.log(e))
    }

    static async finishCourse() {
        let statements = []
        if (window.Course.completed) {
            console.log(
                '%cCOURSE COMPLETED',
                'color:green;font-size:18px;font-weight:bold;'
            )
            statements.push(
                XAPI.sendStatement(
                    new Statement(window.Course, 'completed').statement
                )
            )

            App.getScore()

            if (window.Course.score >= window.Course.passingScore) {
                window.Course.result = true
                window.Course.passed = true
                console.log(
                    '%cCOURSE PASSED',
                    'color:green;font-size:18px;font-weight:bold;'
                )
                statements.push(
                    XAPI.sendStatement(
                        new Statement(window.Course, 'passed').statement
                    )
                )
            } else {
                window.Course.result = false
                window.Course.passed = false
                console.log(
                    '%cCOURSE FAILED',
                    'color:red;font-size:18px;font-weight:bold;'
                )
                statements.push(
                    XAPI.sendStatement(
                        new Statement(window.Course, 'failed').statement
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
            let res = await Promise.all([
                ...App.postedStates,
                ...App.sentStatements,
                ...statements,
            ])

            return res
        } catch (e) {
            console.error(e)
        }
    }

    static setListeners() {
        /* App.container.addEventListener('get_state', (e) => {
            let state = XAPI.getState(e.detail.obj.iri)
        }) */

        App.container.addEventListener('completed', (e) => {
                App.sentStatements.push(
                    XAPI.sendStatement(
                        new Statement(e.detail.obj, 'completed').statement
                    )
                )

                if (window.Course.completed) {
                    window.Course.finishCourse()
                }
        })

        App.container.addEventListener('state_changed', (e) => {
            if (e.detail.obj.iri.startsWith(window.Course.data.trackIRI)) {
                App.postedStates.push(
                    XAPI.postState(e.detail.obj.iri, e.detail.obj.state)
                )
            }

            // add prop to decide which results to use.
            if (
                e.detail.obj.tagName !== 'TEST-UNIT' &&
                'userPoolsResult' in e.detail.obj &&
                e.detail.obj.userPoolsResult.length > 0 &&
                'globalPools' in window.Course.data &&
                e.detail.obj.status === 'completed'
            ) {
                let globalPoolsUpdated = false
                e.detail.obj.userPoolsResult.forEach((p) => {
                    let globalPool = window.Course.data.globalPools.filter(
                        (gp) => gp.id === p.id
                    )[0]
                    if (globalPool) {
                        globalPoolsUpdated = true
                        globalPool.scores.push(p.value)
                    }
                })

                if (globalPoolsUpdated) {
                    App.recalculateGlobalPools()
                    App.postedStates.push(
                        XAPI.postState(`${config.trackIRI}/globalPools`, {
                            globalPools: window.Course.data.globalPools,
                        })
                    )
                }
            }

            if (
                'globalMetrics' in config &&
                config.globalMetrics.length > 0 &&
                e.detail.obj.parent instanceof Test &&
                'questionsSettings' in e.detail.obj.parent.data &&
                'metrics' in e.detail.obj.parent.data.questionsSettings &&
                e.detail.obj.parent.data.questionsSettings.metrics.length > 0 &&
                e.detail.obj.status === 'completed'
            ) {
                let currentMetric = config.globalMetrics.filter((metric) =>
                    e.detail.obj.parent.data.questionsSettings.metrics[0].includes(
                        metric.iri
                    )
                )[0]

                App.processMetric(currentMetric, e.detail.obj)

                App.sentStatements.push(
                    XAPI.sendStatement(
                        new Statement(e.detail.obj, 'calculated', {
                            metric: currentMetric,
                        }).statement
                    )
                )
            } else if (
                'globalMetrics' in config &&
                config.globalMetrics.length > 0 &&
                'metrics' in e.detail.obj.data &&
                e.detail.obj.data.metrics.length > 0 &&
                e.detail.obj.status === 'completed'
            ) {
                let currentMetric = config.globalMetrics.filter((metric) =>
                    e.detail.obj.data.metrics[0].includes(metric.iri)
                )[0]

                if ('requiredState' in currentMetric) {
                    if (
                        (currentMetric.requiredState === 'completed' &&
                            e.detail.obj.attemptCompleted) ||
                        (currentMetric.requiredState === 'passed' &&
                            e.detail.obj.passed)
                    ) {
                        App.processMetric(currentMetric, e.detail.obj)

                        App.sentStatements.push(
                            XAPI.sendStatement(
                                new Statement(e.detail.obj, 'calculated', {
                                    metric: currentMetric,
                                }).statement
                            )
                        )
                    }
                } else {
                    App.processMetric(currentMetric, e.detail.obj)

                    App.sentStatements.push(
                        XAPI.sendStatement(
                            new Statement(e.detail.obj, 'calculated', {
                                metric: currentMetric,
                            }).statement
                        )
                    )
                }
            }

            if (
                e.detail.obj.status === 'completed' &&
                e.detail.obj.data?.statements?.send
            ) {
                console.log('%cSENDING MESSAGE', 'font-size:20px;color:red;')
                if (
                    e.detail.obj.data.statements.send.requiredState ===
                        'completed' ||
                    (e.detail.obj.data.statements.send.requiredState ===
                        'passed' &&
                        e.detail.obj.passed)
                ) {
                    App.sentStatements.push(
                        XAPI.sendStatement(
                            new Statement(e.detail.obj, 'send', {
                                message: e.detail.obj.sendStmtMessage,
                            }).statement
                        )
                    )
                }
            }

            Promise.all([...App.postedStates, ...App.sentStatements]).catch(
                (e) => console.log(e)
            )
        })

        App.container.addEventListener('created', (e) => {
            App.observer.observe(e.detail.obj)
        })

        App.container.addEventListener('played', (e) => {
            App.sentStatements.push(
                XAPI.sendStatement(
                    new Statement(e.detail.obj, 'played').statement
                )
            )
        })

        App.container.addEventListener('paused', (e) => {
            App.sentStatements.push(
                XAPI.sendStatement(
                    new Statement(e.detail.obj, 'paused').statement
                )
            )
        })

        App.container.addEventListener('seeked', (e) => {
            App.sentStatements.push(
                XAPI.sendStatement(
                    new Statement(e.detail.obj, 'seeked').statement
                )
            )
        })

        App.container.addEventListener('passed', (e) => {
            if (e.detail.obj.data?.evaluated === true) {
                App.sentStatements.push(
                    XAPI.sendStatement(
                        new Statement(e.detail.obj, 'passed').statement
                    )
                )
            } else {
                console.log(
                    `%c${e.detail.obj.iri} is not evaluated. No statement was sent.`,
                    'color:red;'
                )
            }
        })

        App.container.addEventListener('interacted', (e) => {
            if (e.detail.obj.data?.evaluated === true) {
                App.sentStatements.push(
                    XAPI.sendStatement(
                        new Statement(e.detail.obj, 'interacted').statement
                    )
                )
            } else {
                console.log(
                    `%c${e.detail.obj.data.iri} is not evaluated. No statement was sent.`,
                    'color:red;'
                )
            }
        })

        App.container.addEventListener('failed', (e) => {
            if (e.detail.obj.data?.evaluated === true) {
                App.sentStatements.push(
                    XAPI.sendStatement(
                        new Statement(e.detail.obj, 'failed').statement
                    )
                )
            } else {
                console.log(
                    `%c${e.detail.obj.data.iri} is not evaluated. No statement was sent.`,
                    'color:red;'
                )
            }
        })

        App.container.addEventListener('answered', (e) => {
            if (e.detail.obj.parent.data?.evaluated === true) {
                App.sentStatements.push(
                    XAPI.sendStatement(
                        new Statement(e.detail.obj, 'answered').statement
                    )
                )
            } else {
                console.log(
                    `%c${e.detail.obj.data.iri} is not evaluated. No statement was sent.`,
                    'color:red;'
                )
            }
        })

        App.container.addEventListener('exited', (e) => {
            App.exitCourse()
        })

        App.container.addEventListener('feedback_submitted', (e) => {
            if (e.detail.obj.amountOfRatingItems) {
                App.sentStatements.push(
                    XAPI.sendStatement(
                        new Statement(e.detail.obj, 'rated').statement
                    )
                )
            }

            if (e.detail.obj.commentPlaceholderText) {
                App.sentStatements.push(
                    XAPI.sendStatement(
                        new Statement(e.detail.obj, 'commented').statement
                    )
                )
            }
        })

        document.addEventListener(
            'visibilitychange',
            (e) => {
                if (document.visibilityState === 'hidden') {
                    Array.from(
                        document.querySelectorAll('ytvideo-unit')
                    ).forEach((u) => u.player.pauseVideo())
                }
            },
            false
        )
    }

    static getIds() {
        let data = window.Course.data.interactions.map((i) => {
            return [i.structure[1], i.iri]
        })
        console.table(data)
    }
}

window.addEventListener('load', function () {
    window.App = App
    window.XAPI = XAPI
    App.init()
})

// functions to initialize YouTube iFrame API

/* function addYTVideoScript() {
  let tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  let firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

window.onYouTubeIframeAPIReady = () => {
  console.log("%cYT iFrame API ready", "color:lightblue;");
  setTimeout(function () {
    let vidDivs = document.querySelectorAll("ytvideo-unit");
    console.log(`%c${vidDivs.length} videos to be loaded`, "color:lightblue;");
    vidDivs.forEach((div) => {
      div.setPlayer();
    });
  }, 5000);
}; */
