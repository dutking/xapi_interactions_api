import { AuxFunctions } from './auxFunctions.js';

export const scoringFunctions = {
    adaptation_asp_survey: function (obj) {
        const options = [2, 1, -2];
        const scales = [
            {
                name: 'Активное изменение среды',
                answers: [
                    'q1a2',
                    'q2a2',
                    'q3a2',
                    'q4a2',
                    'q5a1',
                    'q6a6',
                    'q7a1',
                    'q8a4',
                    'q9a3',
                    'q10a6',
                ],
            },
            {
                name: 'Активное изменение себя',
                answers: [
                    'q1a4',
                    'q2a7',
                    'q3a4',
                    'q4a7',
                    'q5a6',
                    'q6a4',
                    'q7a7',
                    'q8a7',
                    'q9a6',
                    'q10a1',
                ],
            },
            {
                name: 'Уход из среды и поиск новой',
                answers: [
                    'q1a3',
                    'q2a3',
                    'q3a3',
                    'q4a6',
                    'q5a5',
                    'q6a5',
                    'q7a3',
                    'q8a6',
                    'q9a7',
                    'q10a4',
                ],
            },
            {
                name: 'Избегание контакта со средой и погружение во внутренний мир',
                answers: [
                    'q1a1',
                    'q2a5',
                    'q3a1',
                    'q4a3',
                    'q5a2',
                    'q6a1',
                    'q7a5',
                    'q8a2',
                    'q9a2',
                    'q10a3',
                ],
            },
            {
                name: 'Пассивное предъявление своей позиции',
                answers: [
                    'q1a5',
                    'q2a6',
                    'q3a6',
                    'q4a4',
                    'q5a4',
                    'q6a3',
                    'q7a6',
                    'q8a5',
                    'q9a1',
                    'q10a2',
                ],
            },
            {
                name: 'Пассивное подчинение условиям среды',
                answers: [
                    'q1a7',
                    'q2a1',
                    'q3a5',
                    'q4a5',
                    'q5a3',
                    'q6a7',
                    'q7a2',
                    'q8a3',
                    'q9a5',
                    'q10a5',
                ],
            },
            {
                name: 'Пассивное выжидание изменений',
                answers: [
                    'q1a6',
                    'q2a4',
                    'q3a7',
                    'q4a1',
                    'q5a7',
                    'q6a2',
                    'q7a4',
                    'q8a1',
                    'q9a4',
                    'q10a7',
                ],
            },
        ];

        let values = scales.map((s) => {
            let value = s.answers
                .map((a) => {
                    let question = obj.questionsElements.filter((i) =>
                        i.data.id.endsWith(a.split('a')[0])
                    )[0];

                    let order = question.shadowRoot
                        .querySelector(`label[for$=${a}] .inputMarker`)
                        .style.getPropertyValue('--order');

                    if (order) {
                        return options[order - 1];
                    }
                })
                .reduce((sum, item) => (sum += item), 0);
            return {
                name: s.name,
                value: value,
            };
        });

        return values;
    },
    mir_motivation: function (obj) {
        const demotivatedThreshold = 5;
        const motivatedThreshold = 15;
        const getStatusMultipliers = (val) => {
            if (val <= demotivatedThreshold) {
                return [2, 0.5];
            } else if (val >= motivatedThreshold) {
                return [0.5, 2];
            } else {
                return [1, 1];
            }
        };

        if (!('scores' in obj)) {
            obj.scores = [];
        }

        obj.processedScore = obj.scores.reduce((accum, v) => {
            let multipliers = getStatusMultipliers(accum);
            let processedVal = 0;
            let val = v ?? 0;

            if (val >= 0) {
                processedVal = val * multipliers[1];
            } else if (val < 0) {
                processedVal = val * multipliers[0];
            }

            let newVal = accum + processedVal;

            if (newVal <= obj.value.min) {
                return obj.value.min;
            } else if (newVal >= obj.value.max) {
                return obj.value.max;
            } else {
                return newVal;
            }
        }, obj.value.initial);

        if (obj.processedScore <= demotivatedThreshold) {
            obj.status = 'demotivated';
        } else if (obj.processedScore >= motivatedThreshold) {
            obj.status = 'motivated';
        } else {
            obj.status = 'normal';
        }
    },
    mir_development: function (obj) {
        const underdevelopedThreshold = 0;
        const welldevelopedThreshold = 20;
        const getStatusMultipliers = (val) => {
            if (val <= underdevelopedThreshold) {
                return [2, 0.5];
            } else if (val >= welldevelopedThreshold) {
                return [0.5, 2];
            } else {
                return [1, 1];
            }
        };

        if (!('scores' in obj)) {
            obj.scores = [];
        }

        obj.processedScore = obj.scores.reduce((accum, v) => {
            let multipliers = getStatusMultipliers(accum);
            let processedVal = 0;
            let val = v ?? 0;

            if (val >= 0) {
                processedVal = val * multipliers[1];
            } else if (val < 0) {
                processedVal = val * multipliers[0];
            }

            let newVal = accum + processedVal;

            if (newVal <= obj.value.min) {
                return obj.value.min;
            } else if (newVal >= obj.value.max) {
                return obj.value.max;
            } else {
                return newVal;
            }
        }, obj.value.initial);

        if (obj.processedScore <= underdevelopedThreshold) {
            obj.status = 'underdeveloped';
        } else if (obj.processedScore >= welldevelopedThreshold) {
            obj.status = 'welldeveloped';
        } else {
            obj.status = 'normal';
        }
    },
    metric_rating: function (obj) {
        let metricValues = obj.scores.map((s, i) => {
            return s;
        });
        return metricValues;
    },
    adaptation_metric_zun: function (obj) {
        let metricValues = obj.scores.map((s, i) => {
            if (i > 2) {
                return AuxFunctions.roundAccurately(s / 2, 0);
            } else {
                return AuxFunctions.roundAccurately(s, 0);
            }
        });
        return metricValues;
    },
};
