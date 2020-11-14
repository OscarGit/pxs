import React from 'react';

type ImageViewProps = {};
type ImageViewState = {
    current: 'loadImage' | 'viewImage';
};
export default class ImageView extends React.Component<ImageViewProps, ImageViewState> {
    _canvas?: HTMLCanvasElement;

    state: ImageViewState = {
        current: 'loadImage',
    };

    loadImageClick($this: ImageView) {
        // TODO: load image
        $this.setState({
            current: 'viewImage',
        });
    }
    render() {
        return (
            <div className="image-view-container">
                {this.state.current == 'viewImage' ? (
                    <canvas ref={(elem) => (this._canvas = elem)}></canvas>
                ) : null}
                {this.state.current == 'loadImage' ? (
                    <div className="load-btn-container">
                        <button
                            id="load-btn"
                            onClick={() => {
                                this.loadImageClick(this);
                            }}
                        >
                            Load image
                        </button>
                    </div>
                ) : null}
            </div>
        );
    }
}
