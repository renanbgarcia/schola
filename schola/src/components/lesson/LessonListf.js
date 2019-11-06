import React from 'react';
import firebase from '../../firebase';
import { connect } from 'react-redux';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache, InfiniteLoader } from 'react-virtualized'
import LessonItem from '../lesson/LessonItem';

const STATUS_LOADING = 1;
const STATUS_LOADED = 2;

class LessonsListf extends React.Component {
    constructor(props) {
        super(props)

        this._isRowLoaded = this._isRowLoaded.bind(this);
        this._loadMoreRows = this._loadMoreRows.bind(this);
        this._rowRenderer = this._rowRenderer.bind(this);
        this._resetList = this._resetList.bind(this);
        this.docRef = this.docRef.bind(this)
        this.deleteLesson = this.deleteLesson.bind(this);

        this.cache = new CellMeasurerCache({
            fixedWidth: true,
            minHeight: 60,
            defaultHeight: 60
          });

        this.onResize = this.onResize.bind(this);

        this.state = {
            loadedRowCount: 0,
            loadedRowsMap: {},
            loadingRowCount: 1,
            lastDoc: {},
            lessons: [],
            pageLoading: true,
            disciplineFilter: props.disciplineFilter,
            ageFilter: props.ageFilter
          };
    }

    componentDidMount() {
        window.addEventListener('resize', this.onResize);
    }

    componentDidUpdate(prevProps) {
        this._list.forceUpdateGrid()
        console.log(this.props !== prevProps, this.state.pageLoading)
        if (this.props !== prevProps && this.state.pageLoading === false) {
            this._loadMoreRows({
              startIndex: this._loadMoreRowsStartIndex,
              stopIndex: this._loadMoreRowsStopIndex
            })
            console.log(this.props, prevProps)
            console.log('chamou de novo2')
        }
    }

    componentWillReceiveProps() {
        this._resetList()
        this.cache.clearAll();
    }

    _resetList() {
        this.setState({
            loadedRowCount: 0,
            loadedRowsMap: {},
            // loadingRowCount: 1,
            lessons: [],
            lastDoc: {},
            disciplineFilter: this.props.disciplineFilter,
            ageFilter: this.props.ageFilter
          })
          this.cache.clearAll();
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
        if (loadedRowsMap[index] === STATUS_LOADED) {
            
            content = <LessonItem deleteLesson={this.deleteLesson} style={style} index={index} list={list}/>;
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
            rowIndex={index}>
                {content}
            </CellMeasurer>
        );
    }

    docRef(startAfter) {
        let baseQ = firebase.firestore().collection(`lessons`).where('author_id', '==', this.props.userObject.uid );

        if (this.props.disciplineFilter !== '') {
            baseQ = baseQ.where('discipline', '==', this.props.disciplineFilter);
        }
        if (this.props.ageFilter !== '') {
            baseQ = baseQ.where('targetAge', '==', this.props.ageFilter)
        }

        baseQ = baseQ.orderBy('created_at', "desc")
                    .startAfter(startAfter)
                    .limit(10)
                    .get()
        return baseQ
    }

    addQueryFilters(snap) {
        let newSnap = snap;
        if (this.props.disciplineFilter !== '') {
            newSnap = snap.where('discipline', '==', this.props.disciplineFilter);
        }
        if (this.props.ageFilter !== '') {
            newSnap = newSnap.where('targetAge', '==', this.props.ageFilter);
        }
        return newSnap.get()
    }

    _loadMoreRows({startIndex, stopIndex}) {
        this._loadMoreRowsStartIndex = startIndex
        this._loadMoreRowsStopIndex = stopIndex
    const {loadedRowsMap, loadingRowCount, loadedRowCount} = this.state;

    console.log('called loadmorerows', loadedRowCount);
    
    for (var i = startIndex; i <= stopIndex; i++) {
        loadedRowsMap[i] = STATUS_LOADING;
    }

    this.setState({
        loadedRowsMap: loadedRowsMap,
        pageLoading: true
      });

    console.log(this.state.lastDoc)
    let docRef = this.docRef(this.state.lastDoc);


    return docRef.then(snapshot => {
            let lastDoc = snapshot.size > 0 ? snapshot.docs[snapshot.size - 1] : {};
            console.log(lastDoc)
            if (snapshot.empty === true) {
              console.log('sem mais resultados')
              if (this.state.lessons.length === 0) {
                this.setState({
                    pageLoading: false
                })
              }
              this.setState({
                  loadingRowCount: 0,
              })
            } else {
                this.setState({
                    lastDoc: lastDoc,
                    loadingRowCount: loadingRowCount + snapshot.size
                });
                console.log("api calling")
                snapshot.docs.forEach((doc, myindex) => {
                    let oldlessons = this.state.lessons;
                    oldlessons.push(doc.data())
                    loadedRowsMap[startIndex + myindex] = STATUS_LOADED;
                    let isloading = true;
                    if (startIndex + myindex + 1 === snapshot.size ) {
                        isloading = false
                    }
                    this.setState({
                        lessons: oldlessons,
                        loadedRowsMap: loadedRowsMap,
                        loadingRowCount: this.state.loadingRowCount - 1,
                        loadedRowCount: this.state.loadedRowCount + 1,
                        pageLoading: isloading
                    })
                })
            }
        })
    }

    deleteLesson(lessonId) {
        // let docRef = firebase.firestore().collection(`lessons`).where('lessonId', '==', lessonId ).get();
        // docRef.then(snap => snap.forEach((doc) => doc.delete().then(() => console.log(`Lição ${lessonId} deletada`))));
        firebase.firestore().collection(`lessons`).doc(lessonId).delete().then(() => this._resetList());
        
    }

    render() {

        const { lessons } = this.state;
        this.cache.clearAll();

        const rowCount = () => {
            if (lessons.length < 1) {
                return 1
            } else {
                return lessons.length
            }
        }
        console.log(lessons[0])

        return (

            <AutoSizer>
            {({ height, width }) => (
                <InfiniteLoader
                isRowLoaded={this._isRowLoaded}
                rowCount={999999}
                loadMoreRows={this._loadMoreRows}
                threshold={9}
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

const mapStateToProps = (store) => ({
    userObject: store.authReducer.user
  });

export default connect(mapStateToProps)(LessonsListf)