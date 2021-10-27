import { AuxFunctions } from './auxFunctions.js';

export const scoringFunctions = {
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
};
