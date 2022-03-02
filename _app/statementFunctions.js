import { App } from './app.js';
import { AuxFunctions } from './auxFunctions.js';

export const statementFunctions = {
    adaptation_metric_zun: function (metric, obj) {
        let max = Math.max(...obj.processedScores);
        let last = obj.processedScores[obj.processedScores.length - 1];
        let prevMax = obj.processedScores.length > 1 ? Math.max(...(obj.processedScores.slice(0, -1))) : obj.processedScores[0];
        console.log('RAW', obj.scores)
        console.log('PROCESSED', obj.processedScores)
        console.log('MAX_LAST_PREVMAX', max, last, prevMax)
        metric.statement = {
            result: {
                extensions: {
                    'resultExt:changed': max > prevMax ? (max - prevMax) : 0,
                },
                score: {
                    raw: last,
                },
            },
        };
    },
    mir_motivation: function (metric, obj) {
        let data = App.course.data.globalPools.map((p) => {
            return {
                id: p.id,
                name: p.name,
                score: p.processedScore,
                change: p.scores[p.scores.length - 1],
                status: p.status,
            };
        });

        metric.statement = {
            result: {
                extensions: {
                    'contextExt:motivation': data,
                },
            },
        };
    },
    mir_development: function (metric, obj) {
        let data = App.course.data.globalPools.map((p) => {
            return {
                id: p.id,
                name: p.name,
                score: p.processedScore,
                change: p.scores[p.scores.length - 1],
                status: p.status,
            };
        });

        metric.statement = {
            result: {
                extensions: {
                    'contextExt:development': data,
                },
            },
        };
    },
};
