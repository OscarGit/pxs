import * as React from 'react';
export interface HelloWorldProps {
    text: string;
}
export const App = (props: HelloWorldProps) => <h1>Hi {props.text} from my home!</h1>;
