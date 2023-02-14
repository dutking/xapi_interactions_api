export class AuxFunctions {
    constructor() {}

    static shuffleArray(array) {
        let newArr = Array.from(array);
        for (let i = newArr.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return newArr;
    }

    static roundAccurately(number, decimalPlaces) {
        return Number(
            Math.round(number + 'e' + decimalPlaces) + 'e-' + decimalPlaces
        );
    }

    static parseText(text, object) {
        let parsedText = text;

        if (parsedText.includes('<script')) {
            parsedText = parsedText.replace(/(<script>.+<\/script>)/g, '');
        }

        // <- for questions only
        if (parsedText.includes('<orderNum>')) {
            parsedText = parsedText.replace(/<orderNum>/g, object.index + 1);
        }
        // for questions only ->

        if (parsedText.includes('<amountOfQuestions>')) {
            parsedText = parsedText.replace(
                /<amountOfQuestions>/g,
                object.amountOfQuestions
            );
        }

        if (parsedText.includes('<correctlyAnsweredQuestions>')) {
            parsedText = parsedText.replace(
                /<correctlyAnsweredQuestions>/g,
                object.correctlyAnsweredQuestions
            );
        }

        if (parsedText.includes('<amountOfQuestionsToPass>')) {
            parsedText = parsedText.replace(
                /<amountOfQuestionsToPass>/g,
                object.amountOfQuestionsToPass
            );
        }

        if (parsedText.includes('<score>')) {
            parsedText = parsedText.replace(/<score>/g, object.score);
        }

        if (parsedText.includes('<maxScore>')) {
            parsedText = parsedText.replace(
                /<maxScore>/g,
                Math.max(...object.scores)
            );
        }

        if (parsedText.includes('<processedScore>')) {
            parsedText = parsedText.replace(
                /<processedScore>/g,
                object.processedScore
            );
        }

        if (parsedText.includes('<maxProcessedScore>')) {
            parsedText = parsedText.replace(
                /<maxProcessedScore>/g,
                Math.max(...object.processedScores)
            );
        }

        if (parsedText.includes('<attemptsPerTest>')) {
            parsedText = parsedText.replace(
                /<attemptsPerTest>/g,
                object.data.attemptsPerTest
            );
        }

        if (parsedText.includes('<attempt>')) {
            parsedText = parsedText.replace(/<attempt>/g, object.attempt + 1);
        }

        if (parsedText.includes('<passingAttempt>')) {
            parsedText = parsedText.replace(
                /<passingAttempt>/g,
                object.passingAttempt
            );
        }

        if (parsedText.includes('<passingScore>')) {
            parsedText = parsedText.replace(
                /<passingScore>/g,
                object.passingScore
            );
        }

        if (parsedText.includes('<nameRus>')) {
            parsedText = parsedText.replace(/<nameRus>/g, object.data.nameRus);
        }

        if (parsedText.includes('<result>')) {
            parsedText = parsedText.replace(
                /<result>/g,
                object.result === true ? 'пройден' : 'не пройден'
            );
        }

        if (parsedText.includes('<passed>')) {
            parsedText = parsedText.replace(
                /<passed>/g,
                object.passed === true ? 'пройден успешно' : 'не пройден'
            );
        }

        if (parsedText.includes('<answer>')) {
            parsedText = parsedText.replace(/<answers>/g, object.text);
        }

        if (parsedText.includes('<minResponses>')) {
            parsedText = parsedText.replace(
                /<minResponses>/g,
                object.validation.min
            );
        }

        if (parsedText.includes('<maxResponses>')) {
            parsedText = parsedText.replace(
                /<maxResponses>/g,
                object.validation.max
            );
        }

        if (parsedText.includes('<qId:')){
            let regex = /(\<qId:q\d+\>)/g
            let matches = parsedText.match(regex)

            matches.forEach(m => {
                let qId = m.replace('<','')
                qId = qId.replace('>','')
                qId = qId.split(':')[1]
                let text = object.questionsElements.filter(el => el.data.id.split('_').pop() === qId)[0].exactUserAnswer
            
                parsedText = parsedText.replace(m, text)
            })
        }

        if(parsedText.includes('<likert:')){
            let regex = /(\<likert:(text|score|questions):a\d+\>)/g
            let matches = parsedText.match(regex)
            matches.forEach(m => {
                let property = m.split(":")[1]
                let answerIndex = Number(m.split(":")[2].replace('>', '').split("a")[1]) - 1
                parsedText = parsedText.replace(m, object.likertData[answerIndex][property])
            })
        }

        return parsedText;
    }

    static clearFromTags(text) {
        let element = document.createElement('div')
        element.innerHTML = text

        return element.textContent
    }

    static isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    }

    static mergeDeep(target, ...sources) {
        if (!sources.length) return target;
        const source = sources.shift();

        if (AuxFunctions.isObject(target) && AuxFunctions.isObject(source)) {
            for (const key in source) {
                if (AuxFunctions.isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    AuxFunctions.mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }

        return AuxFunctions.mergeDeep(target, ...sources);
    }

    static removeEmpty(obj) {
        return Object.fromEntries(
          Object.entries(obj)
            .filter(([_, value]) => value != null)
            .map(([key, value]) => [key, value === Object(value) ? removeEmpty(value) : value])
        );
    }

    static getId(){
        return window.crypto.randomUUID()
    }
}
