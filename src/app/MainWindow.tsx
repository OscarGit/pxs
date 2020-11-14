import React from 'react';

import ImageView from './ImageView';
import '../styles/global.scss';

type MainWindowProps = {};
type MainWindowState = {};

export default class MainWindow extends React.Component<MainWindowProps, MainWindowState> {
    state: MainWindowState = {};

    render() {
        return (
            <div className="main-container">
                <ImageView />
            </div>
        );
    }
}
