import {Test} from './components/test.js'
import {Chapter} from './components/chapter.js'
import {Branching} from './components/branching.js'
import {Longread} from './components/longread.js'
import {Sidebar} from './components/sidebar.js'
import {YTVideo} from './components/ytvideo.js'
import {Popup, PopupOpener} from './components/popup.js'
import {scoringFunctions} from './scoringFunctions.js'
import {statementFunctions} from './statementFunctions.js'
import {AuxFunctions} from './auxFunctions.js'

export class App {
    constructor() {}

    static async init() {
        App.checkTestMode()

        App.postedStates = []
        App.sentStatements = []
        App.container = document.querySelector('body')
        App.placeholders = document.querySelectorAll('.placeholder')
        App.completedInteractions = new Set()
        App.currentInteractions = new Set()
        App.currentChapters = []
        App.course = {}
        App.course.iri = `${config.trackIRI}/${config.id}`

        XAPI.data = await XAPI.getData()
        const courseState = await XAPI.getState(App.course.iri)
        App.createCourseObject(courseState)
        App.sentStatements.push(
            XAPI.sendStatement(new Statement(App.course, 'launched').statement)
        )
        console.log(
            `%cCourse ${App.course.data.nameRus} is launched.`,
            'color:lightblue;font-size:18px;font-weight:bold;'
        )

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
            App.course.data.globalPools.forEach((p) => {
                let pool = contextData.filter((d) => d.id === p.id)[0]
                p.value.initial = pool.score
            })
        } else if (
            !contextData &&
            !('isFake' in globalPoolsData) &&
            !('errorId' in globalPoolsData)
        ) {
            App.course.data.globalPools = globalPoolsData.globalPools || []
        }

        if ('globalPools' in config && config.globalPools.length > 0) {
            App.recalculateGlobalPools()
        }

        App.setPopups()
        App.setListeners()
        App.setIntersectionObserver()
        App.createCourse()
        App.setSidebar()

