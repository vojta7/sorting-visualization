import * as React from "react";
import {useState} from "react";
import * as ReactDOM from "react-dom";
import {BarChartData, BarColor, BarChart} from "./components/bar_chart";
import {Button, MenuItem, Slider, Drawer, CssBaseline} from '@material-ui/core';
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
    root: {
      display: 'flex',
    },
    title: {
      flexGrow: 2,
    },
    sort: {
      flexGrow: 1,
    },
    randomize: {
      flexGrow: 1,
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(11),
    },
    toolbar: theme.mixins.toolbar,
  }),
);

enum Alghoritm {
    Bouble,
    Quick
}

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

function App() {
    const [barChartData, setBarChartData] = useState<BarChartData[]>([]);
    const [values, setValues] = useState<number[]>([]);
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
        setBarChartData(barData)
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
        setBarChartData(newData)
    }
    return (
          <div className={classes.root}>
            <CssBaseline />
            <AppBar className={classes.appBar}>
              <Toolbar>
                <Typography variant="h6" className={classes.title}>
                  Visualization of sorting algorithms
                </Typography>
                <Slider
                  defaultValue={0}
                  aria-labelledby="discrete-slider-small-steps"
                  step={1}
                  marks
                  min={0}
                  onChange={stepAnimation}
                  max={animations != null ? animations.length : 0}
                  valueLabelDisplay="auto"
                />
                <Button
                    color="inherit"
                    className={classes.randomize}
                    onClick={randomizeArray}
                >Randomize</Button>
              </Toolbar>
            </AppBar>
            <Drawer
              className={classes.drawer}
              variant="persistent"
              anchor="left"
              open={true}
              classes={{
                paper: classes.drawerPaper,
              }}
            >
                <div className={classes.toolbar} />
                <Slider
                    color='secondary'
                    defaultValue={10}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    onChange={handleSliderChange}
                    step={1}
                    min={10}
                    max={100}
                />
                <CustomizedSelects />
            </Drawer>
            <main className={classes.content}>
                <BarChart data={barChartData}/>
            </main>
          </div>
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
