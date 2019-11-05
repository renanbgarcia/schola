import React from 'react';
import firebase from '../../firebase';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache, InfiniteLoader } from 'react-virtualized'
import HomeLessonItem from '../lesson/homeLessonItem';

const STATUS_LOADING = 1;
const STATUS_LOADED = 2;

class LessonsList extends React.Component {
    constructor(props) {
        super(props)

        this._isRowLoaded = this._isRowLoaded.bind(this);
        this._loadMoreRows = this._loadMoreRows.bind(this);
        this._rowRenderer = this._rowRenderer.bind(this);
        this._resetList = this._resetList.bind(this)

        // this.rowCount = this.rowCount.bind(this)
        this.cache = new CellMeasurerCache({
            fixedWidth: true,
            minHeight: 100,
            defaultHeight: 100
          });

        this.onResize = this.onResize.bind(this);

        this.state = {
            loadedRowCount: 0,
            loadedRowsMap: {},
            loadingRowCount: 0,
            lastDoc: {},
            lessons: [],
            filter1: props.filter1,
            filter2: props.filter2
          };
    }

    componentDidMount() {
        window.addEventListener('resize', this.onResize);
    }

    componentDidUpdate(prevProps, prevState) {
        this._list.forceUpdateGrid()
        if (this.props.filter1 !== prevProps.filter1 || this.props.filter2 !== prevProps.filter2) {
            this._loadMoreRows({
              startIndex: this._loadMoreRowsStartIndex,
              stopIndex: this._loadMoreRowsStopIndex
            })
            console.log('chamou de novo')
        }
    }

    componentWillReceiveProps() {
        this._resetList();
      this.cache.clearAll();
    }

    _resetList() {
        console.log(this.state.lessons)
        this.setState({
            loadedRowCount: 1,
            loadedRowsMap: {0: 2},
            loadingRowCount: 1,
            lastDoc: {},
            lessons: [{title: 'Sem resultados'}],
            filter1: this.props.filter1,
            filter2: this.props.filter2
          })
          console.log('resetado')
    }

    onResize() {
        this.cache.clearAll();
        console.log("resized")
    }

    _isRowLoaded({index}) {
    const {loadedRowsMap} = this.state;
    return !!loadedRowsMap[index]; // STATUS_LOADING or STATUS_LOADED
    }

    _rowRenderer({index, key, style, parent}) {
        let list = this.state.lessons;
        let {loadedRowsMap} = this.state;

        let content;
        console.log(this.state.lessons, this.state.loadedRowsMap)
        if (loadedRowsMap[index] === STATUS_LOADED) {
            content = <div>{this.state.ageFilter2}<HomeLessonItem style={style} index={index} list={list}/></div>;
            // content = <div style={style}>{list[index].title + " " + index}</div>
        } else {
          content = (
            <div style={style} className="listView-item-container">
                <div  className="List" >
                    <div className="listview-content-container">
                        {this.state.ageFilter2}
                        <div className="placeholder-div"></div>
                        <div className="placeholder-div"></div>
                    </div>
                </div>
            </div>
          );
        }
    
        return (
            <CellMeasurer 
            key={key}
            cache={this.cache}
            parent={parent}
            columnIndex={0}
            rowIndex={index}
            rowsMap={this.state.loadedRowsMap}>
                {content}
            </CellMeasurer>
        );
    }

    _loadMoreRows({startIndex, stopIndex}) {
    const {loadedRowsMap, loadingRowCount, loadedRowCount} = this.state;
    const increment = stopIndex - startIndex + 1;
    console.log('called loadmorerows')
    
    for (var i = startIndex; i <= stopIndex; i++) {
        loadedRowsMap[i] = STATUS_LOADING;
    }

    this.setState({
        loadingRowCount: loadingRowCount + increment,
        loadedRowsMap: loadedRowsMap,
      });
    // console.log(loadedRowsMap)

    // const db = firebase.firestore();

            // let docRef = db.collection(`lessons`)
            //                 .where('author_id', '==', this.props.userId )
            //                 .orderBy('created_at', "desc")
            //                 .startAfter(this.state.lastDoc)
            //                 .limit(10)
            //                 .get();

    console.log(this.state.lastDoc)
    let docRef = this.props.docRef(this.state.lastDoc);


    return docRef.then(snapshot => {
      console.log(snapshot)

            let lastDoc = snapshot.size > 0 ? snapshot.docs[snapshot.size - 1] : {};
            console.log(lastDoc)
            // console.log(lastDoc)
            // if (snapshot.empty === true || this.state.lastDoc.id === lastDoc.id) {
            if (snapshot.empty === true) {

              console.log('sem mais resultados')
              console.log(this.state)
            } else {
                this.setState({
                  loadingRowCount: loadingRowCount + increment,
                  loadedRowsMap: loadedRowsMap,
                    lastDoc: lastDoc,
                });
                console.log("api calling")
                snapshot.docs.forEach((doc, myindex) => {
                    let oldlessons = this.state.lessons;
                    oldlessons.push(doc.data())
                    // console.log(startIndex, stopIndex, myindex)
                    loadedRowsMap[startIndex + myindex] = STATUS_LOADED;
                    if (myindex === snapshot.size -1 ) {
                        oldlessons.shift();
                    }
                    console.log(loadedRowsMap)
                    this.setState({
                        lessons: oldlessons,
                        loadedRowsMap: loadedRowsMap,
                        loadingRowCount: this.state.loadingRowCount - 1,
                        loadedRowCount: snapshot.size > 0 ? snapshot.size : 1
                    }, console.log(this.state))
                })
            }
        })
    }

    render() {

        const {loadedRowCount, loadingRowCount, lessons, loadedRowsMap} = this.state;

        this.cache.clearAll();
        // console.log(lessons.length, loadedRowCount, loadingRowCount, loadedRowsMap)


        const rowCount = () => {
            if (lessons.length < 1) {
                return 1
            } else {
                if (loadedRowCount < lessons.length) {
                    return loadedRowCount + loadingRowCount
                } else {
                    return lessons.length
                }
            }
        }
        console.log(this.state.lessons)
        // console.log(rowCount(), lessons, ' - rowciunt e lessons', this.state)
        return (

            <AutoSizer>
            {({ height, width }) => (
                <InfiniteLoader
                isRowLoaded={this._isRowLoaded}
                rowCount={1000}
                loadMoreRows={this._loadMoreRows}
                // threshold={9}
                >
                {({ onRowsRendered, ref }) => (
                    <List 
                    ref={(ref) => this._list = ref}
                    width={width}
                    height={height}
                    deferredMeasurementCache={this.cache}
                    rowHeight={this.cache.rowHeight}
                    onRowsRendered={onRowsRendered}
                    rowRenderer={this._rowRenderer}
                    rowCount={rowCount()}
                    />
                )}
                </InfiniteLoader>
            )}
            </AutoSizer>

        )
    }
}
export default LessonsList