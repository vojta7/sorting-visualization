import * as React from "react";
import {useState} from "react";
import * as ReactDOM from "react-dom";
import {BarChart, BarChartData, BarColor} from "./components/bar_chart";
import {SliderWithButtons} from "./components/slider_with_buttons";
import {PauseButton} from "./components/pause_button";
import {
    Box,
    Button,
    Container,
    CssBaseline,
    FormControlLabel,
    Grid,
    Slider,
    Switch,
    ThemeProvider,
    Typography
} from '@material-ui/core';
import ReplayIcon from '@material-ui/icons/Replay';
import {createMuiTheme, createStyles, makeStyles} from '@material-ui/core/styles';

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
    let wasm = await import("../sorting_rust/pkg/sorting");
    wasm.init();
    ReactDOM.render(<App wasm={wasm}/>, document.getElementById("root"));
}

run();

interface Animation {
    Swap?: [number, number]
    Compare?: [number, number]
    Set?: [number, number]
}

const useStyles = makeStyles(() =>
    createStyles({
        content: {
            "min-height": "100vh",
            padding: "20px 0 20px 0"
        },
        heading: {
            "text-align": "center"
        },
        header: {
            "min-height": "calc(100vh/5)",
        },
        chart: {
            "min-height": "calc(100vh/4)", //TODO
            height: "16em",
            border: "solid 1px black"
        },
        input: {
            width: 42,
        },
    }),
);

export enum Algorithm {
    Bouble,
    Quick,
    Heap,
    Merge,
    Shake,
    Heap2,
}

const AvailableAlgorithms: Map<Algorithm, string> = new Map([
    [Algorithm.Quick, "Quicksort"],
    [Algorithm.Merge, "Merge sort"],
    [Algorithm.Heap, "Heapsort"],
    [Algorithm.Heap2, "Heapsort (Floyd's heap construction)"],
    [Algorithm.Bouble, "Bouble sort"],
    [Algorithm.Shake, "Shake sort"],
]);

type ApplicationData = ({ algorithm: Algorithm, data: BarChartData[], animations: Animation[] } | null)[]

const minDataLen: number = 10;
const maxDataLen: number = 100;

const maxAnimationTimeout: number = 500;
const minAnimationTimeout: number = 5;

