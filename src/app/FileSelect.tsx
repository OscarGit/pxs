import React, { ChangeEvent } from 'react';

function isHTMLInputElement(elem: Element): elem is HTMLInputElement {
    return elem.constructor.name == 'HTMLInputElement';
}

async function getImageData(file: File) {
    return new Promise<ImageData>((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = () => {
            const img = new Image();
            img.onload = () => {
                const canvasBuffer = document.createElement('canvas');
                canvasBuffer.width = img.width;
                canvasBuffer.height = img.height;
                const gc = canvasBuffer.getContext('2d');
                gc.drawImage(img, 0, 0);
                const imgData = gc.getImageData(0, 0, img.width, img.height);
                canvasBuffer.remove();
                resolve(imgData);
            };
            const result = fileReader.result;
            if (typeof result !== 'string') {
                reject(new Error('FileReader result was not a string'));
            } else {
                img.src = result;
            }
        };
        fileReader.readAsDataURL(file);
    });
}

type FileSelectProps = {
    onFileLoaded: (data: ImageData) => void;
};
type FileSelectState = {};
export default class FileSelect extends React.Component<FileSelectProps, FileSelectState> {
    _fileInput?: HTMLInputElement;

    state: FileSelectState = {};

    async loadImageChange(event: ChangeEvent) {
        const elem = event.target;

        if (!isHTMLInputElement(elem)) {
            console.error('onChange event was not on a input element');
            // TODO: Display error to user
            return;
        }

        if (elem.files.length !== 1) {
            console.error('Can only load one file');
            // TODO: Validate through input element
            return;
        }

        const data = await getImageData(elem.files[0]);
        this.props.onFileLoaded(data);
    }
    render() {
        return (
            <div id="load-btn-container">
                <input
                    ref={(elem) => (this._fileInput = elem)}
                    id="file-input"
                    type="file"
                    onChange={(e) => {
                        this.loadImageChange.bind(this)(e);
                    }}
                />
                <button
                    id="load-btn"
                    className="psx-font"
                    onClick={() => {
                        this._fileInput.click();
                    }}
                >
                    load image
                </button>
            </div>
        );
    }
}
