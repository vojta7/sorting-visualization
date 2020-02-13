import * as React from "react";
import * as ReactDOM from "react-dom";
import {MainBar} from "./components/menu";
import {BarChart} from "./components/bar_chart";

async function run() {
    const wasm = await import("../sorting_rust/pkg/sorting");

    let arr = [2,1,5,4,3]
    let arri32 = Int32Array.from(arr);
    let animations = wasm.bouble_sort(arri32);
    ReactDOM.render(
        <div>
            <MainBar />
            <BarChart data={arr} />
        </div>
        , document.getElementById("root"));
}

run()
