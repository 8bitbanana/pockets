import * as ohm from 'ohm-js';
import * as ohm_extras from 'ohm-js/extras';
import * as parser from 'lib/diceroll/mod';

var obj:any = {};
obj = window;

import { render, createContext, Context } from 'preact';
import { AttrContainer } from 'lib/attribute';
import { MyResult } from 'lib/errors';
import { ok, err } from 'true-myth/dist/public/result';
import { Charsheet } from 'lib/charsheet';

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
        attributes.add(kvp[0], kvp[1]);
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

export let CS: Context<Charsheet> = createContext({} as Charsheet);

const App = () => {

    const attributes = createAttrContainer();

    if (attributes.isOk) {
        return (
            <CS.Provider value={new Charsheet(attributes.value)}>
                <AttributeMenu />
            </CS.Provider>
        );
    } else {
        return <h1>Err</h1>;
    }
};

render(<App />, document.body);