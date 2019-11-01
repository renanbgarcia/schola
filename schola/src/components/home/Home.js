import  React, { createRef } from 'react';
// import ListViewer from './ListViewer';
import firebase from    '../../firebase';
import { connect } from 'react-redux';

import { InfiniteLoader } from 'react-virtualized';
import SuperList from './superList';

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

    render() {
        const { lessons } = this.state;
        
        return(
            <div className="home-container">
                <h5 className="list-title">T</h5>
                <div className="list-view-container">
                        <SuperList
                        list={lessons}
                        loadMore={this.loadMore}
                        isNextPageLoading={this.state.isNextPageLoading}
                        hasNextPage={this.state.hasNextPage}
                        userId={this.props.userObject.uid}
                        />
                </div>
            </div>

        )
    }
}

const mapStateToProps = (store) => ({
    user: store.authReducer.currentUser,
    userObject: store.authReducer.user,
    isLogged: store.authReducer.isLogged
  });

export default connect(mapStateToProps)(Home)