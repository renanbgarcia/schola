import React from 'react';
import Toolbar from 'react-big-calendar/lib/Toolbar';

export default class CalendarToolbar extends Toolbar {


	state = {
        view: 'MONTH'
    }

    render() {
        console.log(this)
      return (
        <div className="rbc-toolbar">
            <div className="rbc-btn-group">
                <button className="rcb-button" onClick={() => this.navigate('TODAY')}>Hoje</button>
                <button className="rcb-button" onClick={() => this.navigate('PREV')}>{'<<'}</button>
                <button className="rcb-button" onClick={() => this.navigate('NEXT')}>{'>>'}</button>
            </div>
            <div className="rbc-toolbar-label">{this.props.label}</div>
            <div className="rbc-btn-group">
                <button className="rcb-button" onClick={this.view.bind(null, 'month')}>Mês</button>
                {/* <button className="rcb-button" onClick={this.view.bind(null, 'week')}>Semana</button>
                <button className="rcb-button" onClick={this.view.bind(null, 'day')}>Dia</button> */}
                <button className="rcb-button" onClick={this.view.bind(null, 'agenda')}>Agenda</button>
            </div>
        </div>
      );
    }
  }