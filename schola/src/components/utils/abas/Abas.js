import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import '../abas/aba.css';

export class Aba extends React.Component {

    constructor(props) {
        super(props);
        this.chooseView = this.chooseView.bind(this);
        this.getButtons = this.getButtons.bind(this);
    }

    state = {
        currentView: this.props.children[0].key
    }

    componentDidMount() {
        let buttons = document.getElementsByClassName('aba-button');
        console.group(buttons[0])
        if (typeof buttons === Array) {buttons.map(button => button.addEventListener('click', (e) => {console.log('sdfsdf')}))}
    }

    chooseView() {
        return this.props.children.map(child => {
            let buttons = [...document.getElementsByClassName('aba-button')];
            console.log(buttons)
            if (child.key === this.state.currentView) {
                buttons.map(button => {
                    console.log(button.id, child.key)
                    if (button.id === child.key) {
                        button.classList.add('active-aba-button');
                    } else {
                        button.classList.remove('active-aba-button')
                    }
                })
                return child
            }
        })
    }

    getButtons() {
        console.log(this.props.icons)
        return this.props.children.map((child, index) => {
            console.log(child, index)
            return (
                <div className="aba-button" id={child.key}
                    onClick={() => { this.setState({ currentView: child.key }) }}>
                    { this.props.icons[index] }
                </div>
            )
        })
    }

    render() {
        console.log(this.props.children)
        return (
            <div className="aba-container">
                <div className="aba-topbar">
                    { this.getButtons() }
                </div>
                <div className="aba-content">
                    <ReactCSSTransitionGroup
                    transitionName="aba-animation"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}>
                        { this.chooseView() }
                    </ReactCSSTransitionGroup>
                </div>
            </div>
        )
    }
}

export default Aba