var obj:any = {};
obj = window;

import 'preact/debug'

import { render, createContext, Context, Component } from 'preact';
import { AttrContainer } from 'lib/attribute';
import { Charsheet } from 'lib/charsheet';

import AttributeMenu from './AttributeMenu';
import EvalContainer from "./eval/EvalContainer";

import { Tab, TabList, TabPanel, Tabs } from '@mui/joy';
import { CssVarsProvider } from '@mui/joy/styles';
import PkTextField from './PkTextField';
import { pocketsTheme } from './themes';
import PkEditModeToggle from './PkEditModeToggle';
import { TextFieldContainer } from 'lib/TextFieldContainer';
import PkSignalTest from './testing/PkSignalTest';
import PkMapListTest from './testing/PkMapListTest';
import { CharsheetApp } from './charsheet_app';


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
    text_fields.add("test1", "Hello world!");
    text_fields.add("test2", "Hello world!");

    return new Charsheet(attributes, text_fields);
}

export type CharsheetContext = {
    sheet: CharsheetApp,
}

export let CS: Context<CharsheetContext> = createContext({} as CharsheetContext);

class App extends Component<{}, {}> {

    constructor() {
        super();
    }

    render() {

        //const [sheet, dispatch] = useReducer(CharsheetReducer, createCharsheet());

        // const updater: CharsheetUpdater = useMemo(() => {
        //     return {
        //         sheet: sheet,
        //         dispatch: dispatch
        //     }
        // }, [sheet]);
    
        const sheet = new CharsheetApp(createCharsheet());

        return (
            <CssVarsProvider theme={pocketsTheme}>
            <CS.Provider value={{sheet}}>
                <Tabs defaultValue={0}>
                    <TabList>
                        <Tab variant='plain' color='neutral'>Layout</Tab>
                        <Tab variant='plain' color='neutral'>Attributes</Tab>
                        <Tab variant='plain' color="neutral">Signal Test</Tab>
                        <Tab variant='plain' color="neutral">Map list Test</Tab>
                    </TabList>
                    <TabPanel value={0}>
                        <div>
                        <PkEditModeToggle />
                        </div>
                        <div>
                        <PkTextField my_key="test1"></PkTextField>
                        <PkTextField my_key="test2"></PkTextField>
                        </div>
                    </TabPanel>
                    <TabPanel value={1}>
                        <AttributeMenu attributes={sheet.attributes} />
                        <EvalContainer eval_result={sheet.last_ran_expr} show_tree={false}/>
                    </TabPanel>
                    <TabPanel value={2}>
                        <PkSignalTest />
                    </TabPanel>
                    <TabPanel value={3}>
                        <PkMapListTest />
                    </TabPanel>
                </Tabs>
            </CS.Provider>
            </CssVarsProvider>
        );
    }

}

render(<App />, document.body);