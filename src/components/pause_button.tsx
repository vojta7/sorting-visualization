import * as React from "react";
import {Button} from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';

export function PauseButton(props: { running: boolean, onClick: (arg1: boolean) => void }) {
    if (props.running) {
        return (
            <Button aria-label="Pause" onClick={() => props.onClick(false)}>
                <PauseIcon fontSize="large"/>
            </Button>
        )
    } else {
        return (
            <Button aria-label="Animate" onClick={() => props.onClick(true)}>
                <PlayArrowIcon fontSize="large"/>
            </Button>
        )
    }
}

