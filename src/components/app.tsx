var obj:any = {};
obj = window;

import { render, createContext, Context, Component } from 'preact';
import { AttrContainer } from 'lib/attribute';
import { Charsheet } from 'lib/charsheet';
import { CharsheetAction, CharsheetReducer } from 'lib/charsheet_actions';

import AttributeMenu from './AttributeMenu';
import EvalContainer from "./eval/EvalContainer";
import { useMemo, useReducer } from 'preact/hooks';

import { Tab, TabList, TabPanel, Tabs } from '@mui/joy';
import { CssVarsProvider } from '@mui/joy/styles';
import PkTextField from './PkTextField';
import { pocketsTheme } from './themes';

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
            <CssVarsProvider theme={pocketsTheme}>
            <CS.Provider value={updater}>
                <Tabs defaultValue={0}>
                    <TabList>
                        <Tab variant='plain' color='neutral'>Layout</Tab>
                        <Tab variant='plain' color='neutral'>Attributes</Tab>
                    </TabList>
                    <TabPanel value={0}>
                        <PkTextField text="Hello world"></PkTextField>
                    </TabPanel>
                    <TabPanel value={1}>
                        <AttributeMenu />
                        <EvalContainer eval_result={sheet.last_ran_expr} show_tree={false}/>
                    </TabPanel>
                    
                </Tabs>
            </CS.Provider>
            </CssVarsProvider>
        );
    }

}

render(<App />, document.body);