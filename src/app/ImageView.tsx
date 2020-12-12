import React from 'react';

import '../styles/image-view.scss';

type ImageViewProps = {
    data: ImageData;
};
type ImageViewState = {
    dataUrl?: string;
};
export default class ImageView extends React.Component<ImageViewProps, ImageViewState> {
    _internalCanvas: HTMLCanvasElement;
    _prevData: ImageData;

    state: ImageViewState = {};

    async componentDidMount() {
        this._internalCanvas = document.createElement('canvas');
        this.updateDataUrl(this.props.data);
        this._prevData = this.props.data;
    }
    componentDidUpdate() {
        if (this._prevData !== this.props.data) {
            this.updateDataUrl(this.props.data);
            this._prevData = this.props.data;
        }
    }
    componentWillUnmount() {
        this._internalCanvas.remove();
    }

    updateDataUrl(imgData: ImageData) {
        this._internalCanvas.width = imgData.width;
        this._internalCanvas.height = imgData.height;
        const gc = this._internalCanvas.getContext('2d');
        gc.putImageData(imgData, 0, 0);
        this.setState({ dataUrl: this._internalCanvas.toDataURL('image/jpeg', 0.5) });
    }

    render() {
        return (
            <div id="view-container">
                {this.state.dataUrl ? <img id="view-img" src={this.state.dataUrl}></img> : null}
            </div>
        );
    }
}
