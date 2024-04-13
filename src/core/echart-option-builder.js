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
    if(value > tb) {
        return `${(value / tb).toFixed(2)} TB`;
    }
    if(value > gb) {
        return `${(value / gb).toFixed(2)} GB`;
    }
    if(value > mb) {
        return `${(value / mb).toFixed(2)} MB`;
    }
    if(value > kb) {
        return `${(value / kb).toFixed(2)} KB`;
    }
    return `${(value / kb).toFixed(2)} B`;
};

formatters[SUPPORTED_UNITS.percent_0_to_1] = (value) => {
    return `${(parseFloat(value) * 100).toFixed(2)}%`;
}

formatters[SUPPORTED_UNITS.second] = (value) => {
    return `${value * 1000}ms`
}

formatters[SUPPORTED_UNITS.number] = (value) => {
    return `${value}`
}

function buildEchartOption(dataSet, options) {
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
    const option = {
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
        // title: {
        //     left: 'center',
        //     text: title,
        //     textStyle: {
        //         fontSize: 24,
        //         fontWeight: 'bold',
        //     },
        //     subtext: subtitle
        // },
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
            show: false,
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
        series: dataSet.map(data => {
            const now = Date.now();
            const dataSet = {
                name: 'pod-name_container_name',
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
                data: [
                    [now, Math.floor(Math.random() * 10)],
                    [now + 1000, Math.floor(Math.random() * 10)],
                    [now + 2000, Math.floor(Math.random() * 10)],
                    [now + 3000, Math.floor(Math.random() * 10)],
                    [now + 4000, Math.floor(Math.random() * 10)],
                    [now + 5000, Math.floor(Math.random() * 10)],
                    [now + 6000, Math.floor(Math.random() * 10)]
                ]
            }
            return dataSet
        })
    };

    return option;
}

// END

export default buildEchartOption;
export {SUPPORTED_UNITS as UNITS};