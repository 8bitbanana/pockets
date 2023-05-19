import * as ohm from 'ohm-js';
import * as ohm_extras from 'ohm-js/extras';
import * as parser from './diceroll/mod';

var obj:any = {};
obj = window;

let parseFunc = function(expr: string) {
    const parsed = parser.ParsedExpression.Parse(expr);
    console.log(parsed?.Evaluate());
    return parsed;
};

import { render } from 'preact';

const HelloWorld = () => {
    return <h1>{ parseFunc("d20")?.Evaluate()?.result }</h1>;
};

const App = () => {
    return <HelloWorld />;
};

render(<App />, document.body);