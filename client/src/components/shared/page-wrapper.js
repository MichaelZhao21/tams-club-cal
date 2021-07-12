import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    root: {
        paddingTop: '1rem',
        display: 'flex',
    },
});

const PageWrapper = (props) => {
    const classes = useStyles();
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return <div className={`${classes.root} ${props.className || ''}`}>{props.children}</div>;
};

export default PageWrapper;
