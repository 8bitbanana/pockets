var obj:any = {};
obj = window;

import { render, createContext, Context, Component } from 'preact';
import { AttrContainer } from 'lib/attribute';
import { Charsheet } from 'lib/charsheet';
import { CharsheetAction, CharsheetReducer } from 'lib/charsheet_actions';

import AttributeMenu from './AttributeMenu';
import EvalMsgBox from "./EvalMsgBox";
import { useMemo, useReducer } from 'preact/hooks';

import { Button, Tab, TabList, TabPanel, Tabs } from '@mui/joy';

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
                <Tabs defaultValue={0}>
                    <TabList>
                        <Tab variant='plain' color='neutral'>Attributes</Tab>
                        <Tab variant='plain' color='neutral'>Button Test</Tab>
                    </TabList>
                    <TabPanel value={0}>
                        <AttributeMenu />
                        <EvalMsgBox eval_result={sheet.last_ran_expr}/>
                    </TabPanel>
                    <TabPanel value={1}>
                        <Button variant="solid">Hello world!</Button>
                    </TabPanel>
                </Tabs>
            </CS.Provider>
        );
    }

}

render(<App />, document.body);