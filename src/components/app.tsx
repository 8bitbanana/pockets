import * as ohm from 'ohm-js';
import * as ohm_extras from 'ohm-js/extras';
import * as parser from '../diceroll/mod';

var obj:any = {};
obj = window;

import { render } from 'preact';
import { AttrContainer } from '../attribute';
import { MyResult } from '../errors';
import { ok, err } from 'true-myth/dist/public/result';

import "./AttributeMenu";
import AttributeMenu from './AttributeMenu';

function createAttrContainer(): MyResult<AttrContainer> {
    let attributes = new AttrContainer;
    
    let unparsed = [
        ["attack_roll", "d20"],
        ["str", "2"],
        ["weapon_attack_roll", "[attack_roll]+[weapon_attack_modifier]"],
        ["weapon_attack_modifier", "[str]+[pb]"],
        ["pb", "4"],
    ];

    for (const kvp of unparsed) {
        const parsed = parser.ParsedExpression.Parse(kvp[1]);
        if (parsed.isErr) {
            return err(parsed.error);
        }
        attributes.add(kvp[0], parsed.value);
    }

    return ok(attributes);
}

const HelloWorld = () => {

    const attributes = createAttrContainer();

    const result = attributes.andThen((t) => t.evaluate("weapon_attack_roll"));

    if (result.isOk)
    {
        console.log(result.value.result);
        return <h1>{ result.value.result }</h1>;
    }
    else
    {
        console.log(result.error);
        return <h1>Error: { result.error }</h1>;
    }
};

const App = () => {

    const attributes = createAttrContainer();

    if (attributes.isOk) {
        return <AttributeMenu attribute_container={attributes.value} />;
    } else {
        return <h1>Err</h1>;
    }
};

render(<App />, document.body);