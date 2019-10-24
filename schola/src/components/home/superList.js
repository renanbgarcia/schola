import React from 'react';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache, InfiniteLoader } from 'react-virtualized'

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
    }


    isRowLoaded ({ index, list }) {
        return !!list[index];
      }

    renderRow({ index, key, style, parent }) {
        const list  = this.props.list;
        let content, photo, title, description;
        if (!this.isRowLoaded({ index, list })) {
            content = <div style={style}>Loading...</div>
        } else {
        content = list[index];
        photo = content.authorProto
        title = content.title;
        description = content.desc
        content = <div style={style}>
                        <div  className="List" >
                            <img src={photo} className="list-author-photo"/>
                            <div className="listview-content-container">
                                <p><strong>{title}</strong></p>
                                <p>{description}</p>
                                {
                                    this.previewFiles(content)
                                }
                            </div>
                        </div>
                    </div>
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

    previewFiles(content) {
        if (content.filesURLs) {
            return content.filesURLs.map(src => <img className="list-image" src={src} alt={content.title}/>)
        }
    }

    render() {
        const { hasNextPage, isNextPageLoading, list, loadMore } = this.props;
        const rowCount = hasNextPage ? list.length + 1 : list.length;
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