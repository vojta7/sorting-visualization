import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';

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
    }
  }
));

export enum BarColor {
    Normal,
    CompareLeft,
    CompareRight,
}

export interface BarChartData { value: number,color: BarColor }
export interface BarChartProps { data: BarChartData[] }

export function BarChart(props: BarChartProps) {
    let classes = barChartStyles();
    return (
      <ul>
      {props.data
          .map(({value, color}, idx) => {
              let classname;
              if (color == BarColor.CompareLeft) {classname = classes.compare1}
              else if (color == BarColor.CompareRight) {classname = classes.compare2}
              else {classname = classes.normal}
           return (
            <div
              className={`${classes.bar} ${classname}`}
              key={idx}
              style={{
                height: `${value * 10}px`,
              }}></div>
          )})}
      </ul>
    )
}
