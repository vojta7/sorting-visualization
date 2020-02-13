import * as React from "react";
import * as ReactDOM from "react-dom";
import {MainBar} from "./components/menu";
import {BarChart} from "./components/bar_chart";

async function run() {
    //const wasm = await import("../sorting_rust/pkg/sorting");

    ReactDOM.render(<App /> , document.getElementById("root"));
}

export interface IProps { }

interface IState {
    data: Array<number>;
}

class App extends React.Component<IProps,IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            data: generateRandomArray(10, 10)
        }
    }
    render() {
        return (
        <div>
        <MainBar newData={() => this.newRandomData()}/>
            <BarChart data={this.state.data} />
        </div>
        )
    }
    newRandomData() {
        this.setState({data: generateRandomArray(10, 10)})
    }
}

function generateRandomArray(len: number, max: number): Array<number> {
    let arr = new Array()
    for (let i=0;i<len;i++) {
        let n = Math.floor((Math.random() * max) + 1);
        arr.push(n)
    }
    return arr
}

run()
