import React from 'react';

import ImageView from './ImageView';
import '../styles/global.scss';
import FileSelect from './FileSelect';

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
