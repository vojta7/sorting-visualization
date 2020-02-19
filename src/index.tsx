import * as React from "react";
import {useState} from "react";
import * as ReactDOM from "react-dom";
import {BarChartData, BarColor, BarChart} from "./components/bar_chart";
import {PauseButton} from "./components/pause_button";
import {FormControlLabel, Switch,CssBaseline, ThemeProvider, Button, Typography, Slider, Container, Box, Grid} from '@material-ui/core';
import ReplayIcon from '@material-ui/icons/Replay';
import { createMuiTheme, makeStyles, createStyles } from '@material-ui/core/styles';

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const lightTheme = createMuiTheme({
  palette: {
    type: 'light',
  },
});

async function run() {
    let wasm = await import("../sorting_rust/pkg/sorting")
    wasm.init()
    ReactDOM.render(<App wasm={wasm}/>, document.getElementById("root"));
}

run()

interface Animation {
    Swap?: [number, number]
    Compare?: [number, number]
}

const useStyles = makeStyles(() =>
  createStyles({
      content: {
          "min-height": "100vh"
      },
      heading: {
          "text-align": "center"
      },
      header: {
          "min-height": "calc(100vh/3)"
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

const AvailableAlghoritms: Map<Alghoritm, string> = new Map([
    [Alghoritm.Bouble, "Bouble Sort"],
    //[Alghoritm.Quick, "Quick Sort"],
    [Alghoritm.Heap, "Heap Sort"],
])

type ApplicationData = ({algorithm: Alghoritm, data: BarChartData[], animations: Animation[]} | null)[]

function App(props: {wasm: any}) {
    const [applicationData, setApplicationData] = useState<ApplicationData>([null, null]);
    const [values, setValues] = useState<number[]>([]);
    const [running, setRunning] = useState(false);
    const [animationTimeout, setAnimationTimeout] = useState(100);
    const [dataLen, setDataLen] = useState(10);
    const [step, setStep] = useState(0);
    const [darkThemeOn, setDarkThemeOn] = useState(false);
    const classes = useStyles(darkTheme);

    React.useEffect(() => {
        generateNewArray(dataLen)
    },[])

    const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDarkThemeOn(event.target.checked)
    };
    const handleSizeChange = (_event: any, newValue: number | number[]) => {
        if (typeof(newValue) === "number" && newValue != dataLen) {
            setDataLen(newValue);
            generateNewArray(newValue);
        }
    };
    const handleSpeedChange = (_event: any, newValue: number | number[]) => {
        if (typeof(newValue) === "number") {
            setAnimationTimeout(newValue);
        }
    };
    const handleStepChange = (_event: any, newValue: number | number[]) => {
        if (typeof(newValue) === "number" && newValue != step) {
            setStep(newValue)
            setApplicationData(changeToAnimationFrame(newValue, applicationData, values))
        }
    };

    const runningRef = React.useRef(running)
    runningRef.current = running
    const stepRef = React.useRef(step)
    stepRef.current = step
    const applicationDataRef = React.useRef(applicationData)
    applicationDataRef.current = applicationData
    const animationTimeoutRef = React.useRef(animationTimeout)
    animationTimeoutRef.current = animationTimeout
    const toggleAnimation = (start: boolean) => {
        setRunning(start)
        runningRef.current = start
        if (start) animate()
    }

    const animate = () => {
        if (!runningRef.current) return
        const maxLen = applicationDataRef.current.reduce((max,v) => {
            if (v === null) return max
            return Math.max(v.animations.length, max)
        }, 0)
        if (stepRef.current >= maxLen) {
            setRunning(false)
            return;
        }
        setApplicationData(changeToAnimationFrame(stepRef.current, applicationDataRef.current, values))
        setStep(stepRef.current +1)
        setTimeout(animate,animationTimeoutRef.current)
    }

    const reset = () => {
        setRunning(false)
        generateNewArray(dataLen)
        setStep(0)
    }

    const generateNewArray = (len: number) => {
        const data = generateRandomArray(len, 2*len)
        setValues(data)
        setStep(0)
        setApplicationData(updateData(data, applicationData, props.wasm))
    }

    const selectAlghoritm = (algorithm: Alghoritm | null, idx: number) => {
        let newData = applicationData.slice()
        if (algorithm === null) {
            newData[idx] = null;
        } else {
            newData[idx] = {algorithm, data: [], animations: []}
            newData = updateData(values, newData, props.wasm)
        }
        setApplicationData(changeToAnimationFrame(step, newData, values))
    }

    const maxStep = applicationData.reduce((max,v) => {
        if (v === null) return max
        return Math.max(v.animations.length, max)
    }, 0)

    return (
        <ThemeProvider theme={darkThemeOn?darkTheme:lightTheme}>
          <CssBaseline />
          <Box className={classes.content} height="100%">
            <Container maxWidth={false} className={classes.header}>
                <Box mt={1} mb={1}>
                 <Grid container spacing={2}>
                     <Grid item xs={2}/>
                     <Grid item xs={8}>
                         <Typography variant="h3" component="h1" className={classes.heading}>Visualization of sorting alghoritms</Typography>
                     </Grid>
                     <Grid item xs={2}>
                     <FormControlLabel
                          control={<Switch
                            onChange={handleThemeChange}
                            value={darkThemeOn}
                          />}
                          label="DarkTheme"
                     />
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
                                     onChange={handleSpeedChange}
                                     aria-labelledby="discrete-slider"
                                     valueLabelDisplay="auto"
                                     value={animationTimeout}
                                     step={5}
                                     min={5}
                                     max={1000}
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
                            <PauseButton running={running} onClick={toggleAnimation} />
                         </Grid>
                         <Grid item xs={6}>
                            <Button aria-label="Animate" onClick={reset}>
                                <ReplayIcon fontSize="large" />
                            </Button>
                         </Grid>
                     </Grid>
                </Grid>
               </Box>
            </Container>
            {applicationData.map((chartData, idx) => (
                <Container className={classes.chart} maxWidth={false} key={idx}>
                <BarChart
                    data={chartData != null ? chartData.data : null}
                    alghoritms={AvailableAlghoritms}
                    onSelect={(alghoritm)=>selectAlghoritm(alghoritm, idx)}
                    heading={chartData != null ? AvailableAlghoritms.get(chartData.algorithm) : undefined}
                    />
                </Container>
            ))}
          </Box>
      </ThemeProvider>
    )
}

function generateRandomArray(len: number, max: number): Array<number> {
    const arr = new Array()
    for (let i=0;i<len;i++) {
        const n = Math.floor((Math.random() * max) + 1);
        arr.push(n)
    }
    return arr
}

function generateAnimations(data: number[], alghoritm: Alghoritm, functions: any): Animation[] {
    const arr = Int32Array.from(data)
    switch (alghoritm) {
        case Alghoritm.Heap: {
            return functions.heap_sort(arr) as Animation[]
        }
        case Alghoritm.Bouble: {
            return functions.bouble_sort(arr) as Animation[]
        }
    }
}

function updateData(data: number[], oldApplicationData: ApplicationData, functions: any): ApplicationData {
    const newBarChartData = oldApplicationData.slice()
    newBarChartData.map((el) => {
        if (el === null) return
            el.data = data.map((v) => { return { value: v, color: BarColor.Normal } })
        el.animations = generateAnimations(data, el.algorithm, functions)
    })
    return newBarChartData
};

function changeToAnimationFrame(idx: number, applicationData: ApplicationData, values: number[]): ApplicationData {
    const newApplicationData = applicationData.slice()
    for (const sort of newApplicationData) {
        if (sort == null) continue
            const myIdx = Math.min(sort.animations.length -1,idx)
        const animations = sort.animations
        const newData = values.map((v) => {
            const p = {value: v, color: BarColor.Normal}
            return p
        });
        if (animations.length > 0) {
            for (let i=0;i<myIdx;i++) {
                const animation = animations[i]
                if (animation.Swap != null) {
                    const idx1=animation.Swap[0];
                    const idx2=animation.Swap[1];
                    [newData[idx1].value,newData[idx2].value] = [newData[idx2].value,newData[idx1].value]
                }
            }
            const animation = animations[myIdx]
            if (animation.Compare != null) {
                const idx1=animation.Compare[0];
                const idx2=animation.Compare[1];
                newData[idx1].color = BarColor.CompareLeft
                newData[idx2].color = BarColor.CompareRight
            } else if (animation.Swap != null) {
                const idx1=animation.Swap[0];
                const idx2=animation.Swap[1];
                [newData[idx1].value,newData[idx2].value] = [newData[idx2].value,newData[idx1].value]
            }
        }
        sort.data = newData
    }
    return newApplicationData
}
