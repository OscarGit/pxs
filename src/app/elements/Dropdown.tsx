import React from 'react';

type DropdownProps = {
    options: { value: string; display: string }[];
    placeholder?: string;
    onChange?: (value: string) => void;
};
type DropdownState = {
    value: string;
    show: boolean;
};

export default class Dropdown extends React.Component<DropdownProps, DropdownState> {
    state: DropdownState = {
        value: '',
        show: false,
    };

    constructor(props: DropdownProps) {
        super(props);

        if (this.props.options.length > 0) {
            this.state.value = props.options[0].value;
        } else {
            this.state.value = this.props.placeholder ?? ' ';
        }
    }

    onClickHead() {
        this.setState({ show: !this.state.show });
    }
    onClickOpt(value: string) {
        this.setState({
            value: value,
            show: false,
        });
        if (typeof this.props.onChange === 'function') {
            this.props.onChange(value);
        }
    }

    getDisplayFromValue(value: string) {
        if (!value) return '';
        for (let attr of this.props.options) {
            if (attr.value === value) return attr.display;
        }
        console.warn(`Could not find value '${value}' in Dropdown options.`);
        return '';
    }

    render() {
        return (
            <div className="dropdown">
                <div onClick={this.onClickHead.bind(this)} className="dropdown-btn pxs pxs-medium">
                    {this.getDisplayFromValue(this.state.value)}
                </div>
                <div
                    style={{ display: this.state.show ? 'block' : 'none' }}
                    className="dropdown-container"
                >
                    {this.props.options.map((attr, i) => (
                        <div
                            className="dropdown-option pxs pxs-medium"
                            onClick={() => {
                                this.onClickOpt(attr.value);
                            }}
                            key={i}
                        >
                            {attr.display}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}
