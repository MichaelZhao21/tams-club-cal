import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { getClubList } from '../../functions/api';
import { getSavedClubList } from '../../redux/selectors';
import { setClubList } from '../../redux/actions';

import ClubCard from './club-card';
import Loading from '../shared/loading';
import PageWrapper from '../shared/page-wrapper';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    gridItem: {
        [theme.breakpoints.down('md')]: {
            flexGrow: 1,
        },
    },
}));

const Clubs = () => {
    const dispatch = useDispatch();
    const clubList = useSelector(getSavedClubList);
    const [clubCardList, setClubCardList] = useState(<Loading />);

    useEffect(async () => {
        // Fetch the events list on mount from database
        if (clubList !== null) return;
        const clubs = await getClubList();
        if (clubs.status !== 200) {
            setClubCardList(
                <Loading error="true">
                    Could not get club data. Please reload the page or contact the site manager to fix this issue.
                </Loading>
            );
            return;
        }
        dispatch(setClubList(clubs.data));
    }, []);

    const classes = useStyles();
    useEffect(() => {
        if (clubList === null) return;
        setClubCardList(
            <Grid container spacing={4}>
                {clubList.map((c) => (
                    <Grid item xs={12} sm={6} lg={4} className={classes.gridItem} key={c.name}>
                        <ClubCard club={c} />
                    </Grid>
                ))}
            </Grid>
        );
    }, [clubList]);

    return (
        <PageWrapper>
            <Container>{clubCardList}</Container>
        </PageWrapper>
    );
};

export default Clubs;
