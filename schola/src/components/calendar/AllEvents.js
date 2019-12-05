import React from 'react';
import { connect } from 'react-redux';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from 'moment';
import CalendarToolbarSmall from '../utils/calendar/ToolbarSmall';

import 'moment/locale/pt-br'

import firebase from '../../firebase';

// const DnDCalendar = withDragAndDrop(Calendar);

class AllEvents extends React.Component {
    constructor(props) {
        super(props);
        this.localizer = momentLocalizer(moment);
        this.getEvents = this.getEvents.bind(this);
    }

    state = {
        events: []
    }

    componentDidMount() {
        this.getEvents()
    }

    eventComponent(e) {
        return <div>{e.title}</div>
    }

    getEvents() { 
        const docRef = firebase.firestore().collection('events')
                                .where('author_id', '==', this.props.userObject.uid);
        docRef.get().then(snapshot => {
            snapshot.docs.map(doc => {
                let prevState = this.state.events;
                doc.data().events.map(ev => {
                    let parsedEnd = moment.unix(ev.end.seconds).format();
                    let parsedStart = moment.unix(ev.start.seconds).format()
                    ev.end = parsedEnd;
                    ev.start = parsedStart;
                    prevState.push(ev)
                });
                this.setState({ events: prevState });
            })
        })
    }

    render() {
        return (
            <Calendar
            defaultDate={new Date()}
            defaultView="month"
            events={this.state.events}
            localizer={this.localizer}
            resizable
            popup={true}
            culture='pt-br'
            components={{
                event: this.eventComponent,
                toolbar: CalendarToolbarSmall
            }}
            style={{ height: '100%', 'min-height': '250px', width: '100%'}}
        />
        )
    }
}

const mapStateToProps = (store) => ({
    userObject: store.authReducer.user,
  });

export default connect(mapStateToProps)(AllEvents);