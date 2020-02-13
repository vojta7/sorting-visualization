import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const barChartStyles = makeStyles(()=> createStyles(
  {
    bar: {
      display: "inline-block",
      backgroundColor: "rebeccapurple",
      width: 20
    },
  }
));

export interface BarChartProps { data: Array<number> }

export function BarChart(props: BarChartProps) {
    let classes = barChartStyles();
      return (
        <ul>
            {props.data.map((value, idx) => (
              <div
                className={classes.bar}
                key={idx}
                style={{
                  height: `${value * 10}px`,
                }}></div>
            ))}
        </ul>
      )
}
