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
    //const wasm = await import("../sorting_rust/pkg/sorting");

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
    return (
          <div className={classes.root}>
            <CssBaseline />
            <AppBar className={classes.appBar}>
              <Toolbar>
                <Typography variant="h6" className={classes.title}>
                  Sorting visualization
                </Typography>
                <Button color="inherit" className={classes.sort}>Sort</Button>
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

function generateRandomArray(len: number, max: number): Array<number> {
    let arr = new Array()
    for (let i=0;i<len;i++) {
        let n = Math.floor((Math.random() * max) + 1);
        arr.push(n)
    }
    return arr
}

run()
