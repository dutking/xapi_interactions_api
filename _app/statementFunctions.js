import { App } from './app.js';
import { AuxFunctions } from './auxFunctions.js';

export const statementFunctions = {
    adaptation_metric_zun: function (obj) {
        let max = Math.max(...obj.processedScore);
        let last = obj.processedScore[obj.processedScore.length - 1];
        let prevMax = Math.max(...obj.processedScore.slice(0, -1));
        obj.statement = {
            result: {
                extensions: {
                    'resultExt:changed': max > prevMax ? max - prevMax : 0,
                },
                score: {
                    raw: last,
                },
            },
        };
    },
    mir_motivation: function (obj) {
        let data = App.course.data.globalPools.map((p) => {
            return {
                id: p.id,
                name: p.name,
                score: p.processedScore,
                change: p.scores[p.scores.length - 1],
                status: p.status,
            };
        });

        obj.statement = {
            result: {
                extensions: {
                    'contextExt:motivation': data,
                },
            },
        };
    },
    mir_development: function (obj) {
        let data = App.course.data.globalPools.map((p) => {
            return {
                id: p.id,
                name: p.name,
                score: p.processedScore,
                change: p.scores[p.scores.length - 1],
                status: p.status,
            };
        });

        obj.statement = {
            result: {
                extensions: {
                    'contextExt:development': data,
                },
            },
        };
    },
};
