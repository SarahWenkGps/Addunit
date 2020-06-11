/* eslint-disable react/prop-types */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import { useSpring, animated } from 'react-spring';
import { Row, Col } from 'react-bootstrap';
const useStyles = makeStyles(theme => ({
    modal: {

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fad: {

        width: '500px',
        // opacity: 0.9,
        // overflow:'scroll'

    },
    paper: {
        // width:'80%',
        backgroundColor: theme.palette.background.paper,
        // border: '1px solid #000',
        borderRadius: 10,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        height: 200,
    overflow: 'auto',
    },
}));

const Fade = React.forwardRef(function Fade(props, ref) {
    const { in: open, children, onEnter, onExited, ...other } = props;
    const style = useSpring({
        from: { opacity: 0 },
        to: { opacity: open ? 1 : 0 },
        onStart: () => {
            if (open && onEnter) {
                onEnter();
            }
        },
        onRest: () => {
            if (!open && onExited) {
                onExited();
            }
        },
    });

    return (
        <animated.div ref={ref} style={style} {...other}>
            {children}
        </animated.div>
    );
});

export default function SpringModal(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div style={{marginRight:10}} >
            <div onClick={handleOpen} id='addall2' >show Status Unit </div>
            <Modal
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open} className={classes.fad}>
                    <div className={classes.paper}>
                   
                           
                     
                                <div style={{ fontSize: '20px', fontWeight: '400', color: '#212121', paddingBottom: '10px' }}> Unit name :  {props.name} </div>
                                <div style={{ fontSize: '20px', fontWeight: '400', color: '#212121', paddingBottom: '10px' }}> satellites Number : {props.sts}</div>  
                    


                    </div>
                </Fade>
            </Modal>
        </div>
    );
}
