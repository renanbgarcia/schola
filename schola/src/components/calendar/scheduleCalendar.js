import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from 'moment';
import { alertbox } from '../utils/alert';
import firebase from '../../firebase';

import CalendarBox from '../utils/calendar/calendarEditBox';
import CalendarToolbarSmall from '../utils/calendar/ToolbarSmall';

const DnDCalendar = withDragAndDrop(Calendar);

export default class ScheduleCalendar extends Component {

    constructor(props) {
        super(props)
        this.localizer = momentLocalizer(moment);
        this.eventComponent = this.eventComponent.bind(this)
        this.onEventResize = this.onEventResize.bind(this);
        this.onEventDrop = this.onEventDrop.bind(this);
        this.onSelectRange = this.onSelectRange.bind(this)
        this.onSelectEvent = this.onSelectEvent.bind(this)
        this.deleteEvent = this.deleteEvent.bind(this);
        this.updateSelectedEvent = this.updateSelectedEvent.bind(this);
        // this.dismissModal =  this.dismissModal.bind(this);
        // this.renderModal = this.renderModal.bind(this);
        this.DoSchedule = this.DoSchedule.bind(this);
    }

    state = {
        events: [],
        clickedEvent: {
            title: "Edite o título",
            desc: "Edite a descrição"
        },
        isEventEditBoxVisible: false
    }

    DoSchedule() {
        try {
            let db = firebase.firestore();
            let docRef = db.collection('events').doc();
            let docID = docRef.id;
    
            docRef.set({
                id: docID,
                author_id: this.props.userObject.uid,
                events: this.state.events
            });
        } catch(error) {
            console.log(error);
            alertbox.show('Ocorreu um erro :(')
            throw error;
        }
    }

    
    onEventResize({ event, start, end, allDay }) {
        const { events } = this.state

        const nextEvents = events.map(existingEvent => {
          return existingEvent.id === event.id
            ? { ...existingEvent, start, end }
            : existingEvent
        })
    
        this.setState({
          events: nextEvents,
        })
      };
    
    onEventDrop({ event, start, end, isAllDay: droppedOnAllDaySlot }) {
        const { events } = this.state

        const idx = events.indexOf(event)
        let allDay = event.allDay
    
        if (!event.allDay && droppedOnAllDaySlot) {
          allDay = true
        } else if (event.allDay && !droppedOnAllDaySlot) {
          allDay = false
        }
    
        const updatedEvent = { ...event, start, end, allDay }
    
        const nextEvents = [...events]
        nextEvents.splice(idx, 1, updatedEvent)
    
        this.setState({
          events: nextEvents,
        })
    };

    onSelectRange(info) {
        const { events } = this.state;

        let timestamp = Date.now() * Math.random(0.1, 1);
        timestamp = Math.floor(timestamp);
        let id = timestamp + window.crypto.getRandomValues(new Uint32Array(1));

        const newEvent = {
            id: id,
            start: info.start,
            end: info.end,
            title: this.state.titleInput !== "" ? this.state.titleInput: "Agendamento",
            description: this.state.descriptionInput
        }
        this.setState({
            events:[...events, newEvent]
        })
    }

    deleteEvent(event) {
        const { events } = this.state;
        const idx = events.indexOf(event);

        events.splice(idx, 1);
        this.setState({
            events: events,
            isEventEditBoxVisible: false
        })
    }

    onSelectEvent(event) {
        this.setState({
            clickedEvent: event,
            isEventEditBoxVisible: true
        })
    }

    updateSelectedEvent(event, updatedEvent) {
        const { events } = this.state;
        const idx = events.indexOf(event)

        const nextEvents = [...events]
        nextEvents.splice(idx, 1, updatedEvent)
        this.setState({
            events: nextEvents,
            isEventEditBoxVisible: false
        })
    }

    renderModal() {
        return this.state.isEventEditBoxVisible ?
            <div id="wrapper"
                    className="calendar-edit-box-wrapper"
                    onClick={this.dismissModal}>
                <CalendarBox updateSelectedEvent={this.updateSelectedEvent}
                                deleteEvent={this.deleteEvent}
                                eventTarget={this.state.clickedEvent}/>
            </div> : null
    }

    eventComponent(e) {
        return <div>{e.title}</div>
    }

    render() {
        return (
            <>
                <ReactCSSTransitionGroup
                transitionName="calendarEdit"
                transitionEnterTimeout={250}
                transitionLeaveTimeout={250}>
                    { this.renderModal() }
                </ReactCSSTransitionGroup>
                <DnDCalendar
                    defaultDate={new Date()}
                    defaultView="month"
                    events={this.state.events}
                    localizer={this.localizer}
                    onEventDrop={this.onEventDrop}
                    onEventResize={this.onEventResize}
                    onSelectSlot={this.onSelectRange}
                    onSelectEvent={this.onSelectEvent}
                    resizable
                    selectable
                    popup={true}
                    components={{
                        event: this.eventComponent,
                        toolbar: CalendarToolbarSmall
                    }}
                    style={{ height: '100%', 'min-height': '370px', width: '100%'}}
                />
            </>
        )
    }
}