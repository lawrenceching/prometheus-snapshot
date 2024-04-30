// import fetch from 'node-fetch'

const DEFAULT_OPTIONS = {
    step: 14
}

function getName(result) {
    const labels = []
    for(let key in result.metric) {
        if (result.metric.hasOwnProperty(key)) {
            labels.push(`${key}=${result.metric[key]}`)
        }
    }
    return labels.join(" ")
}

class Prometheus {

    constructor(url) {
        this.url = url;
    }

    async queryRange (promQL, startInSeconds, endInSeconds, _options) {

        const options = Object.assign({}, DEFAULT_OPTIONS, _options)

        const url = new URL(`${this.url}/api/v1/query_range`);
        url.searchParams.append('query', promQL)
        url.searchParams.append('start', startInSeconds)
        url.searchParams.append('end', endInSeconds)
        url.searchParams.append('step', options.step)
        // log(`> ${url.href}`)
        const resp = await fetch(url.href)

        // window.fetchCache[url] = resp;

        return resp;
    }

    async queryRangeSince (promQL, durationInSeconds, options) {
        const endInSeconds = Date.now() / 1000;
        const startInSeconds = endInSeconds - durationInSeconds;
        return await this.queryRange(promQL, startInSeconds, endInSeconds, options);
    }

}

export default Prometheus