import React from 'react';

class RegisterStudent extends React.Component {

    state =   { 
        styleModal: {left: this.props.left, transform: 'scale(0)'}
    }

    componentWillReceiveProps(nprops) {
        this.setState({
            styleModal: {left: nprops.left, top: nprops.top, transform: nprops.transform }
        })
    }

    render() {
        return (
                <div style={this.state.styleModal} className="register-student-modal">
                    <form>
                        <label>Nome:
                            <input type="text" required/>
                        </label>
                        <label>Nascimento:
                            <input type="date" required/>
                        </label>
                        <label className="profile-pic-file-label">Foto
                            <input type="file"/>
                        </label>
                    </form>
                </div>
        )
    }
}

export default RegisterStudent;