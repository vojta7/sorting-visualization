import * as React from "react";
import {Button, Typography, Slider, Grid} from '@material-ui/core';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';

export function SliderWithButtons(props: {
    name: string,
    step: number
    min: number,
    max: number,
    value: number,
    xs: 1|2|3|4|5|6|7|9|10|11|12,
    handleSliderChange: (arg1: any, arg2: number | number[]) => void,
    handleButtonPress: (arg1: number) => void
}) {
    return (
         <Grid item xs={props.xs} container spacing={2}>
             <Grid item xs={1}><Typography variant="subtitle2">{props.name}</Typography></Grid>
             <Grid container item xs={10}>
                 <Grid item xs={2}>
                 <Button aria-label="Increase size" onClick={()=>props.handleButtonPress(-1)} style={{float: "right"}}>
                        <SkipPreviousIcon />
                    </Button>
                 </Grid>
                 <Grid item xs={8}>
                     <Slider
                         onChange={props.handleSliderChange}
                         aria-labelledby="discrete-slider"
                         valueLabelDisplay="auto"
                         step={props.step}
                         min={props.min}
                         max={props.max}
                         value={props.value}
                     />
                 </Grid>
                 <Grid item xs={2}>
                 <Button aria-label="Decrease size" onClick={()=>props.handleButtonPress(1)}>
                        <SkipNextIcon />
                    </Button>
                 </Grid>
             </Grid>
         </Grid>
    )
}
