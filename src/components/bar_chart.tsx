import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import {Animation} from '../index';

const barChartStyles = makeStyles(()=> createStyles(
  {
    bar: {
      display: "inline-block",
      backgroundColor: "rebeccapurple",
      width: 20
    },
    compare1: {
      backgroundColor: "red",
    },
    compare2: {
      backgroundColor: "blue",
    }
  }
));

export interface BarChartProps { data: number[], animations: Animation[] | null }

export function BarChart(props: BarChartProps) {
    let myData = props.data.slice()
    let timeout = 400;
    let classes = barChartStyles();
    if (props.animations !== null) {
        console.log(props.animations)
        const arrayBars = document.getElementsByClassName(classes.bar) as HTMLCollectionOf<HTMLElement>;
        let frame =0;
        for (let i=0;i<props.animations.length;i++) {
            let animation = props.animations[i];
            if (typeof(animation.Compare) !== "undefined") {
                console.log(`Compare ${animation.Compare[0]} and ${animation.Compare[1]}`)
                let idx1=animation.Compare[0];
                let idx2=animation.Compare[1];
                setTimeout(()=>{
                    arrayBars[idx1].classList.add(classes.compare1);
                    arrayBars[idx2].classList.add(classes.compare2);
                }, timeout * frame)
                frame+=1;
                setTimeout(()=>{
                    arrayBars[idx1].classList.remove(classes.compare1);
                    arrayBars[idx2].classList.remove(classes.compare2);
                }, timeout * frame)
            } else if (typeof(animation.Swap) !== "undefined") {
                console.log(`Swap ${animation.Swap[0]} and ${animation.Swap[1]}`)

                let idx1=animation.Swap[0];
                let idx2=animation.Swap[1];
                setTimeout(()=>{
                    let tmp = arrayBars[idx1].style.height
                    arrayBars[idx1].style.height = arrayBars[idx2].style.height
                    arrayBars[idx2].style.height = tmp
                }, timeout * frame)
                frame += 1;
            }
        }
    }
      return (
        <ul>
            {myData.map((value, idx) => (
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
