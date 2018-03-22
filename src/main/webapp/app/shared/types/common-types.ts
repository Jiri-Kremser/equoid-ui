export interface StackedChartData {
    historyLength: Number,
    ticks: (String|Number)[],
    colors: {},
    data: (String|Number)[][]
}

export interface DataPoint {
    id: String,
    name: String,
    count: Number
}
