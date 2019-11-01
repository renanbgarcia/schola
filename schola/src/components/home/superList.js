import React from 'react';
import firebase from '../../firebase';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache, InfiniteLoader } from 'react-virtualized'
import HomeLessonItem from '../lesson/homeLessonItem';

const STATUS_LOADING = 1;
const STATUS_LOADED = 2;

class SuperList extends React.Component {
    constructor(props, context) {
        super(props, context)
        this.list = props.list;
        this.isRowLoaded = this.isRowLoaded.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.loadMoreRows = this.loadMoreRows.bind(this)

        this._timeoutIdMap = {};

        this._isRowLoaded = this._isRowLoaded.bind(this);
        this._loadMoreRows = this._loadMoreRows.bind(this);
        this._rowRenderer = this._rowRenderer.bind(this);

        this.cache = new CellMeasurerCache({
            fixedWidth: true,
            minHeight: 100,
            defaultHeight: 100
          });
        this.onResize = this.onResize.bind(this);

        this.state = {
            loadedRowCount: 0,
            loadedRowsMap: {},
            loadingRowCount: 1,
            lastDoc: {},
            lessons: []
          };
    }

    componentDidMount() {
        window.addEventListener('resize', this.onResize);
    }

    componentWillUnmount() {
        Object.keys(this._timeoutIdMap).forEach(timeoutId => {
          clearTimeout(timeoutId);
        });
      }

    onResize() {
        this.cache.clearAll();
        console.log("resized")
    }

    isRowLoaded ({ index }) {
        console.log(index, !!this.list[index], this.list)
        return !!this.list[index];
      }

    _isRowLoaded({index}) {
    const {loadedRowsMap} = this.state;
    return !!loadedRowsMap[index]; // STATUS_LOADING or STATUS_LOADED
    }

