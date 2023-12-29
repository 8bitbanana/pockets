var obj:any = {};
obj = window;

import 'preact/debug'

import { render, createContext, Context, Component } from 'preact';
import { AttrContainer } from 'lib/attribute';
import { Charsheet } from 'lib/charsheet';
import { CharsheetAction, CharsheetReducer } from 'lib/charsheet_actions';

import AttributeMenu from './AttributeMenu';
import EvalContainer from "./eval/EvalContainer";
import { useMemo, useReducer } from 'preact/hooks';

import { Checkbox, Tab, TabList, TabPanel, Tabs } from '@mui/joy';
import { CssVarsProvider } from '@mui/joy/styles';
import PkTextField from './PkTextField';
import { pocketsTheme } from './themes';
import PkEditModeToggle from './PkEditModeToggle';
import { TextFieldContainer } from 'lib/TextFieldContainer';
import PkSignalTest from './signal_testing/PkSignalTest';
import { DeepSignal, deepSignal } from 'deepsignal';


function createCharsheet(): Charsheet {
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

    let text_fields = new TextFieldContainer;
    text_fields.add("test", "Hello world!");

    return new Charsheet(attributes, text_fields);
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

        const [sheet, dispatch] = useReducer(CharsheetReducer, createCharsheet());

        const updater: CharsheetUpdater = useMemo(() => {
            return {
                sheet: sheet,
                dispatch: dispatch
            }
        }, [sheet]);
    
        return (
            <CssVarsProvider theme={pocketsTheme}>
            <CS.Provider value={updater}>
                <Tabs defaultValue={2}>
                    <TabList>
                        <Tab variant='plain' color='neutral'>Layout</Tab>
                        <Tab variant='plain' color='neutral'>Attributes</Tab>
                        <Tab variant='plain' color="neutral">Signal Test</Tab>
                    </TabList>
                    <TabPanel value={0}>
                        <div>
                        <PkEditModeToggle />
                        </div>
                        <div>
                        <PkTextField textfieldkey="test"></PkTextField>
                        </div>
                    </TabPanel>
                    <TabPanel value={1}>
                        <AttributeMenu />
                        <EvalContainer eval_result={sheet.last_ran_expr} show_tree={false}/>
                    </TabPanel>
                    <TabPanel value={2}>
                        <PkSignalTest />
                    </TabPanel>
                </Tabs>
            </CS.Provider>
            </CssVarsProvider>
        );
    }

}

render(<App />, document.body);