import React from 'react';
import { Link } from 'react-router-dom';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache, InfiniteLoader } from 'react-virtualized'
import HomeLessonItem from '../lesson/homeLessonItem';

class SuperList extends React.Component {
    constructor(props, context) {
        super(props, context)
        this.list = props.list;
        this.renderRow = this.renderRow.bind(this);
        this.cache = new CellMeasurerCache({
            fixedWidth: true,
            minHeight: 100,
            defaultHeight: 100
          });
        this.onResize = this.onResize.bind(this);
    }

    componentDidMount() {
        window.addEventListener('resize', this.onResize);
    }

    onResize() {
        this.cache.clearAll();
        console.log("resized")
    }

    isRowLoaded ({ index, list }) {
        return !!list[index];
      }

    renderRow({ index, key, style, parent }) {
       
        const list  = this.props.list;
        let content;
        if (!this.isRowLoaded({ index, list })) {
            
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

    render() {
        const { hasNextPage, isNextPageLoading, list, loadMore } = this.props;
        // const rowCount = hasNextPage ? list.length + 1 : list.length;
        const rowCount = list.length === 0? 10 : list.length;
        const loadMoreRows = isNextPageLoading ? () => {} : loadMore;
        const isRowLoaded = index => !hasNextPage || index < list.length;
        this.cache.clearAll();

        return (

            <AutoSizer>
            {({ height, width }) => (
                <InfiniteLoader
                isRowLoaded={isRowLoaded}
                rowCount={rowCount}
                loadMoreRows={loadMoreRows}
                >
                {({ onRowsRendered, ref }) => (
                    <List 
                    ref={ref}
                    width={width}
                    height={height}
                    deferredMeasurementCache={this.cache}
                    rowHeight={this.cache.rowHeight}
                    onRowsRendered={onRowsRendered}
                    rowRenderer={this.renderRow}
                    rowCount={rowCount}
                    />
                )}
                </InfiniteLoader>
            )}
            </AutoSizer>

        )
    }
}
export default SuperList