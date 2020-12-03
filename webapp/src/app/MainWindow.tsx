import React from 'react';

import ImageView from './ImageView';
import FileSelect from './FileSelect';
import '../styles/global.scss';

type MainWindowProps = {};
type MainWindowState = {
    data?: ImageData;
};

export default class MainWindow extends React.Component<MainWindowProps, MainWindowState> {
    state: MainWindowState = {};

    render() {
        return (
            <div className="container">
                {this.state.data ? (
                    <ImageView data={this.state.data} />
                ) : (
                    <FileSelect onFileLoaded={(data) => this.setState({ data })} />
                )}
            </div>
        );
    }
}
