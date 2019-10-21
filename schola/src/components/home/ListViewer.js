import React from 'react';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from "react-window-infinite-loader";
import AutoSizer from 'react-virtualized-auto-sizer';
import firebase from '../../firebase';

// export default class ListViewer extends React.Component{
//   constructor(props) {
//     super(props);
//     this.itemCount = this.props.hasNextPage ? this.state.items.length + 1 : this.state.items.length;
//     this.loadMoreItems = this.props.isNextPageLoading ? () => {} : this.props.loadNextPage;
//     this.isItemLoaded = this.isItemLoaded.bind(this);
//     this.Item = this.Item.bind(this)
//     console.log(this.props.items)
//     console.log(this.props.items.length)
//   }

//   state = {
//     items: this.props.items
//   }

//   isItemLoaded(index){
//     return !this.props.hasNextPage || index < this.props.items.length;
//   }

//   Item(index, style) {
//     let content;
//     if (!this.isItemLoaded(index)) {
//       content = "Loading...";
//       console.log(index.index)
//       console.log(this.isItemLoaded(index))
//       console.log(this.props.hasNextPage)
//       console.log(this.props.items.length)
//     } else {
//       content = this.props.items[index];
//       content = content.title;
//       this.getAuthorPhoto(index);
//     }

//     return <div style={style} className="">
//                 <div className="List">{content}</div>
//            </div>;
//   };

//   getAuthorPhoto = (index) => {
//     let authorId = this.items[index].author_id;
//     console.log(authorId);

//     const db = firebase.firestore();
//     const docRef = db.collection('users').doc(authorId).get();
//     docRef.then(doc => console.log(doc.data().photoURL))
//   }

//   render() {
//     console.log(this)
//     return (
//       <InfiniteLoader
//         isItemLoaded={this.isItemLoaded}
//         itemCount={this.itemCount}
//         loadMoreItems={this.loadMoreItems}
//       >{({ onItemsRendered, ref }) => (
//         <AutoSizer>
//         {({ height, width }) => (
//           <List
//             className=""
//             height={height}
//             itemCount={this.itemCount}
//             itemSize={100}
//             onItemsRendered={onItemsRendered}
//             ref={ref}
//             width={width}
//           >
//             {this.Item}
//           </List>
//         )}
//         </AutoSizer>
//         )}
//       </InfiniteLoader>
//     );
//   }

// }


export default function ListViewer({
  // Are there more items to load?
  // (This information comes from the most recent API request.)
  hasNextPage,

  // Are we currently loading a page of items?
  // (This may be an in-flight flag in your Redux store for example.)
  isNextPageLoading,

  // Array of items loaded so far.
  items,

  // Callback function responsible for loading the next page of items.
  loadNextPage
}) {
  // If there are more items to be loaded then add an extra row to hold a loading indicator.
  const itemCount = hasNextPage ? items.length + 1 : items.length;

  // Only load 1 page of items at a time.
  // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;

  // Every row is loaded except for our loading indicator row.
  const isItemLoaded = index => !hasNextPage || index < items.length;

  // Render an item or a loading indicator.
  const Item = ({ index, style }) => {
    let content;
    if (!isItemLoaded(index)) {
      content = "Loading...";
    } else {
      content = items[index];
      content = content.title;
      // getAuthorPhoto(index);
    }

    return <div style={style} className="">
                <div className="List">{content}</div>
           </div>;
  };

  const getAuthorPhoto = (index) => {
    let authorId = items[index].author_id;
    console.log(authorId);

    const db = firebase.firestore();
    const docRef = db.collection('users').doc(authorId).get();
    docRef.then(doc => console.log(doc.data().photoURL))
  }

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMoreItems}
    >{({ onItemsRendered, ref }) => (
      <AutoSizer>
      {({ height, width }) => (
        <List
          className=""
          height={height}
          itemCount={itemCount}
          itemSize={100}
          onItemsRendered={onItemsRendered}
          ref={ref}
          width={width}
        >
          {Item}
        </List>
      )}
      </AutoSizer>
      )}
    </InfiniteLoader>
  );
}