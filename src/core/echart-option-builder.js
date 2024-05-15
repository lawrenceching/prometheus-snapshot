// START
const SUPPORTED_UNITS = {
    percent_0_to_1: 'Percent (0.0-1.0)',
    second: 'second',
    bytes: 'bytes',
    number: 'number'
};


const defaultOptions = {
    unit: SUPPORTED_UNITS.number,
}

const formatters = {};
formatters[SUPPORTED_UNITS.bytes] = (value) => {
    const b = 1;
    const kb = 1000 * b;
    const mb = 1000 * kb;
    const gb = 1000 * mb;
    const tb = 1000 * gb;
    if (value > tb) {
        return `${(value / tb).toFixed(2)} TB`;
    }
    if (value > gb) {
        return `${(value / gb).toFixed(2)} GB`;
    }
    if (value > mb) {
        return `${(value / mb).toFixed(2)} MB`;
    }
    if (value > kb) {
        return `${(value / kb).toFixed(2)} KB`;
    }
    return `${(value / kb).toFixed(2)} B`;
};

formatters[SUPPORTED_UNITS.percent_0_to_1] = (value) => {
    return `${(parseFloat(value) * 100).toFixed(2)}%`;
}

formatters[SUPPORTED_UNITS.second] = (value) => {
    return `${value}ms`
}

formatters[SUPPORTED_UNITS.number] = (value) => {
    return `${value}`
}

/**
 * {
 *                     "handler": "subroute",
 *                     "instance": "localhost:2019",
 *                     "job": "caddy",
 *                     "server": "srv0",
 *                     "<other metric key>": "<other values>"
 * }
 * @param metric
 */
function nameOf(metric) {
    const labels = []
    for (const [key, value] of Object.entries(metric)) {
        labels.push(`${key}=${value}`)
    }
    return labels.join(' ');
}

/**

 * dataSet is:
 * [
 *             {
 *                 "metric": {
 *                     "handler": "subroute",
 *                     "instance": "localhost:2019",
 *                     "job": "caddy",
 *                     "server": "srv0"
 *                 },
 *                 "values": [
 *                     [
 *                         1714492874.299,
 *                         "1.3555555555555554"
 *                     ],
 *                     [
 *                         1714496472.299,
 *                         "1.2"
 *                     ]
 *                 ]
 *             }
 * ]
 * @param dataSet
 * @param options
 */
function buildEchartOption(panel, dataSet, options) {
    const {
        title,
        subtitle,
        renderer,
        unit,
        headless,
        width,
        height,
        output,
        showLegend
    } = Object.assign({}, defaultOptions, options);

    return {
        tooltip: {
            trigger: 'axis',
            showContent: true,
            valueFormatter: function (value) {
                const formatter = !!formatters[unit] ? formatters[unit] : (v) => v;
                return formatter(value);
            },
            position: function (pt) {
                return [pt[0], '10%'];
            }
        },
        title: {
            left: 'center',
            text: panel.title,
            textStyle: {
                fontSize: 24,
                fontWeight: 'bold',
            },
            subtext: panel.query
        },
        backgroundColor: "#FFF",
        animation: false,
        // legend: {
        //     left: 'right',
        //     show: showLegend,
        //     top: 'center',
        //     orient: 'vertical',
        //     icon: 'circle',
        //     data: dataSet.length > 10 ? null : dataSet.map(d => d.name)
        // },
        grid: {
            left: '3%',
            right: '15%',
            bottom: '3%',
            containLabel: true,
            show: false,
            backgroundColor: '#fff'
        },
        toolbox: {
            show: true,
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'time',
            boundaryGap: false,
            splitNumber: 5,
            axisLabel: {
                formatter: function (value, index) {
                    const date = new Date(value);
                    return `${date.getHours()}/${date.getMinutes()}`
                }
            }
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '20%'],
            axisLabel: {
                formatter: function (value, index) {
                    const formatter = !!formatters[unit] ? formatters[unit] : (v) => v;
                    return formatter(value);
                }
            }
        },
        legend: {
            show: true,
            orient: 'vertical',
            left: 'right',
            data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine'],
        },
        series: dataSet.map(item => {
            return {
                name: nameOf(item.metric),
                type: 'line',
                smooth: true,
                symbol: 'none',
                xAxis: {
                    type: 'time',
                    boundaryGap: false
                },
                yAxis: {
                    type: 'value',
                    boundaryGap: [0, '100%']
                },
                /**
                 * data is an array that contains a list of arrays:
                 * [
                 *     [1714492874.299,"1.3555555555555554"],
                 *     [1714492888.299,"1.2444444444444442"]
                 * ]
                 *
                 * The inner array has two item, the first item is timestamp in unix milliseconds, and second item is the value
                 */
                data: item.values.map(value => {
                    const timestampInUnixSeconds = value[0];
                    let number = value[1] === "NaN" ? 0 : value[1];

                    switch (unit) {
                        case SUPPORTED_UNITS.second : {
                            number = number * 1000;
                            break;
                        }
                    }

                    return [
                        timestampInUnixSeconds,
                        Math.floor(number * 100) / 100
                    ]
                })
            }
        })
    };
}

// END

export default buildEchartOption;
export {SUPPORTED_UNITS as UNITS};