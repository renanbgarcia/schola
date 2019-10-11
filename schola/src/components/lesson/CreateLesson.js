import React from 'react';
import { Link } from 'react-router-dom';
import firebase from '../../firebase';
import { userSignedIn } from '../../actions/authAction';
import { connect } from 'react-redux'; 

class CreateLesson extends React.Component {

    constructor(props) {
        super(props)
        this.handleFileInput = this.handleFileInput.bind(this);
    }

    state = {
        fileList: ['teste']
    }

    handleFileInput() {
        let fileList = document.getElementById('lesson-file').files;
        console.log(fileList[0]);
        this.setState({
            fileList: fileList
        })
    }

    render() {
        console.log(typeof this.state.fileList);
        return (
            <div>
                <div className="row row-center">
                    <h3>Create lesson</h3>
                </div>
                <div className="row row-center">
                    <input onChange={this.handleFileInput} type="file" id="lesson-file" multiple/>
                </div>
                <div>
                    <ul>
                        {/* {this.state.fileList.map(file => "<li> file </li>")} */}
                        {}
                    </ul>
                </div>
                <button onClick={this.handleFileInput}>Enviar</button>
            </div>
        )
     }
}

const mapStateToProps = (store) => ({
    user: store.authReducer.currentUser,
    isLogged: store.authReducer.isLogged
  });
  
  const mapDispatchToProps = dispatch => ({
  })

export default connect(mapStateToProps, mapDispatchToProps)(CreateLesson)