function App(props: { wasm: any }) {
    const [applicationData, setApplicationData] = useState<ApplicationData>([null, null]);
    const [values, setValues] = useState<number[]>([]);
    const [running, setRunning] = useState(false);
    const [animationTimeout, setAnimationTimeout] = useState(maxAnimationTimeout - 100);
    const [dataLen, setDataLen] = useState(minDataLen);
    const [step, setStep] = useState(0);
    const [darkThemeOn, setDarkThemeOn] = useState(false);
    const classes = useStyles(darkTheme);

    React.useEffect(() => {
        generateNewArray(dataLen)
    }, []);

    const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDarkThemeOn(event.target.checked)
    };
    const dataLenRef = React.useRef(dataLen);
    dataLenRef.current = dataLen;
    const handleSizeIncrease = (increase: number) => {
        let newLen = dataLenRef.current + increase;
        if (newLen <= maxDataLen && newLen >= minDataLen) {
            setDataLen(newLen);
            generateNewArray(newLen);
        }
    };
    const handleSizeChange = (_event: any, newValue: number | number[]) => {
        if (typeof (newValue) === "number" && newValue != dataLen) {
            if (newValue <= maxDataLen && newValue >= minDataLen) {
                setDataLen(newValue);
                generateNewArray(newValue);
            }
        }
    };
    const handleSpeedChange = (_event: any, newValue: number | number[]) => {
        if (typeof (newValue) === "number") {
            setAnimationTimeout(newValue);
        }
    };
    const handleStepChange = (_event: any, newValue: number | number[]) => {
        if (typeof (newValue) === "number" && newValue != step) {
            setStep(newValue);
            setApplicationData(changeToAnimationFrame(newValue, applicationData, values))
        }
    };
    const runningRef = React.useRef(running);
    runningRef.current = running;
    const stepRef = React.useRef(step);
    stepRef.current = step;
    const applicationDataRef = React.useRef(applicationData);
    applicationDataRef.current = applicationData;
    const animationTimeoutRef = React.useRef(animationTimeout);
    animationTimeoutRef.current = animationTimeout;
    const valuesRef = React.useRef(values);
    valuesRef.current = values;
    const toggleAnimation = (start: boolean) => {
        setRunning(start);
        runningRef.current = start;
        if (start) animate()
    };

    const animate = () => {
        if (!runningRef.current) return;
        const maxLen = applicationDataRef.current.reduce((max, v) => {
            if (v === null) return max;
            return Math.max(v.animations.length, max)
        }, 0);
        if (stepRef.current >= maxLen) {
            setRunning(false);
            return;
        }
        setApplicationData(changeToAnimationFrame(stepRef.current, applicationDataRef.current, valuesRef.current));
        setStep(stepRef.current + 1);
        setTimeout(animate, maxAnimationTimeout - animationTimeoutRef.current)
    };

    const shiftFrame = (amount: number) => {
        if (stepRef.current + amount < 0) return;
        setRunning(false);
        changeToAnimationFrame(stepRef.current + amount, applicationDataRef.current, valuesRef.current);
        setStep(stepRef.current + amount)
    };

    const reset = () => {
        setRunning(false);
        generateNewArray(dataLen);
        setStep(0)
    };

    const generateNewArray = (len: number) => {
        const data = generateRandomArray(len, 2 * len);
        setValues(data);
        setStep(0);
        setApplicationData(updateData(data, applicationData, props.wasm))
    };

    const selectAlgorithm = (algorithm: Algorithm | null, idx: number) => {
        let newData = applicationData.slice();
        if (algorithm === null) {
            newData[idx] = null;
        } else {
            newData[idx] = {algorithm, data: [], animations: []};
            newData = updateData(values, newData, props.wasm)
        }
        setApplicationData(changeToAnimationFrame(step, newData, values))
    };

    const maxStep = applicationData.reduce((max, v) => {
        if (v === null) return max;
        return Math.max(v.animations.length, max)
    }, 0);

    return (
        <ThemeProvider theme={darkThemeOn ? darkTheme : lightTheme}>
            <CssBaseline/>
            <Box className={classes.content} height="100%">
                <Container maxWidth={false} className={classes.header}>
                    <Grid container spacing={2}>
                        <Grid item xs={2}/>
                        <Grid item xs={8}>
                            <Typography variant="h3" component="h1" className={classes.heading}>Visualization of sorting
                                algorithms</Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <FormControlLabel
                                control={<Switch
                                    onChange={handleThemeChange}
                                    value={darkThemeOn}
                                />}
                                label="Dark theme"
                            />
                        </Grid>
                        <Grid item xs={1}/>
                        <Grid item xs={6} container>
                            <SliderWithButtons
                                name="steps"
                                xs={12}
                                step={1}
                                min={0}
                                max={maxStep}
                                value={step}
                                handleSliderChange={handleStepChange}
                                handleButtonPress={shiftFrame}
                            />
                            <SliderWithButtons
                                name="size"
                                xs={12}
                                step={1}
                                min={10}
                                max={100}
                                value={dataLen}
                                handleSliderChange={handleSizeChange}
                                handleButtonPress={handleSizeIncrease}
                            />
                        </Grid>
                        <Grid item xs={4} container alignContent="center">
                            <Grid item xs={12} container spacing={2}>
                                <Grid item xs={3}><Typography variant="subtitle2">speed</Typography></Grid>
                                <Grid item xs={8}>
                                    <Slider
                                        onChange={handleSpeedChange}
                                        aria-labelledby="discrete-slider"
                                        valueLabelDisplay="off"
                                        value={animationTimeout}
                                        step={5}
                                        min={0}
                                        max={maxAnimationTimeout - minAnimationTimeout}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item xs={12} container spacing={2}>
                                <Grid item xs={3}/>
                                <Grid item xs={4}>
                                    <PauseButton running={running} onClick={toggleAnimation}/>
                                </Grid>
                                <Grid item xs={4}>
                                    <Button aria-label="Animate" onClick={reset}>
                                        <ReplayIcon fontSize="large"/>
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
                {applicationData.map((chartData, idx) => (
                    <Container className={classes.chart} maxWidth={false} key={idx}>
                        <BarChart
                            data={chartData !== null ? chartData.data : null}
                            algorithms={AvailableAlgorithms}
                            onSelect={(algorithm) => selectAlgorithm(algorithm, idx)}
                            heading={chartData !== null ? AvailableAlgorithms.get(chartData.algorithm) : undefined}
                        />
                    </Container>
                ))}
            </Box>
        </ThemeProvider>
    )
}

