import * as React from "react";
import {useState} from "react";
import * as ReactDOM from "react-dom";
import {BarChartData, BarColor, BarChart} from "./components/bar_chart";
import {List, ListItem, ListItemText, Dialog, Fab, Button, MenuItem, Slider, Drawer, CssBaseline, Container, Box, SvgIcon, IconButton} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CloseIcon from '@material-ui/icons/Close';
import { sizing } from '@material-ui/system';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';

async function run() {
    ReactDOM.render(<App /> , document.getElementById("root"));
}

const drawerWidth = 240;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
      content: {
          "min-height": "100vh"
      },
      menu: {
          "background-color": "red",
          "height": "calc(100vh/5)"
      },
      chart: {
          "height": "calc(100vh/5*2)",
          border: "solid 1px black"
      },
  }),
);

export enum Alghoritm {
    Bouble,
    Quick,
    Heap
}

const AvailableAlghoritms: [Alghoritm, string][] = [
    [Alghoritm.Bouble, "Bouble Sort"],
    [Alghoritm.Quick, "Quick Sort"],
    [Alghoritm.Heap, "Heap Sort"]
]

const alghoritmUseStyles = makeStyles(
  createStyles({
    label: {
        "margin-right": 20,
        "vertical-align": "super",
    },
  }),
);

function CustomizedSelects() {
  const classes = alghoritmUseStyles();
  const [alghoritm, setAlghoritm] = React.useState(Alghoritm.Bouble);
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setAlghoritm(event.target.value as Alghoritm);
  };
  return (
      <div>
        <span className={classes.label}>Select alghoritm</span>
        <Select
          labelId="alghoritm-select-label"
          id="alghoritm-select"
          value={alghoritm}
          onChange={handleChange}
        >
          <MenuItem value={Alghoritm.Bouble}>Bouble Sort</MenuItem>
          <MenuItem value={Alghoritm.Quick}>Quick Sort</MenuItem>
        </Select>
    </div>
  );
}

type selectedSort = {alghoritm: Alghoritm, data: BarChartData[]} | null

function App() {
    const [barChartData, setBarChartData] = useState<selectedSort[]>([null, null]);
    const [values, setValues] = useState<number[]>([1,2,1]);
    const [dataLen, setDataLen] = useState(10);
    const [wasm, setWasm] = useState();
    const [animations, setAnimations] = useState<Animation[] | null>(null);
    const handleSliderChange = (_event: any, newValue: number | number[]) => {
        if (typeof(newValue) === "number") {
            setDataLen(newValue);
            randomizeArray();
        }
    };
    const stepAnimation = (_event: any, newValue: number | number[]) => {
        if (typeof(newValue) === "number") {
            change_animation(newValue);
        }
    }
    const randomizeArray = () => {
        let data = generateRandomArray(dataLen, 10)
        let barData = data.map((d) => {
            let p = {value: d, color: BarColor.Normal}
            return p
        });
        setValues(data)
        //setBarChartData(barData) //TODO
        generate_animations(barData)
    };
    const classes = useStyles();
    React.useEffect(() => {
        import("../sorting_rust/pkg/sorting")
        .then(wasm => {
            wasm.init()
            setWasm(wasm)
        })
    },[])
    const generate_animations = (data: BarChartData[]) => {
        let myData = data.map(({value,}) => value).slice()
        let arr = Int32Array.from(myData)
        let animations = wasm.heap_sort(arr) as Animation[]
        console.log(animations);
        setAnimations(animations)
    }
    const selectAlghoritm = (alghoritm: Alghoritm | null, idx: number) => {
        let newData = barChartData.slice()
        if (alghoritm === null) {
            newData[idx] = null;
        } else {
            let tmp = values.map((v) => {
                let p = { value: v, color: BarColor.Normal}
                return p
            })
            newData[idx] = { alghoritm, data: tmp }
        }
        setBarChartData(newData)
        console.log(newData[idx])
    }
    const change_animation = (idx: number) => {
        if (animations == null || idx >= animations.length) return
        let newData = values.map((v) => {
            let p = {value: v, color: BarColor.Normal}
            return p
        });
        for (let i=0;i<idx;i++) {
            let animation = animations[i]
            if (animation.Swap != null) {
                let idx1=animation.Swap[0];
                let idx2=animation.Swap[1];
                [newData[idx1].value,newData[idx2].value] = [newData[idx2].value,newData[idx1].value]
            }
        }
        let animation = animations[idx]
        if (animation.Compare != null) {
            let idx1=animation.Compare[0];
            let idx2=animation.Compare[1];
            newData[idx1].color = BarColor.CompareLeft
            newData[idx2].color = BarColor.CompareRight
        } else if (animation.Swap != null) {
            let idx1=animation.Swap[0];
            let idx2=animation.Swap[1];
            [newData[idx1].value,newData[idx2].value] = [newData[idx2].value,newData[idx1].value]
        }
        //setBarChartData(newData)
    }
    let tmp = generateRandomArray(dataLen, 10)
    let tmpBarData = tmp.map((d) => {
        let p = {value: d, color: BarColor.Normal}
        return p
    });
    return (
          <Box className={classes.content} height="100%">
            <Container className={classes.menu} maxWidth={false}>
                TODO: menu
            </Container>
            {barChartData.map((chartData, idx) => (
                <Container className={classes.chart} maxWidth={false} key={idx}>
                <BarChart
                    data={chartData != null ? chartData.data : null}
                    alghoritms={AvailableAlghoritms}
                    onSelect={(alghoritm)=>selectAlghoritm(alghoritm, idx)} />
                </Container>
            ))}
          </Box>
    )
}

export interface Animation {
    Swap?: [number, number]
    Compare?: [number, number]
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
