import React from 'react';
import PdfPreviewer from './pdfPreviewer';
import  ImagePreviewer from './imagePreviewer';

class FilePreviewer extends React.Component {

    getType(url) {
        if(typeof url === 'string') {
            let splitString = url.split('.');
            console.log(splitString)
            const ext = splitString[splitString.length - 1];
            const images = ['png', 'jpg', 'jpeg', 'bmp', 'webp'];
            if (images.indexOf(ext) !== -1) {
                return 'image';
            } else if(ext === 'pdf') {
                return 'pdf';
            } else {
                return 'Formato não suportado';
            }
        } else {
            throw new TypeError('O parâmetro \'url\' precisa ser uma String.');
        }
    }

    typeSwitch() {
        return this.props.files.map(file => {
            console.log(file, this.getType(file.name))
            switch (this.getType(file.name)) {
                case 'image':
                    console.log('é imagem')
                    return <ImagePreviewer src={file.url}/>;
                case 'pdf':
                    console.log('é pdf')
                    return <PdfPreviewer src={file.url}/>;
                default:
                    console.log('Nenhum arquivo válido encontrado.')
                    break;
            }
        })
    }

    render() {
        return (
            <>
                {this.typeSwitch()}
            </>
        )
    }
}

export default FilePreviewer