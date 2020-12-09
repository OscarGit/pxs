import React from 'react';

import { instantiateSorter, Sorter } from './Sorter';

type ImageViewProps = {
    data: ImageData;
};
type ImageViewState = {
    viewData?: ImageData;
};
export default class ImageView extends React.Component<ImageViewProps, ImageViewState> {
    _canvas?: HTMLCanvasElement;
    _fileInput?: HTMLInputElement;

    _sorter: Sorter;

    state: ImageViewState = {};

    async componentDidMount() {
        this.setState({ viewData: this.props.data });
        this._sorter = await instantiateSorter();
    }

    async triggerSort() {
        console.log(this._sorter.sortImage(this.props.data.data));
    }

    componentDidUpdate() {
        this.drawImage();
    }

    drawImage() {
        this._canvas.width = this._canvas.clientWidth;
        this._canvas.height = this._canvas.clientHeight;
        const gc = this._canvas.getContext('2d');
        gc.clearRect(0, 0, gc.canvas.width, gc.canvas.height);
        gc.putImageData(this.props.data, 0, 0);
    }

    render() {
        return (
            <div className="container">
                <canvas ref={(elem) => (this._canvas = elem)}>
                    Your browser does not support HTML5 canvas.
                </canvas>
            </div>
        );
    }
}
