import * as React from "react";
import * as ReactDOM from "react-dom";
import {MainBar} from "./components/menu";

async function run() {
    const wasm = await import("../sorting_rust/pkg/sorting");

    let arr = [2,1,5,4,3]
    let arri32 = Int32Array.from(arr);
    //let animations = wasm.bouble_sort(arr);
    let array = arr.map( (n, _idx) => <li>{ n.toString() }</li> );
    ReactDOM.render(
        <div>
            <MainBar />
            <ul>
                { array }
            </ul>
        </div>
        , document.getElementById("root"));
}

run()
