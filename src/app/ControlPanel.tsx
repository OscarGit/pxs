import React from 'react';

import '../styles/control-panel.scss';
import Checkbox from './elements/Checkbox';
import Dropdown from './elements/Dropdown';
import Slider from './elements/Slider';
import { ColorAttribute, SortOptions } from './Sorter';

type ControlId = 'selection-type' | 'threshold' | 'dir-checkbox';
type ActionId = 'save' | 'discard' | 'reset';

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
    selectBy: 'brightness',
    invert: false,
    lowerRange: 0,
    upperRange: 0.5,
    desc: false,
    direction: 'horizontal',
    sortBy: 'brightness',
};

type ControlPanelProps = {
    onSortImage: (options: SortOptions) => void;
    onSaveImage: () => void;
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

    onChangeSelectBy(value: ColorAttribute) {
        this._options.selectBy = value;
        this.forceUpdate();
    }
    onChangeInvert(checked: boolean) {
        this._options.invert = checked;
        this.forceUpdate();
    }
    onChangeRange(sliderA: number, sliderB: number) {
        this._options.lowerRange = sliderA;
        this._options.upperRange = sliderB;
    }
    onChangeSortBy(value: ColorAttribute) {
        this._options.sortBy = value;
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

    onClickAction(action: ActionId) {
        switch (action) {
            case 'save':
                if (this.props.onSaveImage) this.props.onSaveImage();
                break;
            case 'discard':
                break;
            case 'reset':
                break;
            default:
                console.error(`Unknown action: ${action}`);
                break;
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
                            onChange={this.onChangeSelectBy.bind(this)}
                        />
                    </div>
                    <label className="input-label pxs pxs-small">Threshold</label>
                    <div className="input-container">
                        {/* Threshold */}
                        <div>
                            <Checkbox text="Flip" onChange={this.onChangeInvert.bind(this)} />
                        </div>
                        <Slider
                            invert={this._options.invert}
                            type={this._options.selectBy}
                            onChange={this.onChangeRange.bind(this)}
                        />
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
                            onChange={this.onChangeSortBy.bind(this)}
                        />
                    </div>
                </div>
                <div className="actions-container">
                    <button
                        className="pxs pxs-small"
                        onClick={() => this.onClickAction.bind(this)('save')}
                    >
                        Save
                    </button>
                    <button
                        className="pxs pxs-small"
                        onClick={() => this.onClickAction.bind(this)('discard')}
                    >
                        Discard
                    </button>
                    <button
                        className="pxs pxs-small"
                        onClick={() => this.onClickAction.bind(this)('reset')}
                    >
                        Reset
                    </button>
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
