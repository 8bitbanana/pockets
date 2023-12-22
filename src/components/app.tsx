import * as ohm from 'ohm-js';
import * as ohm_extras from 'ohm-js/extras';
import * as parser from 'lib/diceroll/mod';

var obj:any = {};
obj = window;

import { render, createContext, Context, Component } from 'preact';
import { AttrContainer } from 'lib/attribute';
import { MyResult } from 'lib/errors';
import { ok, err } from 'true-myth/dist/es/result';
import { Charsheet } from 'lib/charsheet';
import { CharsheetAction, CharsheetReducer } from 'lib/charsheet_actions';

import AttributeMenu from './AttributeMenu';
import EvalMsgBox from "./EvalMsgBox";
import { StateUpdater, useMemo, useReducer, useState } from 'preact/hooks';

function createAttrContainer(): AttrContainer {
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

    return attributes;
}

// export type CharsheetUpdater = {
//     getter: Charsheet;
//     setter: StateUpdater<Charsheet>
// }

export type CharsheetUpdater = {
    sheet: Charsheet,
    dispatch: (action: CharsheetAction) => void
}

export let CS: Context<CharsheetUpdater> = createContext({} as CharsheetUpdater);

class App extends Component<{}, {}> {

    constructor() {
        super();
    }

    render() {

        const [sheet, dispatch] = useReducer(CharsheetReducer, new Charsheet(createAttrContainer()));

        const updater: CharsheetUpdater = useMemo(() => {
            return {
                sheet: sheet,
                dispatch: dispatch
            }
        }, [sheet]);
    
        return (
            <CS.Provider value={updater}>
                <AttributeMenu />
                <EvalMsgBox eval_result={sheet.last_ran_expr}/>
            </CS.Provider>
        );
    }

}

render(<App />, document.body);