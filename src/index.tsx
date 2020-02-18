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
    //Quick,
    Heap
}

const AvailableAlghoritms: [Alghoritm, string][] = [
    [Alghoritm.Bouble, "Bouble Sort"],
    //[Alghoritm.Quick, "Quick Sort"],
    [Alghoritm.Heap, "Heap Sort"]
]

type selectedSort = {alghoritm: Alghoritm, data: BarChartData[], animations: Animation[]} | null

function App() {
    const [barChartData, setBarChartData] = useState<selectedSort[]>([null, null]);
    const [values, setValues] = useState<number[]>([]);
    const [dataLen, setDataLen] = useState(10);
    const [wasm, setWasm] = useState();
    const [step, setStep] = useState(0);
    const handleSizeChange = (_event: any, newValue: number | number[]) => {
        if (typeof(newValue) === "number" && newValue != dataLen) {
            setDataLen(newValue);
            generateNewArray(newValue);
        }
    };
    const reset = () => {
        generateNewArray(dataLen)
        setStep(0)
    }
    const handleStepChange = (_event: any, newValue: number | number[]) => {
        if (typeof(newValue) === "number" && newValue != step) {
            setStep(newValue)
            change_animation(newValue, barChartData)
        }
    };
    const generateNewArray = (len: number) => {
        let data = generateRandomArray(len, 10)
        setValues(data)
        setStep(0)
        setBarChartData(updateData(data, barChartData))
    }
    const updateData = (data: number[], oldBarChartData: selectedSort[]): selectedSort[] => {
        let newBarChartData = oldBarChartData.slice()
        newBarChartData.map((el) => {
            if (el === null) return
            el.data = data.map((v) => { return { value: v, color: BarColor.Normal } })
            el.animations = generateAnimations(data, el.alghoritm)
        })
        return newBarChartData
    };
    const classes = useStyles();
    React.useEffect(() => {
        import("../sorting_rust/pkg/sorting")
        .then(wasm => {
            wasm.init()
            setWasm(wasm)
        })
    },[])
    const generateAnimations = (data: number[], alghoritm: Alghoritm): Animation[] => {
        let arr = Int32Array.from(data)
        switch (alghoritm) {
            case Alghoritm.Heap: {
                return wasm.heap_sort(arr) as Animation[]
            }
            case Alghoritm.Bouble: {
                return wasm.bouble_sort(arr) as Animation[]
            }
        }
    }
    const selectAlghoritm = (alghoritm: Alghoritm | null, idx: number) => {
        let newData = barChartData.slice()
        if (alghoritm === null) {
            newData[idx] = null;
        } else {
            newData[idx] = {alghoritm, data: [], animations: []}
            newData = updateData(values, newData)
        }
        setBarChartData(newData)
        change_animation(step, newData)
    }
    const change_animation = (idx: number, barChartData: selectedSort[]) => {
        let newBarChartData = barChartData.slice()
        for (let sort of newBarChartData) {
            if (sort == null) continue
            let myIdx = Math.min(sort.animations.length -1,idx)
            let animations = sort.animations
            let newData = values.map((v) => {
                let p = {value: v, color: BarColor.Normal}
                return p
            });
            if (animations.length > 0) {
                for (let i=0;i<myIdx;i++) {
                    let animation = animations[i]
                    if (animation.Swap != null) {
                        let idx1=animation.Swap[0];
                        let idx2=animation.Swap[1];
                        [newData[idx1].value,newData[idx2].value] = [newData[idx2].value,newData[idx1].value]
                    }
                }
                let animation = animations[myIdx]
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
            }
            sort.data = newData
        }
        setBarChartData(newBarChartData)
    }
    let maxStep = barChartData.reduce((max,v) => {
        if (v === null) return max
        return Math.max(v.animations.length, max)
    }, 0)
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
                                     onChange={handleStepChange}
                                     aria-labelledby="discrete-slider"
                                     valueLabelDisplay="auto"
                                     step={1}
                                     min={0}
                                     max={maxStep}
                                     value={step}
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
                                     onChange={handleSizeChange}
                                     aria-labelledby="discrete-slider"
                                     valueLabelDisplay="auto"
                                     step={1}
                                     min={10}
                                     max={100}
                                     value={dataLen}
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
                             <Button aria-label="Animate" onClick={reset}>
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
