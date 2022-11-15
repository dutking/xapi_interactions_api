export class XAPI {
    constructor() {}

    static getURL(stateId) {
        const agentObj = {
            objectType: 'Agent',
            name: XAPI.data.actor.name,
            account: {
                name: XAPI.data.actor.account.name,
                homePage: XAPI.data.actor.account.homePage,
            },
        }

        const agent = encodeURIComponent(JSON.stringify(agentObj).slice(1, -1))

        let activityId = `${config.trackIRI}/${config.id}`

        if (stateId.endsWith('globalPools')) {
            activityId = config.trackIRI
        }

        const str = `activityId=${activityId}&stateId=${stateId}&agent={${agent}}`

        const url = `${XAPI.data.endpoint}activities/state?${str}`

        return url
    }

    static async getState(stateId) {
        console.log(`%c...getting state for: \n${stateId}`, 'color:gray;')
        if (!App.testMode) {
            const url = XAPI.getURL(stateId)
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: XAPI.data.auth,
                    'X-Experience-API-Version': '1.0.3',
                    'Content-Type': 'application/json; charset=utf-8',
                },
            })

            if (res.ok) {
                const data = await res.json()
                return data
            }
            const fakeResponse = new Promise((resolve, reject) => {
                resolve({
                    id: stateId,
                    noState: true,
                })
            })
            return fakeResponse
        }
        const fakeResponse = new Promise((resolve, reject) => {
            resolve({
                id: stateId,
                noState: true,
            })
        })
        return fakeResponse
    }

    static async getAllStates() {
        const items = []

        items.push(XAPI.getState(App.course.iri))

        if ('globalPools' in config && config.globalPools.length > 0) {
            items.push(XAPI.getState(`${App.course.data.trackIRI}/globalPools`))
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
            const url = XAPI.getURL(stateId)
            const res = await fetch(url, {
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
            const url = XAPI.getURL(stateId)
            const res = await fetch(url, {
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
        const deleted = []

        deleted.push(XAPI.deleteState(App.course.iri))

        if (clearGlobalPools) {
            deleted.push(
                XAPI.deleteState(`${App.course.data.trackIRI}/globalPools`)
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

                const queryParams = XAPI.parseQuery(window.location.search)
                const response = await fetch(
                    `${queryParams.xAPILaunchService}launch/${queryParams.xAPILaunchKey}`,
                    {
                        method: 'POST',
                    }
                )

                return await response.json()
            }
            const queryParams = XAPI.parseQuery(window.location.search)
            let context = {}
            if (queryParams.context) {
                context = JSON.parse(queryParams.context)
            }
            const data = {
                endpoint: queryParams.endpoint,
                auth: queryParams.auth,
                actor: JSON.parse(queryParams.actor),
                registration: queryParams.registration,
                context,
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
        return Promise.resolve({
            actor: 'Unknown',
        })
    }

    static parseQuery(queryString) {
        const query = {}
        const pairs = (
            queryString[0] === '?' ? queryString.substr(1) : queryString
        ).split('&')

        pairs.forEach((pair) => {
            const [key, value] = pair.split('=')
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
            const response = await fetch(`${XAPI.data.endpoint}statements`, {
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
