import React from 'react';
import { InfiniteLoader, List } from 'react-virtualized';
import firebase from    '../../firebase';
import { useSelector } from 'react-redux'

export default class LessonList extends React.Component {
    constructor(props) {
        super(props);
        this.rowRenderer = this.rowRenderer.bind(this);
        this.isRowLoaded = this.isRowLoaded.bind(this);
    }


    list = this.props.lessons;

    // store = useSelector(store => store);

    isRowLoaded ({ index }) {
        return !!this.list[index];
      }

    rowRenderer ({ key, index, style}) {
        console.log(this.list)
        return (
          <div
            key={key}
            style={style}
          >
            {this.list[index]? this.list[index].title: 'loading'}
          </div>
        )
      }

    render() {
        console.log(this.props)
        return (
            <InfiniteLoader
                isRowLoaded={this.isRowLoaded}
                loadMoreRows={this.props.loadMore}
                rowCount={1000}
                minimumBatchSize={5}
                autoReload={true}
            >
                {({ onRowsRendered, registerChild }) => (
                <List
                    height={200}
                    onRowsRendered={onRowsRendered}
                    ref={registerChild}
                    rowCount={this.list.length}
                    rowHeight={80}
                    rowRenderer={this.rowRenderer}
                    width={300}
                />
                )}
            </InfiniteLoader>
        )
    }
    
};