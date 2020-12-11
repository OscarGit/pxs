import React from 'react';
import { SortOptions } from './Sorter';

type ControlId = 'dir-checkbox' | 'threshold';

const defaultOptions: SortOptions = {
    desc: false,
    direction: 'horizontal',
    lowerRange: 0,
    upperRange: 0.5,
};

type ControlPanelProps = {
    onSortImage: (options: SortOptions) => void;
};
type ControlPanelState = {};
export default class ControlPanel extends React.Component<ControlPanelProps, ControlPanelState> {
    state: ControlPanelState = {};

    _options: SortOptions;

    constructor(props: ControlPanelProps) {
        super(props);

        this._options = {
            ...defaultOptions,
        };
    }

    onClickSort() {
        this.props.onSortImage(this._options);
    }

    onChange(evt: React.ChangeEvent<HTMLInputElement>) {
        const ctrlId = evt.target.id as ControlId;

        if (ctrlId == 'dir-checkbox') {
            this._options.desc = evt.target.checked;
        } else if (ctrlId == 'threshold') {
            this._options.lowerRange = 0;
            this._options.upperRange = Number.parseFloat(evt.target.value) / 1000;
        }
    }

    render() {
        return (
            <div id="control-panel">
                <div id="controls-container">
                    <div className="input-container">
                        <input
                            id="dir-checkbox"
                            type="checkbox"
                            defaultChecked={this._options.desc}
                            onChange={this.onChange.bind(this)}
                        />
                        <label>Reverse</label>
                    </div>
                    <div className="input-container">
                        <input
                            id="threshold"
                            type="range"
                            min="0"
                            max="1000"
                            onChange={this.onChange.bind(this)}
                        />
                        <label>Threshold</label>
                    </div>
                </div>
                <button id="sort-btn" className="psx-font" onClick={this.onClickSort.bind(this)}>
                    sort
                </button>
            </div>
        );
    }
}
