import React from 'react';

class CalendarBox extends React.Component {

    constructor(props) {
        super(props);
        this.updateSelectedEvent = props.updateSelectedEvent;
        this.deleteEvent = props.deleteEvent;
        this.eventTarget = props.eventTarget;
    }

    state = {
        updatedEvent: this.props.eventTarget
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            updatedEvent: nextProps.eventTarget
        })
    }

    handleTitleEdit = (e) => {
        let updatedEvent = this.state.updatedEvent;
        updatedEvent.title = e.target.value;
        this.setState({
            updatedEvent: updatedEvent
        })        
    }

    handleDescEdit = (e) => {
        let updatedEvent = this.state.updatedEvent;
        updatedEvent.desc = e.target.value;
        this.setState({
            updatedEvent: updatedEvent
        }, console.log(this.state.updatedEvent))        
    }

    render() {
        return (
            <div>
                <div className="row mobile-full-width">
                    <div className="column">
                        <input  type="text" onChange={(e) => this.handleTitleEdit(e)} value={ this.state.updatedEvent.title }/>
                    </div>
                </div>
                <div className="row mobile-full-width">
                    <div className="column">
                        <input type="text" onChange={(e) => this.handleDescEdit(e)} value={ this.state.updatedEvent.desc }/>
                    </div>
                </div>
                <div className="row mobile-full-width">
                    <div className="column ">
                        <button className="mobile-full-width" onClick={() => this.updateSelectedEvent(this.eventTarget, this.state.updatedEvent)}>Atualizar</button>
                    </div>
                    <div className="column">
                        <button className="mobile-full-width" onClick={() => this.deleteEvent(this.eventTarget)}>Deletar</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default CalendarBox