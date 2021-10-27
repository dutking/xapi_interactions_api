import { App } from './app.js';
import { AuxFunctions } from './auxFunctions.js';

export const statementFunctions = {
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
