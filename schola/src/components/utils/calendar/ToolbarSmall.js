import React from 'react';
import Toolbar from 'react-big-calendar/lib/Toolbar';

export default class CalendarToolbarSmall extends Toolbar {

    state = {
        view: 'MONTH'
    }

    render() {
      return (
        <div className="rbc-toolbar">
            <button className="rcb-button" onClick={() => this.navigate('TODAY')}>Hoje</button>
            <button className="rcb-button" onClick={() => this.navigate('PREV')}>{'<<'}</button>
            <button className="rcb-button" onClick={() => this.navigate('NEXT')}>{'>>'}</button>
            <button className="rcb-button" onClick={this.view.bind(null, 'month')}>Mês</button>
            <button className="rcb-button" onClick={this.view.bind(null, 'agenda')}>Agenda</button>
            <div className="rbc-toolbar-label">{this.props.label}</div>
        </div>
      );
    }
  }