import React from 'react';

import '../styles/global.scss';
import ImageView from './ImageView';
import FileSelect from './FileSelect';
import ControlPanel from './ControlPanel';
import { instantiateSorter, Sorter, SortOptions } from './Sorter';

type MainWindowProps = {};
type MainWindowState = {
    data?: ImageData;
    sortedData?: ImageData;
};

export default class MainWindow extends React.Component<MainWindowProps, MainWindowState> {
    _sorter: Sorter;
    state: MainWindowState = {};

    async componentDidMount() {
        this._sorter = await instantiateSorter();
        this.getExampleImg();
    }

    async sortImage(options: SortOptions) {
        try {
            const imgData = this.state.data;
            const sortedData = await this._sorter.sortImage(
                imgData.data,
                imgData.width,
                imgData.height,
                options
            );
            const sortedImage: ImageData = new ImageData(sortedData, imgData.width, imgData.height);
            this.setState({ sortedData: sortedImage });
        } catch (err) {
            console.error(err);
        }
    }

    getExampleImg() {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const gc = canvas.getContext('2d');
            gc.drawImage(img, 0, 0);
            const imgData = gc.getImageData(0, 0, img.width, img.height);
            canvas.remove();
            this.setState({ data: imgData });
        };
        img.src = 'img.jpg';
    }

    render() {
        const imgData = this.state.sortedData ?? this.state.data ?? null;
        const haveImage = !!imgData;
        return (
            <div id="main-window-container">
                {haveImage ? (
                    <ImageView data={imgData} />
                ) : (
                    <FileSelect onFileLoaded={(data) => void this.setState({ data })} />
                )}
                {haveImage ? <ControlPanel onSortImage={this.sortImage.bind(this)} /> : null}
            </div>
        );
    }
}
