import React from 'react';

import { instantiateSorter, Sorter } from './Sorter';

type ImageViewProps = {
    data: ImageData;
};
type ImageViewState = {
    dataUrl?: string;
};
export default class ImageView extends React.Component<ImageViewProps, ImageViewState> {
    _sorter: Sorter;
    _internalCanvas: HTMLCanvasElement;

    state: ImageViewState = {};

    async componentDidMount() {
        this._sorter = await instantiateSorter();
        this._internalCanvas = document.createElement('canvas');
        const dataUrl = this.createDataUrl(this.props.data);
        this.setState({ dataUrl });
        setTimeout(this.triggerSort.bind(this), 5000);
        console.log('Mounted');
    }
    componentWillUnmount() {
        this._internalCanvas.remove();
    }

    createDataUrl(imgData: ImageData) {
        this._internalCanvas.width = imgData.width;
        this._internalCanvas.height = imgData.height;
        const gc = this._internalCanvas.getContext('2d');
        gc.putImageData(imgData, 0, 0);
        return this._internalCanvas.toDataURL('image/jpeg', 0.5);
    }

    async triggerSort() {
        const sortedImage: ImageData = new ImageData(
            await this._sorter.sortImage(this.props.data.data),
            this.props.data.width,
            this.props.data.height
        );
        const dataUrl = this.createDataUrl(sortedImage);
        this.setState({ dataUrl });
    }

    render() {
        console.log('Rendering');
        return (
            <div id="view-container">
                {this.state.dataUrl ? <img id="view-img" src={this.state.dataUrl}></img> : null}
            </div>
        );
    }
}
