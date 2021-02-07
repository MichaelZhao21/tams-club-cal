import React from 'react';
import { connect } from 'react-redux';
import ActionButton from '../shared/action-button';

import { postEvent } from '../../functions/api';
import { Event } from '../../functions/entries';
import { parseTimeZone, getTimezone } from '../../functions/util';
import { addEvent } from '../../redux/actions';

import './add.scss';

class Add extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            clubName: '',
            startDate: '',
            startTime: '',
            endDate: '',
            endTime: '',
            links: [''],
            description: '',
            addedBy: '',
            type: 'event',
            invalid: [],
        };
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        if (target.name.startsWith('links-')) this.linksInputChange(target);
        else this.setState({ [target.name]: target.value });
    }

    linksInputChange(target) {
        var linkNum = Number(target.name.substring(6));
        var oldLinkList = this.state.links;
        oldLinkList[linkNum] = target.value;

        // Add new link if text is typed into the last link box
        if (linkNum == this.state.links.length - 1 && target.value != '') oldLinkList.push('');

        this.setState({ links: oldLinkList });
    }

    add = async () => {
        var invalid = this.testValid();
        if (invalid.length !== 0) {
            this.setState({ invalid });
            return;
        }
        // Filter out empty links
        var currLinks = this.state.links;
        var i = 0;
        while (i != currLinks.length) {
            if (currLinks[i] == '') currLinks.splice(i, 1);
            else i++;
        }

        // Calculate milliseconds from starting/ending datetimes
        var end = null;
        var start = parseTimeZone(`${this.state.startDate} ${this.state.startTime}`, getTimezone());
        if (this.state.type === 'event')
            var end = parseTimeZone(`${this.state.endDate} ${this.state.endTime}`, getTimezone());

        // POST event
        const newEvent = new Event(
            this.state.type,
            this.state.name,
            this.state.clubName,
            start,
            end,
            currLinks,
            this.state.description,
            [this.state.addedBy]
        );
        const res = await postEvent(newEvent);

        if (res.status === 200) {
            newEvent.objId = res.data.id;
            this.props.addEvent(newEvent);

            this.setState({
                name: '',
                clubName: '',
                startDate: '',
                startTime: '',
                endDate: '',
                endTime: '',
                links: [''],
                description: '',
                addedBy: '',
                type: 'event',
                invalid: [],
            });
            alert('Sucessfully added event!');
        } else {
            alert('Adding event failed :((');
        }
    };

    testValid = () => {
        var invalid = [];
        if (this.state.name == '') invalid.push('Name');
        if (this.state.clubName == '') invalid.push('Club Name');
        if (this.state.startDate == '') invalid.push('Start Date');
        if (this.state.startTime == '') invalid.push('Start Time');
        if (this.state.endDate == '' && this.state.type == 'event') invalid.push('End Date');
        if (this.state.endTime == '' && this.state.type == 'event') invalid.push('End Time');
        if (this.state.addedBy == '') invalid.push('Added By Name');
        return invalid;
    };

    changeType = (type) => this.setState({ type });

    render() {
        // If the type is 'event, add an ending date/time input
        var endObj;
        if (this.state.type == 'event') {
            endObj = (
                <div className="add-end-date-obj">
                    <label htmlFor="endDate">End</label>
                    <input
                        name="endDate"
                        className="line-in add-date-input"
                        type="date"
                        value={this.state.endDate}
                        onChange={this.handleInputChange}
                    ></input>
                    <input
                        name="endTime"
                        className="line-in add-time-input"
                        type="time"
                        value={this.state.endTime}
                        onChange={this.handleInputChange}
                    ></input>
                    <br />
                </div>
            );
        }

        // Create lines for adding more links if needed
        var extraLinks = [];
        for (var i = 1; i < this.state.links.length; i++) {
            extraLinks.push(
                <input
                    name={'links-' + i}
                    key={'links-' + i}
                    className="line-in add-links-input add-extra-link"
                    type="text"
                    placeholder="Add another link"
                    value={this.state.links[i]}
                    onChange={this.handleInputChange}
                ></input>
            );
        }
        if (extraLinks.length > 0) extraLinks.push(<br key="links-break" />);

        // Create "invalid element" messages
        var invalidMessage = [];
        this.state.invalid.forEach((i) => {
            invalidMessage.push(<p className="add-invalid" key={i}>{`${i} cannot be empty!`}</p>);
        });

        return (
            <div className="add">
                <div className="add-type-switcher">
                    <ActionButton
                        className={`add-type-button add-event-button add-${this.state.type}-active`}
                        onClick={() => this.changeType('event')}
                    >
                        Event
                    </ActionButton>
                    <ActionButton
                        className={`add-type-button add-signup-button add-${this.state.type}-active`}
                        onClick={() => this.changeType('signup')}
                    >
                        Signup/Deadline
                    </ActionButton>
                </div>
                <input
                    name="name"
                    className="line-in add-name-input"
                    type="text"
                    placeholder="Event name..."
                    value={this.state.name}
                    onChange={this.handleInputChange}
                ></input>
                <label htmlFor="clubName">Club Name</label>
                <input
                    name="clubName"
                    className="line-in add-club-name-input"
                    type="text"
                    placeholder="Enter the club hosting this event"
                    value={this.state.clubName}
                    onChange={this.handleInputChange}
                ></input>
                <br />
                <label htmlFor="startDate">Start</label>
                <input
                    name="startDate"
                    className="line-in add-date-input"
                    type="date"
                    value={this.state.startDate}
                    onChange={this.handleInputChange}
                ></input>
                <input
                    name="startTime"
                    className="line-in add-time-input"
                    type="time"
                    value={this.state.startTime}
                    onChange={this.handleInputChange}
                ></input>
                <br />
                {endObj}
                {/* TODO Allow user to choose timezone */}
                <p className="add-timezone-message">** Timezone is America/Chicago [CST/CDT] **</p>
                <label htmlFor="links-0">Links</label>
                <input
                    name="links-0"
                    className="line-in add-links-input"
                    type="text"
                    placeholder="Add a link"
                    value={this.state.links[0]}
                    onChange={this.handleInputChange}
                ></input>
                <br />
                {extraLinks}
                <label>Description</label>
                <br />
                <div className="center-div">
                    <textarea
                        name="description"
                        className="add-description-input"
                        type="text"
                        placeholder="Enter a description for your event (use http/https to hyperlink urls automatically)"
                        value={this.state.description}
                        onChange={this.handleInputChange}
                    ></textarea>
                </div>
                <label htmlFor="addedBy">YOUR Name</label>
                <input
                    name="addedBy"
                    className="line-in add-added-by-input"
                    type="text"
                    placeholder="The name of the person editing"
                    value={this.state.addedBy}
                    onChange={this.handleInputChange}
                ></input>
                <br />
                {invalidMessage}
                <div className="center-button">
                    <ActionButton className="add-submit" onClick={this.add}>
                        Add to Calendar
                    </ActionButton>
                </div>
            </div>
        );
    }
}

export default connect(null, { addEvent })(Add);
