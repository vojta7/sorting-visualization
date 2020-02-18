import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {List, ListItem, ListItemText, Dialog, Fab } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CloseIcon from '@material-ui/icons/Close';
import {useState} from "react";
import {Alghoritm} from '../index'

const barChartStyles = makeStyles(()=> createStyles(
  {
    bar: {
      display: "inline-block",
      width: 20,
      "margin-right": 5,
      "vertical-align": "bottom"
    },
    compare1: {
      backgroundColor: "red",
    },
    compare2: {
      backgroundColor: "blue",
    },
    normal: {
      backgroundColor: "rebeccapurple",
    },
    root: {
        position: 'relative',
        height: '100%'
    },
    close: {
        margin: 0,
        right: 20,
        top: 20,
        left: 'auto',
        position: 'absolute'
    },
    select: {
        margin: 0,
        left: '50%',
        top: '50%',
        right: 'auto',
        position: 'absolute',
        transform: 'translate(-50%, -50%)'
    }
  }
));

export enum BarColor {
    Normal,
    CompareLeft,
    CompareRight,
}

export interface BarChartData { value: number,color: BarColor }
export interface BarChartProps {
    data: BarChartData[] | null,
    onSelect: (arg1: Alghoritm | null) => void,
    alghoritms: [Alghoritm, string][]
}

export function BarChart(props: BarChartProps) {
    console.log(props)
    if (props.data != null) {
        return (<BarChartInner data={props.data} onSelect={props.onSelect} />)
    } else {
        return (<SelectSort onSelect={props.onSelect} alghoritms={props.alghoritms} />)
    }
}

function SelectSort(props: {alghoritms: [Alghoritm, string][], onSelect: (arg1: Alghoritm | null) => void}) {
    let classes = barChartStyles();
    let [open, setOpen] = useState(false);
    const openAlgSelection = (_event: any) => {
        setOpen(true)
    }
    return (
        <div className={classes.root}>
            <Dialog open={open} >
                <List>
                    {props.alghoritms.map(([al, name]) => (
                        <ListItem button key={al.toString()} onClick={()=>{
                            setOpen(false)
                            props.onSelect(al)
                        }}>
                        <ListItemText primary={name} />
                        </ListItem>
                    ))}
                </List>
            </Dialog>
            <Fab className={classes.select} color="secondary" aria-label="add new sort">
                <AddCircleIcon fontSize="large" onClick={openAlgSelection} />
            </Fab>
        </div>
    )
}


function BarChartInner(props: {data: BarChartData[], onSelect: (arg1: Alghoritm | null) => void}) {
    let classes = barChartStyles();
        return (
          <div className={classes.root}>
              <Fab className={classes.close} color="secondary" aria-label="remove alghoritm" onClick={() => props.onSelect(null)} >
                <CloseIcon fontSize="large" />
              </Fab>
              <ul>
              {props.data
                  .map(({value, color}, idx) => {
                      let barClass;
                      if (color == BarColor.CompareLeft) {barClass = classes.compare1}
                      else if (color == BarColor.CompareRight) {barClass = classes.compare2}
                      else {barClass = classes.normal}
                      let className = classes.bar + " " + barClass
                   return (
                    <div
                      className={className}
                      key={idx}
                      style={{
                        height: `${value * 10}px`,
                      }}></div>
                  )})}
              </ul>
          </div>
        )
}
