import React from 'react';
import firebase from '../../firebase';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache, InfiniteLoader } from 'react-virtualized'
import HomeLessonItem from '../lesson/homeLessonItem';

const STATUS_LOADING = 1;
const STATUS_LOADED = 2;

class SuperList extends React.Component {
    constructor(props, context) {
        super(props, context)
        // this.list = props.list;

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
            loadingRowCount: 0,
            lastDoc: {},
            lessons: []
          };
    }

    componentDidMount() {
        window.addEventListener('resize', this.onResize);
        window.addEventListener('scroll', this.cache.clearAll());
        
    }

    componentDidUpdate() {
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
        const list = this.state.lessons;
        const {loadedRowsMap} = this.state;
    
        let content;
    
        if (loadedRowsMap[index] === STATUS_LOADED) {
            content = <HomeLessonItem style={style} index={index} list={list}/>;
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

    _loadMoreRows({startIndex, stopIndex}) {
    const {loadedRowsMap, loadingRowCount} = this.state;
    const increment = stopIndex - startIndex + 1;

    for (var i = startIndex; i <= stopIndex; i++) {
        loadedRowsMap[i] = STATUS_LOADING;
    }

    this.setState({
        loadingRowCount: loadingRowCount + increment,
        loadedRowsMap: loadedRowsMap
    });

    let docRef = this.props.docRef(this.state.lastDoc);

    return docRef.then(snapshot => {
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
                    loadedRowsMap[startIndex + myindex] = STATUS_LOADED;
                    this.setState({
                        lessons: oldlessons,
                        loadedRowsMap: loadedRowsMap,
                        loadingRowCount: this.state.loadingRowCount - 1,
                        loadedRowCount: this.state.loadedRowCount + 1
                    })
                })
            }
        })
    }

    render() {
        const {loadedRowCount, loadingRowCount, lessons} = this.state;

        this.cache.clearAll();

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

        return (

            <AutoSizer>
            {({ height, width }) => (
                <InfiniteLoader
                isRowLoaded={this._isRowLoaded}
                rowCount={1000}
                loadMoreRows={this._loadMoreRows}
                threshold={9}
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