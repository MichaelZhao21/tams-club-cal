import React from 'react';
import LinkBox from '../shared/link-box';
import data from '../../files/data.json';
import './resources.scss';

class Resources extends React.Component {
    render() {
        const add = window.location.origin === 'https://tams.club' ? data.addCalendar : data.addStagingCalendar;
        return (
            <div className="resources">
                <h1 className="resources-links-title">Links</h1>
                <div className="resources-link-container">
                    <LinkBox className="resources-link" href={data.examCalendar}>
                        Exam Calendar
                    </LinkBox>
                    <LinkBox className="resources-link" href={data.academicsGuide}>
                        Academics Guide
                    </LinkBox>
                    <LinkBox className="resources-link" href={data.clubLeaderResources}>
                        Club Leader Resources
                    </LinkBox>
                    <LinkBox className="resources-link" href={data.tamsWiki}>
                        TAMS Wiki
                    </LinkBox>
                    <LinkBox className="resources-link" href={add}>
                        Add the Google Calendar to your own Calendar!
                    </LinkBox>
                </div>
            </div>
        );
    }
}

export default Resources;