    renderRow({ index, key, style, parent }) {
       
        const list  = this.state.lessons;
        let content;
        if (!this.isRowLoaded({ index })) {
            
            content = <div style={style} className="listView-item-container">
                        <div  className="List" >
                            <div className="listview-content-container">
                                <div className="placeholder-div"></div>
                                <div className="placeholder-div"></div>
                            </div>
                        </div>
                      </div>
        } else {
            content = <HomeLessonItem style={style} index={index} list={list}/>
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

    _rowRenderer({index, key, style, parent}) {
        const list = this.state.lessons;
        const {loadedRowsMap} = this.state;
    
        const row = list[index];
        // console.log(list)
        let content;
    
        if (loadedRowsMap[index] === STATUS_LOADED) {
            content = <HomeLessonItem style={style} index={index} list={list}/>;
            // content = <div style={style}>{list[index].title + " " + index}</div>
        } else {
          content = (
            <div style={style} className="listView-item-container">
                <div  className="List" >
                    <div className="listview-content-container">
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

    loadMoreRows({ startIndex, stopIndex }) {
        console.log(stopIndex)
    //   return this.props.loadMore
    let load = !this.isRowLoaded(stopIndex) && this.list.length !== 0 ? () => {} : this.props.loadMore;
    if (stopIndex) {
        return load
    } else {
        return this.props.loadMore
    }
    return load
    }

    _loadMoreRows({startIndex, stopIndex}) {
    const {loadedRowsMap, loadingRowCount, loadedRowCount} = this.state;
    const increment = stopIndex - startIndex + 1;

    for (var i = startIndex; i <= stopIndex; i++) {
        loadedRowsMap[i] = STATUS_LOADING;
    }

    this.setState({
        loadingRowCount: loadingRowCount + increment,
        loadedRowsMap: loadedRowsMap
    });

    const db = firebase.firestore();

            let docRef = db.collection(`lessons`)
                            .where('author_id', '==', this.props.userId )
                            .orderBy('created_at', "desc")
                            .startAfter(this.state.lastDoc)
                            .limit(10)
                            .get();
         return docRef.then(snapshot => {
                // for (var i = startIndex; i <= stopIndex; i++) {
                //     loadedRowsMap[i] = STATUS_LOADED;
                //     }
                console.log(snapshot)
            
                    // this.setState({
                    //     loadedRowCount: loadedRowCount + snapshot.docs.length,
                    // });
                let lastDoc = snapshot.docs[snapshot.docs.length - 1];
                if (snapshot.empty === true || this.state.lastDoc.id === lastDoc.id) {
                    console.log('sem mais resultados')
                } else {
                    console.log("api calling")
                    this.setState({
                        lastDoc: lastDoc,
                    })
                    snapshot.docs.forEach((doc, myindex) => {
                        let oldlessons = this.state.lessons;
                        oldlessons.push(doc.data())
                        console.log(oldlessons.length, 'index', oldlessons)
                        loadedRowsMap[oldlessons.length - 1] = STATUS_LOADED;
                        this.setState({
                            lessons: oldlessons,
                            loadedRowsMap: loadedRowsMap,
                            loadingRowCount: this.state.loadingRowCount - 1,
                            loadedRowCount: this.state.loadedRowCount + 1
                    })
                })
            }
        })

    // const timeoutId = setTimeout(() => {
    //     const {loadedRowCount, loadingRowCount} = this.state;

    //     delete this._timeoutIdMap[timeoutId];

    //     for (var i = startIndex; i <= stopIndex; i++) {
    //     loadedRowsMap[i] = STATUS_LOADED;
    //     }

    //     this.setState({
    //     loadingRowCount: loadingRowCount - increment,
    //     loadedRowCount: loadedRowCount + increment,
    //     });

    //     promiseResolver();
    // }, 1000 + Math.round(Math.random() * 2000));

    // this._timeoutIdMap[timeoutId] = true;

    // let promiseResolver;

    // return new Promise(resolve => {
    //     promiseResolver = resolve;
    // });
    }

    // loadMore() {
    //     const db = firebase.firestore();
    //     this.setState({
    //         isNextPageLoading: true
    //     })
    //     console.log(this.state.hasNextPage)
    //     if (this.state.lastDoc === undefined || !this.state.hasNextPage) {
    //         console.log('Nada pra mostrar')
    //     } else {
    //         const {loadedRowCount, loadingRowCount} = this.state;
    //         let docRef = db.collection(`lessons`)
    //                         .where('author_id', '==', this.props.userObject.uid )
    //                         .orderBy('created_at', "desc")
    //                         .startAfter(this.state.lastDoc)
    //                         .limit(10)
    //                         .get();
    //         docRef.then(snapshot => {
    //             for (var i = startIndex; i <= stopIndex; i++) {
    //                 loadedRowsMap[i] = STATUS_LOADED;
    //                 }
            
    //                 this.setState({
    //                 loadingRowCount: loadingRowCount - increment,
    //                 loadedRowCount: loadedRowCount + increment,
    //                 });
    //             let lastDoc = snapshot.docs[snapshot.docs.length - 1];
    //             if (snapshot.empty === true || this.state.lastDoc.id === lastDoc.id) {
    //                 console.log('sem mais resultados')
    //                 this.setState({ hasNextPage: false});
    //             } else {
    //                 console.log("api calling")
    //                 this.setState({
    //                     lastDoc: lastDoc,
    //                     isNextPageLoading: false,
    //                 })
    //                 snapshot.forEach( doc => {
    //                     let oldlessons = this.state.lessons;
    //                     oldlessons.push(doc.data())
    //                     this.setState({
    //                         lessons: oldlessons
    //                     })
    //             })
    //             }
    //     })
    //     }

    // }

    render() {

        const {loadedRowCount, loadingRowCount, lessons, loadedRowsMap} = this.state;

        const { hasNextPage, isNextPageLoading, list, loadMore } = this.props;
        // const rowCount = hasNextPage ? list.length + 1 : list.length;
        // const rowCount = list.length === 0? 15 : list.length + 1;
        // const loadMoreRows = this.isRowLoaded && this.list.length !== 0 ? () => {} : loadMore;
        let loadMoreRows = ({ startIndex, stopIndex }) => {
            console.log(stopIndex)
          //   return this.props.loadMore
          let load = !this.isRowLoaded(stopIndex) && this.list.length !== 0 ? () => {} : loadMore;
          if (stopIndex) {
              return load
          } else {
              return loadMore
          }
        }
        console.log(isNextPageLoading)
        // const isRowLoaded = index => !hasNextPage || index < list.length;
        const isRowLoaded = index => {console.log(!!this.list[index]); return !!this.list[index]};
        this.cache.clearAll();
        console.log(lessons.length, loadedRowCount, loadingRowCount, loadedRowsMap)

        const rowCount = () => {
            if (lessons.length < 1) {
                return 3
            } else {
                if (loadedRowCount < lessons.length) {
                    return loadingRowCount + loadingRowCount
                } else {
                    return lessons.length
                }
            }
        }

        return (

            <AutoSizer>
            {({ height, width }) => (
                <InfiniteLoader
                isRowLoaded={this._isRowLoaded}
                rowCount={1000}
                loadMoreRows={this._loadMoreRows}
                >
                {({ onRowsRendered, ref }) => (
                    <List 
                    ref={ref}
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
export default SuperList