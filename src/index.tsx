import * as React from "react";
import {useState} from "react";
import * as ReactDOM from "react-dom";
import {BarChart} from "./components/bar_chart";
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
    const [data, setData] = useState(generateRandomArray(10,10));
    const [dataLen, setDataLen] = useState(10);
    const [wasm, setWasm] = useState();
    const handleSliderChange = (_event: any, newValue: number | number[]) => {
        if (typeof(newValue) === "number") {
            setDataLen(newValue);
            randomizeArray();
        }
    };
    const randomizeArray = () => {
        setData(generateRandomArray(dataLen, 10))
    };
    const classes = useStyles();
    React.useEffect(() => {
        import("../sorting_rust/pkg/sorting")
        .then(wasm => {
            wasm.init()
            setWasm(wasm)
        })
    },[])
    const tst = () => {
        wasm_test(wasm, data, setData)
    }
    return (
          <div className={classes.root}>
            <CssBaseline />
            <AppBar className={classes.appBar}>
              <Toolbar>
                <Typography variant="h6" className={classes.title}>
                  Sorting visualization
                </Typography>
                <Button
                    color="inherit"
                    className={classes.sort}
                    onClick={tst}
                >Sort</Button>
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
                <BarChart data={data}/>
            </main>
          </div>
    )
}

interface Animation {
    Swap?: [number, number]
    Compare?: [number, number]
}

function wasm_test(wasm: any, data: number[], setData: (n: React.SetStateAction<number[]>) => void) {
    let myData = data.slice()
    let arr = Int32Array.from(myData)
    let animations = wasm.bouble_sort(arr) as Animation[]
    let timeout = 100;
    for (let i=0;i<animations.length;i++) {
        let animation = animations[i];
        if (typeof(animation.Compare) !== "undefined") {
            console.log(`Compare ${animation.Compare[0]} and ${animation.Compare[1]}`)
        } else if (typeof(animation.Swap) !== "undefined") {
            console.log(`Swap ${animation.Swap[0]} and ${animation.Swap[1]}`)
            let tmp = myData[animation.Swap[0]]
            myData[animation.Swap[0]] = myData[animation.Swap[1]]
            myData[animation.Swap[1]] = tmp
        }
        let d = myData.slice()
        setTimeout(()=>{
            setData(d)
        }, timeout * i)
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
