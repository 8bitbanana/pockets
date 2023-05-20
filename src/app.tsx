import * as ohm from 'ohm-js';
import * as ohm_extras from 'ohm-js/extras';
import * as parser from './diceroll/mod';

var obj:any = {};
obj = window;

import { render } from 'preact';

const HelloWorld = () => {

    const parsed = parser.ParsedExpression.Parse("d20");
    const result = parsed.andThen((t) => t.Evaluate());

    if (result.isOk)
    {
        console.log(result.value.result);
        return <h1>{ result.value.result }</h1>;
    }
    
    return <h1>Error: { result.error }</h1>;
};

const App = () => {
    return <HelloWorld />;
};

render(<App />, document.body);