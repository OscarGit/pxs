import React from 'react';

type CheckboxProps = {
    text?: string;
    defaultChecked?: boolean;
    onChange?: (checked: boolean) => void;
};
type CheckboxState = {
    checked: boolean;
};

export default class Checkbox extends React.Component<CheckboxProps, CheckboxState> {
    state: CheckboxState;
    constructor(props: CheckboxProps) {
        super(props);

        this.state = {
            checked: !!props.defaultChecked,
        };
    }

    onChange(evt: React.ChangeEvent<HTMLInputElement>) {
        if (this.props.onChange) {
            this.props.onChange(evt.target.checked);
        }
    }

    render() {
        return (
            <label className="checkbox-container pxs pxs-medium">
                {this.props.text}
                <input
                    type="checkbox"
                    onChange={(evt) => {
                        this.onChange(evt);
                    }}
                />
                <span className="checkmark"></span>
            </label>
        );
    }
}
