import React from 'react';

import sorter from '../wasm/sorter.go';

type ImageViewProps = {
    data: ImageData;
};
type ImageViewState = {};
export default class ImageView extends React.Component<ImageViewProps, ImageViewState> {
    _canvas?: HTMLCanvasElement;
    _fileInput?: HTMLInputElement;

    state: ImageViewState = {};

    async componentDidMount() {
        this._canvas.width = this._canvas.clientWidth;
        this._canvas.height = this._canvas.clientHeight;
        const gc = this._canvas.getContext('2d');
        gc.clearRect(0, 0, gc.canvas.width, gc.canvas.height);
        gc.putImageData(this.props.data, 0, 0);

        await sorter.sortImage(this.props.data.data);
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