        /* XAPI.getData()
            .then((data) => (XAPI.data = data))
            .then(() => {
                
                App.postedStates = []
                App.sentStatements = []
                App.container = document.querySelector('body');
                App.placeholders = document.querySelectorAll('.placeholder');

                App.completedInteractions = new Set();
                App.currentInteractions = new Set();
                App.course = {};
                App.course.iri = `${config.trackIRI}/${config.id}`

            })
            .then(() => XAPI.getState(App.course.iri))
            .then((data) => {
                App.createCourseObject(data);
                console.log(
                    `%cCourse ${App.course.data.nameRus} is launched.`,
                    'color:lightblue;font-size:18px;font-weight:bold;'
                );
                App.sentStatements.push(XAPI.sendStatement(
                    new Statement(App.course, 'launched').statement
                ));
            })
            .then(() => XAPI.getState(`${config.trackIRI}/globalPools`))
            .then((data) => {
                let contextData = null
                if('globalMetrics' in config && config.globalMetrics.length > 0) {
                    contextData =
                    XAPI.data.context?.contextActivities?.grouping?.[0]?.definition?.extensions?.[config.globalMetrics[0].metricExtension];
                }
                
                if (contextData) {
                    App.course.data.globalPools.forEach((p) => {
                        let pool = contextData.filter((d) => d.id === p.id)[0];
                        p.value.initial = pool.score;
                    });
                } else if (
                    !contextData &&
                    !('isFake' in data) &&
                    !('errorId' in data)
                ) {
                    App.course.data.globalPools = data.globalPools || [];
                }

                if('globalPools' in config && config.globalPools.length > 0) {
                    App.recalculateGlobalPools();
                }
                
                App.setPopups()
                App.setListeners();
                App.createCourse();
                App.setSidebar();
            })
            .then(() => App.setIntersectionObserver()); */
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
            App.course.sidebar = sb
            sb.init(sidebar, {
                globalPools: App.course.data.globalPools,
            })
        }
    }

    static recalculateGlobalPools() {
        if ('globalPools' in App.course.data) {
            App.course.data.globalPools.forEach((p) => {
                if ('scoringFunction' in p && p.scoringFunction !== '') {
                    scoringFunctions[p.scoringFunction](p)
                }
            })

            if ('sidebar' in App.course) {
                App.course.sidebar.updatePools()
            }
        }
    }

    static processMetric(metric, obj) {
        if ('statementFunction' in metric) {
            statementFunctions[metric.statementFunction](metric, obj)
        }
    }

    static checkTestMode() {
        if (window.location.search === '') {
            console.log(
                '%cCourse launched in the test mode.',
                'font-weight:bold; color: red; font-size: 18px;'
            )
            App.testMode = true
        } else {
            App.testMode = false
        }
    }

    static createCourseObject(state = {}) {
        console.log(
            '%cCOURSE STATE',
            'font-size:18px;font-weight:bold;color:lightblue;'
        )
        if (state?.date) {
            console.log(`%cResumed from ${state.date}`, 'color:gray;')
            Object.assign(App.course, {
                data: config,
                startTime: new Date(),
                result: state.result,
                passed: state.passed,
                completed: state.completed,
                scores: state.scores,
                score: state.score,
                pools: state.pools,
                maxPossibleScore: 0,
                maxRequiredScore: 0,
                attempt: state.attempt,
                state: state,
            })
            App.course.attempt++
        } else {
            console.log('%cNewly started', 'color:gray;')
            Object.assign(App.course, {
                data: config,
                startTime: new Date(),
                result: false,
                passed: false,
                completed: false,
                scores: [],
                score: 0,
                pools: config?.pools?.items ? config.pools.items : [],
                maxPossibleScore: 0,
                maxRequiredScore: 0,
                attempt: 0,
                state: {
                    completed: false,
                    passed: false,
                    result: false,
                    scores: [],
                    pools: [],
                    metricsData: [],
                    attempt: 0,
                    date: [],
                    duration: [],
                },
            })
        }

        if (
            App.course.data?.pools?.global &&
            App.course.data.pools.global === true
        ) {
            // rewrite local pools data with global data
            App.getGlobalPools()
        }
    }

    static async setState() {
        App.course.state.date = new Date()
        App.course.state.duration = moment
            .duration(
                Math.round(
                    (App.course.state.date - App.course.startTime) / 1000
                ),
                'seconds'
            )
            .toISOString()
        App.course.state.id = App.course.iri
        App.course.state.completed = App.course.completed
        App.course.state.passed = App.course.passed
        App.course.state.result = App.course.result
        App.course.state.scores = App.course.scores
        App.course.state.score = App.course.score
        /*         App.course.state.pools = App.course.pools; */
        App.course.state.attempt = App.course.attempt
        App.course.state.processedScores = App.course.processedScores

        if ('isFake' in App.course.state) {
            delete App.course.state.isFake
        }

        console.log(
            '%c...posting course state',
            'font-size: 18px; color: lightblue; font-weight: bold;'
        )
        App.postedStates.push(XAPI.postState(App.course.iri, App.course.state))

        if (App.course.data?.metrics && App.course.data.metrics.length > 0) {
            console.log(
                '%c...posting metrics',
                'font-size: 18px; color: lightblue; font-weight: bold;'
            )
            let currentMetric = config.globalMetrics.filter((metric) =>
                App.course.data.metrics.includes(metric.iri)
            )[0]

            let statements = []
            statements.push(
                XAPI.sendStatement(
                    new Statement(App.course, 'calculated', {
                        metric: currentMetric,
                    }).statement
                )
            )

            return Promise.all([...App.postedStates, ...statements])
        } else {
            return Promise.all(App.postedStates)
        }
    }

    static async createCourse() {
        const results = await Promise.allSettled(
            config.interactions.map((interaction, index) =>
                XAPI.getState(`${App.course.iri}/${interaction.id}`)
            )
        )

        const states = results.map((result) => result.value)
        console.log(states)

        states.forEach((state, index) => {
            const interaction = config.interactions[index]

            console.group('STATE FOR: ' + state.id)
            if ('isFake' in state) {
                console.log('%cFake state recieved:', 'color:orange;')
            } else {
                console.log('%cState recieved:', 'color:green;')
            }
            console.log(state)
            console.groupEnd()

            let taskElement = document.createElement(`${interaction.type}-unit`)

            console.log(
                `%c${interaction.type}: ${interaction.id} completed/status -> ${state.completed}/${state.status}`,
                'color:orange;font-weight:bold;font-size:16px;'
            )

            taskElement.init(
                App.placeholders[index],
                interaction,
                state,
                App.course
            )

            if (interaction.evaluated) {
                App.currentInteractions.add(taskElement)
            }

            if (interaction.type === 'chapter') {
                App.currentChapters.push(taskElement)
            }

            if (interaction.type === 'longread') {
                App.observerLongread.observe(taskElement)
            } else if (interaction.type === 'chapter') {
                App.observerChapter.observe(taskElement)
            } else {
                App.observer.observe(taskElement)
            }

            if ('completed' in state && state.completed === true) {
                App.completedInteractions.add(taskElement)
            }
        })

        /* let states = config.interactions.map((interaction, index) => {
      return XAPI.getState(`${App.course.iri}/${interaction.id}`).then(
        (state) => {
          console.group("STATE FOR: " + state.id);
          if ("isFake" in state) {
            console.log("%cFake state recieved:", "color:orange;");
          } else {
            console.log("%cState recieved:", "color:green;");
          }
          console.log(state);
          console.groupEnd();

          let taskElement = document.createElement(`${interaction.type}-unit`);

          console.log(
            `%c${App.course.iri}/${interaction.id} -> ${state.completed}`,
            "color:orange;font-weight:bold;"
          );
          taskElement.init(
            App.placeholders[index],
            interaction,
            state,
            App.course
          );

          if (interaction.evaluated) {
            App.currentInteractions.add(taskElement);
          }

          if (interaction.type === "longread") {
            setTimeout(() => {
              App.observerLongread.observe(taskElement);
            }, 2000);
          } else {
            App.observer.observe(taskElement);
          }

          if ("completed" in state && state.completed === true) {
            App.completedInteractions.add(taskElement);
          }
        }
      );
    }); */

        Promise.allSettled(states).then((results) => {
            App.getMaxPossibleScore()
            App.getMaxRequiredScore()
            App.getPassingScore()
            // App.getScore(); // надо ли пересчитывать при resume
            // addYTVideoScript();
        })
    }

    static logCurrentTestsData() {
        App.currentInteractions.forEach((i) => {
            if (i instanceof Test) {
                i.logTestData()
            }
        })
    }

    static getMaxPossibleScore() {
        App.currentInteractions.forEach((i) => {
            App.course.maxPossibleScore += Number(i.weight)
        })
    }

    static getMaxRequiredScore() {
        Array.from(App.currentInteractions)
            .filter((i) => i.data.requiredState !== 'none')
            .forEach((i) => {
                App.course.maxRequiredScore += Number(i.weight)
            })
    }

    static getPassingScore() {
        if (App.course.data.passingScore === 'max') {
            App.course.passingScore = App.course.maxRequiredScore
        } else if (Number(App.course.data.passingScore)) {
            App.course.passingScore = Number(App.course.data.passingScore)
        }
    }

    /* static isInViewport(elem) {
        let bounding = elem.getBoundingClientRect();
        return bounding.top - 50 <= window.innerHeight;
    } */

    static setIntersectionObserver() {
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
                        App.currentChapters[
                            App.currentChapters.length - 1
                        ].setCompleted()
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
        App.finishCourse()
            .then((resp) => App.setState())
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
                    new Statement(App.course, 'exited').statement
                )
            )
            .then((resp) => App.returnToTrack())
            .catch((e) => console.log(e))
    }

    static getScore() {
        let score = 0
        App.completedInteractions.forEach((i) => {
            if (i.result) {
                score += i.weight
            }
        })
        App.course.scores.push(score)
        App.course.score = score

        if (App.course.data?.scoringFunction) {
            App.course.processedScores = scoringFunctions[
                App.course.data.scoringFunction
            ](App.course)
        } else {
            App.course.processedScores = Array.from(App.course.scores)
        }
    }

    static async finishCourse() {
        App.checkCourseCompleted()
        let statements = []
        if (App.course.completed) {
            console.log(
                '%cCOURSE COMPLETED',
                'color:green;font-size:18px;font-weight:bold;'
            )
            statements.push(
                XAPI.sendStatement(
                    new Statement(App.course, 'completed').statement
                )
            )

            App.getScore()

            if (App.course.score >= App.course.passingScore) {
                App.course.result = true
                App.course.passed = true
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
                App.course.result = false
                App.course.passed = false
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

    static checkCourseCompleted() {
        if (
            App.completedInteractions.size >=
            config.interactions.filter((i) => i.requiredState !== 'none').length
        ) {
            App.course.completed = true
        }
    }

    static setListeners() {
        /* App.container.addEventListener('get_state', (e) => {
            let state = XAPI.getState(e.detail.obj.iri)
        }) */

        App.container.addEventListener('completed', (e) => {
            App.completedInteractions.add(e.detail.obj)
            if (
                'evaluated' in e.detail.obj.data &&
                e.detail.obj.data.evaluated === true
            ) {
                App.sentStatements.push(
                    XAPI.sendStatement(
                        new Statement(e.detail.obj, 'completed').statement
                    )
                )
            } else {
                console.log(
                    `%c${e.detail.obj.iri} is not evaluated. No statement was sent.`,
                    'color:red;'
                )
            }

            App.checkCourseCompleted()
        })

        App.container.addEventListener('state_changed', (e) => {
            if (e.detail.obj.iri.startsWith(App.course.data.trackIRI)) {
                App.postedStates.push(
                    XAPI.postState(e.detail.obj.iri, e.detail.obj.state)
                )
            }

            // add prop to decide which results to use.
            if (
                e.detail.obj.tagName !== 'TEST-UNIT' &&
                'userPoolsResult' in e.detail.obj &&
                e.detail.obj.userPoolsResult.length > 0 &&
                'globalPools' in App.course.data &&
                e.detail.obj.status === 'completed'
            ) {
                let globalPoolsUpdated = false
                e.detail.obj.userPoolsResult.forEach((p) => {
                    let globalPool = App.course.data.globalPools.filter(
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
                            globalPools: App.course.data.globalPools,
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

        App.container.addEventListener('feedbackSubmitted', (e) => {
            if (e.detail.obj.amountOfRatingItems) {
                App.sentStatements.push(
                    XAPI.sendStatement(
                        new Statement(e.detail.obj, 'rated').statement
                    )
                )
            }

            if (e.detail.obj.hasCommentField) {
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
        let data = App.course.data.interactions.map((i) => {
            return [i.structure[1], i.iri]
        })
        console.table(data)
    }
}

class XAPI {
    constructor() {}

    static getURL(stateId) {
        let agentObj = {
            objectType: 'Agent',
            name: XAPI.data.actor.name,
            account: {
                name: XAPI.data.actor.account.name,
                homePage: XAPI.data.actor.account.homePage,
            },
        }

        let agent = encodeURIComponent(JSON.stringify(agentObj).slice(1, -1))

        let activityId = `${config.trackIRI}/${config.id}`

        if (stateId.endsWith('globalPools')) {
            activityId = config.trackIRI
        }

        let str = `activityId=${activityId}&stateId=${stateId}&agent={${agent}}`

        let url = `${XAPI.data.endpoint}activities/state?${str}`

        return url
    }

    static async getState(stateId) {
        console.log(`%c...getting state for: \n${stateId}`, 'color:gray;')
        if (!App.testMode) {
            let url = XAPI.getURL(stateId)
            let res = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: XAPI.data.auth,
                    'X-Experience-API-Version': '1.0.3',
                    'Content-Type': 'application/json; charset=utf-8',
                },
            })

            if (res.ok) {
                let data = await res.json()
                return data
            } else {
                let fakeResponse = new Promise((resolve, reject) => {
                    resolve({
                        id: stateId,
                        isFake: true,
                    })
                })
                return fakeResponse
            }
        } else {
            let fakeResponse = new Promise((resolve, reject) => {
                resolve({
                    id: stateId,
                    isFake: true,
                })
            })
            return fakeResponse
        }
    }

    static async getAllStates() {
        let items = []

        items.push(XAPI.getState(App.course.iri))

        if ('globalPools' in config && config.globalPools.length > 0) {
            items.push(XAPI.getState(App.course.data.trackIRI + '/globalPools'))
        }

        App.currentInteractions.forEach((i) => {
            items.push(XAPI.getState(i.iri))
            if (i.data.type === 'test') {
                i.data.iterables.forEach((q) => {
                    items.push(XAPI.getState(`${i.iri}/${q.id}`))
                })
            }
        })

        return await Promise.allSettled(items)
    }

    static async postState(stateId, obj) {
        console.log(`State to be posted for\n${stateId}`)
        console.log(obj)
        if (!App.testMode) {
            let url = XAPI.getURL(stateId)
            let res = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: XAPI.data.auth,
                    'X-Experience-API-Version': '1.0.3',
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify(obj),
            })
            console.log(`%cState posted: ${res.ok}`, 'color:gray;')
            return Promise.resolve(res.ok)
        }
    }

    static async deleteState(stateId) {
        if (!App.testMode) {
            let url = XAPI.getURL(stateId)
            let res = await fetch(url, {
                method: 'DELETE',
                headers: {
                    Authorization: XAPI.data.auth,
                    'X-Experience-API-Version': '1.0.3',
                    'Content-Type': 'application/json; charset=utf-8',
                },
            })
            console.log(
                `%c${stateId} \nstate deleted: ${res.ok}`,
                'color:gray;'
            )
            return Promise.resolve(res.ok)
        }
    }

    static deleteAllStates(clearGlobalPools = false) {
        let deleted = []

        deleted.push(XAPI.deleteState(App.course.iri))

        if (clearGlobalPools) {
            deleted.push(
                XAPI.deleteState(App.course.data.trackIRI + '/globalPools')
            )
        }

        App.currentInteractions.forEach((i) => {
            deleted.push(XAPI.deleteState(i.iri))
            if (i.data.type === 'test') {
                // надо ли чистить остальные объекты
                i.data.iterables.forEach((q) => {
                    deleted.push(XAPI.deleteState(`${i.iri}/${q.id}`))
                })
            }
        })

        Promise.allSettled(deleted).then(() =>
            console.log(
                '%cALL STATES CLEARED',
                'font-weight:bold;color:red;font-size:18px;'
            )
        )
    }

    static async getData() {
        if (!App.testMode) {
            if (
                window.location.search.includes('xAPILaunchService') &&
                window.location.search.includes('xAPILaunchKey')
            ) {
                console.log(
                    '%cxAPI Launch found',
                    'color:lightblue;font-size:16px;font-weight: bold;'
                )

                let queryParams = XAPI.parseQuery(window.location.search)
                const response = await fetch(
                    queryParams.xAPILaunchService +
                        'launch/' +
                        queryParams.xAPILaunchKey,
                    {
                        method: 'POST',
                    }
                )

                return await response.json()
            } else {
                let queryParams = XAPI.parseQuery(window.location.search)
                let context = {}
                if (queryParams.context) {
                    context = JSON.parse(queryParams.context)
                }
                let data = {
                    endpoint: queryParams.endpoint,
                    auth: queryParams.auth,
                    actor: JSON.parse(queryParams.actor),
                    registration: queryParams.registration,
                    context: context,
                }

                if (Array.isArray(data.actor.account)) {
                    data.actor.account = data.actor.account[0]
                }

                if (Array.isArray(data.actor.name)) {
                    data.actor.name = data.actor.name[0]
                }

                if (
                    data.actor.account &&
                    data.actor.account.accountServiceHomePage
                ) {
                    data.actor.account.homePage =
                        data.actor.account.accountServiceHomePage
                    data.actor.account.name = data.actor.account.accountName
                    delete data.actor.account.accountServiceHomePage
                    delete data.actor.account.accountName
                }

                return new Promise((resolve, reject) => resolve(data))
            }
        } else {
            return new Promise((resolve, reject) =>
                resolve({
                    actor: 'Unknown',
                })
            )
        }
    }

    static parseQuery(queryString) {
        let query = {}
        let pairs = (
            queryString[0] === '?' ? queryString.substr(1) : queryString
        ).split('&')

        pairs.forEach((pair) => {
            let [key, value] = pair.split('=')
            query[decodeURIComponent(key)] = decodeURIComponent(value || '')
        })

        return query
    }

    static async sendStatement(stmt) {
        console.log(
            `%c...sending statement: ${stmt.verb.display['en-US']}`,
            'color:gray;'
        )
        console.log(stmt)
        if (!App.testMode) {
            const response = await fetch(XAPI.data.endpoint + 'statements', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    Authorization: XAPI.data.auth,
                    'X-Experience-API-Version': '1.0.3',
                },
                body: JSON.stringify(stmt),
            })

            const result = await response.json()
            return Promise.resolve(result)
        }
    }
}

class Statement {
    constructor(obj, verb, extraData = {}) {
        this.obj = obj
        this.verbString = verb
        this.time = new Date()
        this.extraData = extraData
    }

    get id() {
        return {
            id: ADL.ruuid(), //replace with crypto.randomUUID() when better browser support
        }
    }

    get object() {
        let object = {
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
        let object = {
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
        let object = {
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
                success: this.verbString === 'passed' ? true : false,
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
        let that = this
        let result = {
            changed: 0,
            raw: 0,
        }

        if (this.obj.processedScores.length === 1) {
            result.changed = this.obj.processedScores[0]
            result.raw = this.obj.processedScores[0]
        } else if (this.obj.processedScores.length > 1) {
            let lastValue =
                this.obj.processedScores[this.obj.processedScores.length - 1]
            let maxValue = Math.max(...this.obj.processedScores.slice(0, -1))
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
            return this.obj.data.answers.map((a) => {
                return {
                    id: a.id,
                    description: {
                        'en-US': AuxFunctions.clearFromTags(a.text),
                        'ru-RU': AuxFunctions.clearFromTags(a.text),
                    },
                }
            })
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
        } else if (this.obj.data.type === 'range') {
            if (this.obj.data.answers.length > 0) {
                return this.obj.data.answers
                    .filter((a) => {
                        if (a.correct) {
                            return a
                        }
                    })
                    .map((a) => a.id)
            } else {
                let arr = []
                for (
                    let i = this.obj.data.range[0];
                    i <= this.obj.data.range[1];
                    i++
                ) {
                    arr.push(i.toString())
                }
                return arr
            }
        } else if (
            this.obj.data.type === 'fill-in' ||
            this.obj.data.type === 'long-fill-in'
        ) {
            let arr = []
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
        } else if (
            this.obj.data.type === 'range' ||
            this.obj.data.type === 'fill-in'
        ) {
            return 'fill-in'
        } else if (this.obj.data.type === 'long-fill-in') {
            return 'long-fill-in'
        }
    }

    get timestamp() {
        return {
            timestamp: this.time,
        }
    }

    get statement() {
        let finalStatement = Object.assign(
            {},
            this.id,
            this.actor,
            this.verb,
            this.object,
            this.context,
            this.timestamp,
            this.result
        )

        if (
            this.verbString === 'interacted' ||
            this.verbString === 'launched'
        ) {
            delete finalStatement.result
        }

        return finalStatement
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
