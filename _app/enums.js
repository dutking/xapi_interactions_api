export const EVENTS = Object.freeze({
    ANSWERED: 'answered',
    COMPLETED: 'completed',
    CONTINUE: 'continue',
    CREATED: 'created',
    FAILED: 'failed',
    FEEDBACK_SUBMITTED: 'feedback_submitted',
    INTERACTED: 'interacted',
    PASSED: 'passed',
    PAUSED: 'paused',
    PLAYED: 'played',
    PROCEEDED: 'proceeded',
    SEEKED: 'seeked',
    STATE_CHANGED: 'state_changed',
    VISIBILITY_CHANGE: 'visibilitychange'
})

export const VERBS = Object.freeze({
    ANSWERED: 'answered',
    CALCULATED: 'calculated',
    COMMENTED: 'commented',
    COMPLETED: 'completed',
    EXITED: 'exited',
    FAILED: 'failed',
    LAUNCHED: 'luanched',
    INTERACTED: 'interacted',
    PASSED: 'passed',
    PAUSED: 'paused',
    PLAYED: 'played',
    RATED: 'rated',
    SEEKED: 'seeked',
    SEND: 'send',
})

export const STATUSES = Object.freeze({
    INITIAL: 'initial',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed'
})

export const INTERACTIONS = Object.freeze({
    TEST: 'test',
    CHAPTER: 'chapter',
    LONGREAD: 'longread'
})


export const QUESTION_TYPES = Object.freeze({
    MC: 'mc',
    MR: 'mr',
    FILL_IN: 'fill-in',
    LONG_FILL_IN: 'long-fill-in',
    RANGE: 'range'
})

export const SUBMIT_MODES = Object.freeze({
    ALL_AT_ONCE: 'all_at_once',
    EACH: 'each'
})

export const DISPLAY_MODES = Object.freeze({
    ALL_AT_ONCE: 'all_at_once',
    ONE_BY_ONE: 'one_by_one',
    ONE_INSTEAD_ANOTHER: 'one_instead_another'
})

export const ANSWERS_FEEDBACK_MODES = Object.freeze({
    QUESTION: 'question', // ! remove such option! use parseText to insert answers feedbacks. For ex. []
    BELOW_ANSWER: 'below_answer', // ! update in DB - former "answer"
    POPUP: 'popup'
})


