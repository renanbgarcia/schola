import React from 'react';

const ImagePreviewer = ({ src }) => {
    return (
        // <div style={{height: '100%', width: '100%'}}>
            <img style={{objectFit: 'contain'}} src={src}/>
            // <img style={{height: '100%', objectFit: 'contain'}} src={src}/>
        // </div>
    )
}

export default ImagePreviewer