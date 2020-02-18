import * as React from "react";
import {useState} from "react";
import * as ReactDOM from "react-dom";
import {BarChartData, BarColor, BarChart} from "./components/bar_chart";
import {Button, Typography, Slider, Container, Box, Grid} from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ReplayIcon from '@material-ui/icons/Replay';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

async function run() {
    ReactDOM.render(<App /> , document.getElementById("root"));
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
      content: {
          "min-height": "100vh"
      },
      heading: {
          "text-align": "center"
      },
      chart: {
          "height": "calc(100vh/3)", //TODO
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
    return (
          <Box className={classes.content} height="100%">
            <Container maxWidth={false}>
                 <Grid container spacing={2}>
                     <Grid item xs={12}>
                         <Typography variant="h3" component="h1" className={classes.heading}>Visualization of sorting alghoritms</Typography>
                     </Grid>
                     <Grid item xs={9} container>
                         <Grid item xs={12} container>
                             <Grid item xs={3}><Typography variant="subtitle2">Steps</Typography></Grid>
                             <Grid item xs>
                                 <Slider
                                     defaultValue={10}
                                     aria-labelledby="discrete-slider"
                                     valueLabelDisplay="auto"
                                     step={1}
                                     min={10}
                                     max={100}
                                 />
                             </Grid>
                         </Grid>
                         <Grid item xs={12} container>
                             <Grid item xs={3}><Typography variant="subtitle2">Speed</Typography></Grid>
                             <Grid item xs>
                                 <Slider
                                     defaultValue={10}
                                     aria-labelledby="discrete-slider"
                                     valueLabelDisplay="auto"
                                     step={1}
                                     min={10}
                                     max={100}
                                 />
                             </Grid>
                         </Grid>
                         <Grid item xs={12} container>
                             <Grid item xs={3}><Typography variant="subtitle2">Size</Typography></Grid>
                             <Grid item xs>
                                 <Slider
                                     defaultValue={10}
                                     aria-labelledby="discrete-slider"
                                     valueLabelDisplay="auto"
                                     step={1}
                                     min={10}
                                     max={100}
                                 />
                             </Grid>
                         </Grid>
                     </Grid>
                     <Grid item xs={3} container alignContent="center">
                         <Grid item xs={6}>
                             <Button aria-label="Animate">
                                 <PlayArrowIcon fontSize="large" />
                             </Button>
                         </Grid>
                         <Grid item xs={6}>
                             <Button aria-label="Animate">
                                 <ReplayIcon fontSize="large" />
                             </Button>
                         </Grid>
                     </Grid>
                </Grid>
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
