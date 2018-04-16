export interface StackedChartData {
    historyLength: number,
    ticks: (String|number)[],
    colors: {},
    data: (String|number)[][]
}

export interface DataPoint {
    id: String,
    name: String,
    count: number
}
