import  React from 'react';
import firebase from    '../../firebase';
import { connect } from 'react-redux';

import SuperList from './superList';
import AllEvents from '../calendar/AllEvents';
import Aba from '../utils/abas/Abas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faList, faCalendar } from '@fortawesome/free-solid-svg-icons'

class Home extends React.Component {

    constructor(props) {
        super(props);
           this.loadMore = this.loadMore.bind(this);
        console.log(this.props.userObject)
    }
    
    state = {
        isNextPageLoading: false,
        hasNextPage: true,
        lessons: [],
        lastDoc: {}
      };

    loadMore() {
        const db = firebase.firestore();
        this.setState({
            isNextPageLoading: true
        })
        console.log(this.state.hasNextPage)
        if (this.state.lastDoc === undefined || !this.state.hasNextPage) {
            console.log('Nada pra mostrar')
        } else {
            let docRef = db.collection(`lessons`)
                            .where('author_id', '==', this.props.userObject.uid )
                            .orderBy('created_at', "desc")
                            .startAfter(this.state.lastDoc)
                            .limit(10)
                            .get();
            docRef.then(snapshot => {
                let lastDoc = snapshot.docs[snapshot.docs.length - 1];
                if (snapshot.empty === true || this.state.lastDoc.id === lastDoc.id) {
                    console.log('sem mais resultados')
                    this.setState({ hasNextPage: false});
                } else {
                    console.log("api calling")
                    this.setState({
                        lastDoc: lastDoc,
                        isNextPageLoading: false,
                    })
                    snapshot.forEach( doc => {
                        let oldlessons = this.state.lessons;
                        oldlessons.push(doc.data())
                        this.setState({
                            lessons: oldlessons
                        })
                })
                }
        })
        }

    }

    docRef = (startAfter) => 
        firebase.firestore().collection(`lessons`)
        .orderBy('created_at', "desc")
        .startAfter(startAfter)
        .limit(10)
        .get();

    render() {
        const { lessons } = this.state;
        const icons = [
            <FontAwesomeIcon icon={faList} style={{color: '#d3d3d3'}}/>,
            <FontAwesomeIcon icon={faCalendar} style={{color: '#d3d3d3'}}/>
        ]
        
        return(
            <div className="home-container">
                <div className="mobile">
                    <Aba icons={icons}>
                        <div key="feed" className="super-list-container">
                            <SuperList
                                list={lessons}
                                loadMore={this.loadMore}
                                isNextPageLoading={this.state.isNextPageLoading}
                                hasNextPage={this.state.hasNextPage}
                                userId={this.props.userObject.uid}
                                docRef={this.docRef}
                                />
                        </div>
                        <div key="agenda" className="agenda-container">
                            <AllEvents />
                        </div>
                    </Aba>
                </div>
                <div className="container desktop">
                    <div className="row" style={{height: '100%', padding: 15}}>
                        <div className="column">
                            <SuperList
                            list={lessons}
                            loadMore={this.loadMore}
                            isNextPageLoading={this.state.isNextPageLoading}
                            hasNextPage={this.state.hasNextPage}
                            userId={this.props.userObject.uid}
                            docRef={this.docRef}
                            />
                        </div>
                        <div className="column">
                            <AllEvents />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (store) => ({
    userObject: store.authReducer.user,
});

export default connect(mapStateToProps)(Home)