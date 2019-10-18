import React from 'react';
import ListViewer from './ListViewer';
import firebase from    '../../firebase';

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          items: [1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8,9,1,2,34,5,6,4,5,5,5], // instantiate initial list here
          isNextPageLoading: false,
          hasNextPage: true,
          lessons: [],
          lastDoc: 0
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
        if (this.state.lastDoc == undefined) {
            console.log('no more items')
        } else {
            let docRef = db.collection(`lessons`).orderBy('created_at').startAfter(this.state.lastDoc).limit(10).get();
            docRef.then(snapshot => {
                console.log(this.state.lastDoc)
                let lastDoc = snapshot.docs[snapshot.docs.length - 1];
                if (lastDoc == undefined) {
                    console.log('sem mais resultados')
                } else {
                    this.setState({
                        lastDoc : lastDoc.data().created_at,
                        isNextPageLoading: false
                    })
                    snapshot.forEach( doc => {
                        // console.log(doc.data());
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
        const { items, lessons, isNextPageLoading, hasNextPage } = this.state;
        // console.log(lessons);
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