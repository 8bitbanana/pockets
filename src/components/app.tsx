import * as ohm from 'ohm-js';
import * as ohm_extras from 'ohm-js/extras';
import * as parser from 'lib/diceroll/mod';

var obj:any = {};
obj = window;

import { render, createContext, Context, Component } from 'preact';
import { AttrContainer } from 'lib/attribute';
import { MyResult } from 'lib/errors';
import { ok, err } from 'true-myth/dist/public/result';
import { Charsheet } from 'lib/charsheet';

import "./AttributeMenu";
import AttributeMenu from './AttributeMenu';
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

export enum CharsheetAction {
    ADD_BLANK_ATTRIBUTE = "ADD_BLANK_ATTRIBUTE"
}

function CharsheetReducer(old_sheet: Charsheet, action: CharsheetAction) {

    let sheet: Charsheet = {...old_sheet};

    console.info("Action: " + action);

    switch (action) {
        case CharsheetAction.ADD_BLANK_ATTRIBUTE:

            let count = 0
            while (count++ < 1000) {
                const name = "new" + count;
                if (!sheet.attributes.has(name)) {
                    sheet.attributes.add(name, "0");
                    break;
                }
            }
            break; 
        default:
            return old_sheet;
    }

    return sheet;
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
            </CS.Provider>
        );
    }

}

render(<App />, document.body);