function generateRandomArray(len: number, max: number): Array<number> {
    const arr = new Array();
    for (let i = 0; i < len; i++) {
        const n = Math.floor((Math.random() * max) + 1);
        arr.push(n)
    }
    return arr
}

function generateAnimations(data: number[], algorithm: Algorithm, functions: any): Animation[] {
    const arr = Int32Array.from(data);
    switch (algorithm) {
        case Algorithm.Heap: {
            return functions.heap_sort(arr) as Animation[]
        }
        case Algorithm.Quick: {
            return functions.quick_sort(arr) as Animation[]
        }
        case Algorithm.Merge: {
            return functions.merge_sort(arr) as Animation[]
        }
        case Algorithm.Bouble: {
            return functions.bouble_sort(arr) as Animation[]
        }
        case Algorithm.Shake: {
            return functions.shake_sort(arr) as Animation[]
        }
        case Algorithm.Heap2: {
            return functions.heap_sort2(arr) as Animation[]
        }
    }
}

function updateData(data: number[], oldApplicationData: ApplicationData, functions: any): ApplicationData {
    const newBarChartData = oldApplicationData.slice();
    newBarChartData.map((el) => {
        if (el === null) return;
        el.data = data.map((v) => {
            return {value: v, color: BarColor.Normal}
        });
        el.animations = generateAnimations(data, el.algorithm, functions)
    });
    return newBarChartData
};

function changeToAnimationFrame(idx: number, applicationData: ApplicationData, values: number[]): ApplicationData {
    const newApplicationData = applicationData.slice();
    for (const sort of newApplicationData) {
        if (sort === null) continue;
        const myIdx = Math.min(sort.animations.length - 1, idx);
        const animations = sort.animations;
        let resetColor = myIdx < idx || myIdx == sort.animations.length - 1 ? BarColor.Finished : BarColor.Normal;
        const newData = values.map((v) => {
            const p = {value: v, color: resetColor};
            return p
        });
        if (animations.length > 0) {
            let lastCompare = null;
            for (let i = 0; i < myIdx; i++) {
                const animation = animations[i];
                if (animation.Swap !== null) {
                    applySwap(animation.Swap[0], animation.Swap[1], newData)
                } else if (animation.Compare !== null) {
                    lastCompare = animation.Compare
                } else if (animation.Set !== null) {
                    newData[animation.Set[0]].value = animation.Set[1]
                }
            }
            const animation = animations[myIdx];
            if (animation.Compare !== null && myIdx != sort.animations.length - 1) {
                applyCompare(animation.Compare[0], animation.Compare[1], newData)
            } else if (animation.Swap !== null) {
                if (lastCompare !== null && myIdx != sort.animations.length - 1) {
                    applyCompare(lastCompare[0], lastCompare[1], newData)
                }
                applySwap(animation.Swap[0], animation.Swap[1], newData)
            } else if (animation.Set !== null) {
                newData[animation.Set[0]].value = animation.Set[1]
            }
        }
        sort.data = newData
    }
    return newApplicationData
}

function applyCompare(idx1: number, idx2: number, data: BarChartData[]) {
    console.log(`${idx1} ${idx2}`);
    data[idx1].color = BarColor.Compare;
    data[idx2].color = BarColor.Compare
}

function applySwap(idx1: number, idx2: number, data: BarChartData[]) {
    [data[idx1].value, data[idx2].value] = [data[idx2].value, data[idx1].value]
}
