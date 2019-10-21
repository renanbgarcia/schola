import React from 'react';
import ListViewer from './ListViewer';
import firebase from    '../../firebase';

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          isNextPageLoading: false,
          hasNextPage: true,
          lessons: [],
          lastDoc: {}
        };
    
        this.loadMore = this.loadMore.bind(this);
    }

    loadMore() {
        // method to fetch newer entries for the list

        // let newstate = this.state.items;
        // newstate.push(Math.random());
        // this.setState({items: newstate, moreItemsLoading: true});
        const db = firebase.firestore();
        console.log(this.state.lastDoc)
        this.setState({
            isNextPageLoading: true
        })
        // let lastDoc = 0;
        if (this.state.lastDoc === undefined) {
            console.log('Nada pra mostrar')
        } else {
            console.log(this.state.lastDoc)
            let docRef = db.collection(`lessons`).orderBy('created_at', "desc").startAfter(this.state.lastDoc).limit(15).get();
            docRef.then(snapshot => {
                let lastDoc = snapshot.docs[snapshot.docs.length - 1];
                if (lastDoc === undefined) {
                    console.log('sem mais resultados')
                    this.setState({ hasNextPage: false});
                } else {
                    this.setState({
                        // lastDoc : lastDoc.data().created_at,
                        lastDoc: lastDoc,
                        isNextPageLoading: false
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

    componentWillMount() {
        // const db = firebase.firestore();
        // let docRef = db.collection(`lessons`).limit(1).get();
        // docRef.then(snapshot => {
        //     console.log(snapshot.docs[0])
        //     this.setState({
        //         lastDoc: snapshot.docs[0]
        //     })
        // })
    }

    render() {
        const { lessons, isNextPageLoading, hasNextPage } = this.state;
        console.log(lessons.length)
        return(
            <div className="home-container">
                <h5 className="list-title">T</h5>
                <div className="list-view-container">
                    <ListViewer
                        items={lessons}
                        isNextPageLoading={isNextPageLoading}
                        loadNextPage={this.loadMore}
                        hasNextPage={hasNextPage}
                    />
                </div>
            </div>

        )
    }
}

export default Home