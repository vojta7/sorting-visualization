import React from 'react';
import {Button, MenuItem} from '@material-ui/core';
import { createStyles, makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';

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
  const [alghoritm, setAlghoritm] = React.useState('');
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setAlghoritm(event.target.value as string);
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

const useStyles = makeStyles(
  createStyles({
    root: {
      flexGrow: 1,
    },
    title: {
      flexGrow: 2,
    },
    alghoritm: {
      flexGrow: 2,
    },
    sort: {
      flexGrow: 1,
    },
    randomize: {
      flexGrow: 1,
    }
  }),
);

interface MainBarProps { newData: ()=>void }
export function MainBar(props: MainBarProps) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Sorting visualization
          </Typography>
          <div className={classes.alghoritm}>
              <CustomizedSelects />
          </div>
          <Button color="inherit" className={classes.sort}>Sort</Button>
          <Button
              color="inherit"
              className={classes.randomize}
              onClick={props.newData}
          >Randomize</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
