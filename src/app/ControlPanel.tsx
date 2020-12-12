import React from 'react';

import '../styles/control-panel.scss';
import Checkbox from './elements/Checkbox';
import Dropdown from './elements/Dropdown';
import Slider from './elements/Slider';
import { ColorAttribute, SortOptions } from './Sorter';

type ControlId = 'selection-type' | 'threshold' | 'dir-checkbox';

const colorAttributes: { value: ColorAttribute; display: string }[] = [
    {
        value: 'brightness',
        display: 'Brightness',
    },
    {
        value: 'saturation',
        display: 'Saturation',
    },
    {
        value: 'hue',
        display: 'Hue',
    },
    {
        value: 'raw',
        display: 'Raw',
    },
];

const defaultOptions: SortOptions = {
    attribute: 'brightness',
    invert: false,
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

    onChangeSelectAttr(value: ColorAttribute) {
        this._options.attribute = value;
        this.forceUpdate();
    }
    onChangeFlip(checked: boolean) {
        this._options.invert = checked;
        this.forceUpdate();
    }
    onChangeSortAttr(value: ColorAttribute) {
        this._options.attribute = value;
    }

    onChangeOrder(desc: boolean) {
        this._options.desc = desc;
        this.forceUpdate();
    }
    onChangeDirection(checked: boolean) {
        this._options.direction = checked ? 'vertical' : 'horizontal';
        this.forceUpdate();
    }

    onChange(evt: React.ChangeEvent<HTMLInputElement>) {
        const ctrlId = evt.target.id as ControlId;

        if (ctrlId == 'threshold') {
            this._options.lowerRange = 0;
            this._options.upperRange = Number.parseFloat(evt.target.value) / 1000;
        } else if (ctrlId == 'dir-checkbox') {
            this._options.direction = evt.target.checked ? 'vertical' : 'horizontal';
        } else {
            console.warn(`Unknown id in change event: ${ctrlId}`);
        }
    }

    render() {
        return (
            <div id="control-panel">
                <div id="controls-container">
                    <div className="control-group pxs pxs-medium">Selection</div>
                    <label className="input-label pxs pxs-small">Select by</label>
                    <div className="input-container">
                        {/* Select attribute */}
                        <Dropdown
                            options={colorAttributes}
                            onChange={this.onChangeSelectAttr.bind(this)}
                        />
                    </div>
                    <label className="input-label pxs pxs-small">Threshold</label>
                    <div className="input-container">
                        {/* Threshold */}
                        <div>
                            <Checkbox text="Flip" onChange={this.onChangeFlip.bind(this)} />
                        </div>
                        <Slider invert={this._options.invert} type={this._options.attribute} />
                    </div>
                    <div className="control-group pxs pxs-medium">Sorting</div>
                    <div className="input-container">
                        {/* Reverse order */}
                        <Checkbox
                            text={this._options.desc ? 'Descending' : 'Ascending'}
                            onChange={this.onChangeOrder.bind(this)}
                        />
                    </div>
                    <div className="input-container">
                        {/* Select sort direction */}
                        <Checkbox
                            text={
                                this._options.direction === 'vertical' ? 'Vertical' : 'Horizontal'
                            }
                            onChange={this.onChangeDirection.bind(this)}
                        />
                    </div>
                    <label className="input-label pxs pxs-small">Sort by</label>
                    <div className="input-container">
                        {/* Sort attibute */}
                        <Dropdown
                            options={colorAttributes}
                            onChange={this.onChangeSortAttr.bind(this)}
                        />
                    </div>
                </div>
                <button
                    id="sort-btn"
                    className="pxs pxs-large"
                    onClick={this.onClickSort.bind(this)}
                >
                    Sort
                </button>
            </div>
        );
    }
}
