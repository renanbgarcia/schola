import React from 'react';
import { Link } from 'react-router-dom';
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
        let content, photo, title, description;
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
        content = list[index];
        photo = content.authorProto
        title = content.title;
        description = content.desc
        content = <div style={style} className="listView-item-container observed">
                        <div id={'sel' + index} className="List" >
                            <img src={photo} title={content.author} className="list-author-photo"/>
                            <div className="listview-content-container">
                                <p><strong>{title}</strong></p>
                                <p>{description}</p>
                                <div className="files-preview-container">
                                    {this.previewFiles(content, index)}
                                </div>
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

    previewFiles(content, index) {
        if (content.filesURLs) {
            let className;
            if (content.filesURLs.length > 1) {
                className = 'list-image list-image-multiple';
            } else {
                className = 'list-image';
            }

            let elem = content.filesURLs.slice(0, 3).map(src => <img key={(index + 1) * Math.random()} className={className} src={src} alt={content.title}/>);
            if (content.filesURLs.length > 3) {
                elem.push(<Link href={'#'} className="and-more">... e mais</Link>);
            }
            return elem
        }
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