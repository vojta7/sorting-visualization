import React, {useState} from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {Box, Dialog, Fab, List, ListItem, ListItemText, Typography} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CloseIcon from '@material-ui/icons/Close';
import {Algorithm} from '../index'

const barChartStyles = makeStyles(() => createStyles(
    {
        bar: {
            display: "inline-block",
            "vertical-align": "bottom"
        },
        graph: {
            margin: 0,
            height: '100%',
            padding: "0 20px 0 20px"
        },
        heading: {
            "text-align": "center",
            paddingTop: '0.25em'
        },
        compare: {
            backgroundColor: "blue",
        },
        finished: {
            backgroundColor: "green",
        },
        normal: {
            backgroundColor: "rebeccapurple",
        },
        root: {
            position: 'relative',
            height: '100%',
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
    Compare,
    Finished
}

export interface BarChartData {
    value: number,
    color: BarColor
}

export interface BarChartProps {
    data: BarChartData[] | null,
    onSelect: (arg1: Algorithm | null) => void,
    algorithms: Map<Algorithm, string>,
    heading: string | undefined
}

export function BarChart(props: BarChartProps) {
    if (props.data !== null) {
        return (<BarChartInner data={props.data} onSelect={props.onSelect} heading={props.heading}/>)
    } else {
        return (<SelectSort onSelect={props.onSelect} algorithms={props.algorithms}/>)
    }
}

function SelectSort(props: { algorithms: Map<Algorithm, string>, onSelect: (arg1: Algorithm | null) => void }) {
    const classes = barChartStyles();
    const [open, setOpen] = useState(false);
    const openAlgSelection = (_event: any) => {
        setOpen(true)
    };
    return (
        <div className={classes.root}>
            <Dialog open={open}>
                <List>
                    {[...props.algorithms].map(([al, name]) => (
                        <ListItem button key={al.toString()} onClick={() => {
                            setOpen(false);
                            props.onSelect(al)
                        }}>
                            <ListItemText primary={name}/>
                        </ListItem>
                    ))}
                </List>
            </Dialog>
            <Fab className={classes.select} aria-label="add new sort">
                <AddCircleIcon onClick={openAlgSelection}/>
            </Fab>
        </div>
    )
}


function BarChartInner(props: { heading: string | undefined, data: BarChartData[], onSelect: (arg1: Algorithm | null) => void }) {
    const classes = barChartStyles();
    const barHeightScale = 100 / Math.max.apply(Math, props.data.map(({value,}) => value));
    const barWidth = `${90 / props.data.length}%`;
    const marginRight = `${10 / props.data.length}%`;
    return (
        <div className={classes.root}>
            <Fab className={classes.close} aria-label="remove algorithm" onClick={() => props.onSelect(null)}>
                <CloseIcon/>
            </Fab>
            <Box height={1 / 4}>
                <Typography variant="h4" component="h3" className={classes.heading}>{props.heading}</Typography>
            </Box>
            <Box height={3 / 4}>
                <ul className={classes.graph}>
                    {props.data
                        .map(({value, color}, idx) => {
                            let barClass;
                            if (color == BarColor.Compare) {
                                barClass = classes.compare
                            } else if (color == BarColor.Finished) {
                                barClass = classes.finished
                            } else {
                                barClass = classes.normal
                            }
                            let className = classes.bar + " " + barClass;
                            return (
                                <div
                                    className={className}
                                    key={idx}
                                    style={{
                                        height: `${barHeightScale * value}%`,
                                        width: barWidth,
                                        marginRight: marginRight
                                    }}/>
                            )
                        })}
                </ul>
            </Box>
        </div>
    )
}
