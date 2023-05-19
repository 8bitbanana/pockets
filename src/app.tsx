import * as ohm from 'ohm-js';
import * as ohm_extras from 'ohm-js/extras';
import * as parser from './diceroll/mod';

var obj:any = {};
obj = window;

obj.parseFunc = function(expr: string) {
    const parsed = parser.ParsedExpression.Parse(expr);
    console.log(parsed?.Evaluate());
    return parsed;
};

console.log('Hello world!');

import { render } from 'preact';
import { Router } from 'preact-router'

const HelloWorld = () => {
    return <h1>Hello world!</h1>;
};

const App = () => {
    return <HelloWorld />;
};

render(<App />, document.body);