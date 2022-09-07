export default class XAPI {
    constructor() {}

    static getURL(stateId) {
        let agentObj = {
            objectType: 'Agent',
            name: XAPI.data.actor.name,
            account: {
                name: XAPI.data.actor.account.name,
                homePage: XAPI.data.actor.account.homePage,
            },
        };

        let agent = encodeURIComponent(JSON.stringify(agentObj).slice(1, -1));

        let activityId = `${config.trackIRI}/${config.id}`

        if (stateId.endsWith('globalPools')) {
            activityId = config.trackIRI;
        }

        let str = `activityId=${activityId}&stateId=${stateId}&agent={${agent}}`;

        let url = `${XAPI.data.endpoint}activities/state?${str}`;

        return url;
    }

    static async getState(stateId) {
        console.log(`%c...getting state for: ${stateId}`, 'color:gray;');
        if (!App.testMode) {
            let url = XAPI.getURL(stateId);
            let res = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: XAPI.data.auth,
                    'X-Experience-API-Version': '1.0.3',
                    'Content-Type': 'application/json; charset=utf-8',
                },
            });

            if (res.ok) {
                let data = await res.json();
                return data;
            } else {
                let fakeResponse = new Promise((resolve, reject) => {
                    resolve({
                        id: stateId,
                        isFake: true
                    });
                });
                return fakeResponse;
            }
        } else {
            let fakeResponse = new Promise((resolve, reject) => {
                resolve({
                    id: stateId,
                    isFake: true
                });
            });
            return fakeResponse;
        }
    }

    static async postState(stateId, obj) {
        if (!App.testMode) {
            let url = XAPI.getURL(stateId);
            let res = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: XAPI.data.auth,
                    'X-Experience-API-Version': '1.0.3',
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify(obj),
            });
            console.log(`%cState posted: ${res.ok}`, 'color:gray;');
            return Promise.resolve(res.ok)
        }
    }

    static async deleteState(stateId) {
        if (!App.testMode) {
            let url = XAPI.getURL(stateId);
            let res = await fetch(url, {
                method: 'DELETE',
                headers: {
                    Authorization: XAPI.data.auth,
                    'X-Experience-API-Version': '1.0.3',
                    'Content-Type': 'application/json; charset=utf-8',
                },
            });
            console.log(`%c${stateId} state deleted: ${res.ok}`, 'color:gray;');
            return Promise.resolve(res.ok)
        }
    }

    static deleteAllStates(clearGlobalPools = false) {
        let deleted = [];

        deleted.push(XAPI.deleteState(App.course.iri));

        if (clearGlobalPools) {
            deleted.push(
                XAPI.deleteState(App.course.data.trackIRI + '/globalPools')
            );
        }

        App.currentInteractions.forEach((i) => {
            deleted.push(XAPI.deleteState(i.iri));
            if (i.data.type === 'test') {
                // надо ли чистить остальные объекты
                i.data.iterables.forEach(
                    (q) => {
                        deleted.push(XAPI.deleteState(`${i.iri}/${q.id}`));
                    }
                );
            }
        });


        Promise.allSettled(deleted).then(() =>
            console.log(
                '%cALL STATES CLEARED',
                'font-weight:bold;color:red;font-size:18px;'
            )
        );
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
                );

                let queryParams = XAPI.parseQuery(window.location.search);
                const response = await fetch(
                    queryParams.xAPILaunchService +
                    'launch/' +
                    queryParams.xAPILaunchKey, {
                        method: 'POST',
                    }
                );

                return await response.json();
            } else {
                let queryParams = XAPI.parseQuery(window.location.search);
                let context = {};
                if (queryParams.context) {
                    context = JSON.parse(queryParams.context);
                }
                let data = {
                    endpoint: queryParams.endpoint,
                    auth: queryParams.auth,
                    actor: JSON.parse(queryParams.actor),
                    registration: queryParams.registration,
                    context: context,
                };

                if (Array.isArray(data.actor.account)) {
                    data.actor.account = data.actor.account[0];
                }

                if (Array.isArray(data.actor.name)) {
                    data.actor.name = data.actor.name[0];
                }

                if (
                    data.actor.account &&
                    data.actor.account.accountServiceHomePage
                ) {
                    data.actor.account.homePage =
                        data.actor.account.accountServiceHomePage;
                    data.actor.account.name = data.actor.account.accountName;
                    delete data.actor.account.accountServiceHomePage;
                    delete data.actor.account.accountName;
                }

                return new Promise((resolve, reject) => resolve(data));
            }
        } else {
            return new Promise((resolve, reject) =>
                resolve({
                    actor: 'Unknown',
                })
            );
        }
    }

    static parseQuery(queryString) {
        let query = {};
        let pairs = (
            queryString[0] === '?' ? queryString.substr(1) : queryString
        ).split('&');

        pairs.forEach((pair) => {
            let [key, value] = pair.split('=');
            query[decodeURIComponent(key)] = decodeURIComponent(value || '');
        });

        return query;
    }

    static async sendStatement(stmt) {
        console.log(`%c...sending statement: ${stmt.verb.display["en-US"]}`, 'color:gray;');
        console.log(stmt);
        if (!App.testMode) {
            const response = await fetch(XAPI.data.endpoint + 'statements', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    Authorization: XAPI.data.auth,
                    'X-Experience-API-Version': '1.0.3',
                },
                body: JSON.stringify(stmt),
            });

            const result = await response.json();
            return Promise.resolve(result)
        }
    }
}