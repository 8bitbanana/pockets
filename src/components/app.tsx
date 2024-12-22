var obj:any = {};
obj = window;

import 'preact/debug'

import { render, createContext, Context, Component } from 'preact';
import { AttrContainer, UnparsedAttrContainer } from 'lib/attribute';
import { Charsheet } from 'lib/charsheet';

import AttributeMenu from './AttributeMenu';
import EvalContainer from "./eval/EvalContainer";

import { Tab, TabList, TabPanel, Tabs } from '@mui/joy';
import { CssVarsProvider } from '@mui/joy/styles';
import PkTextField from './text/PkTextField';
import { pocketsTheme } from './themes';
import PkEditModeToggle from './PkEditModeToggle';
import { TextFieldContainer } from 'lib/TextFieldContainer';
import PkSignalTest from './testing/PkSignalTest';
import PkMapListTest from './testing/PkMapListTest';
import { CharsheetApp } from './charsheet_app';
import PkLayout from './text/PkLayout';


function createCharsheet(): Charsheet {
    let attributes = new UnparsedAttrContainer;

    let unparsed = [
        ["gen_stat", "4d6d1"],
        //["roll", "5d20kh2"],
        // ["pb", "3"],
        // ["stat_mod", "([input]-10)//2"],

        // ["str", "8"],
        // ["str_mod", "[stat_mod([str])]"],
        // ["str_check", "[roll]+[str_mod]"],
        // ["dex", "15"],
        // ["dex_mod", "[stat_mod([dex])]"],
        // ["dex_check", "[roll]+[dex_mod]"],
        // ["con", "18"],
        // ["con_mod", "[stat_mod([con])]"],
        // ["con_check", "[roll]+[con_mod]"],
        // ["int", "9"],
        // ["int_mod", "[stat_mod([int])]"],
        // ["int_check", "[roll]+[int_mod]"],
        // ["wis", "11"],
        // ["wis_mod", "[stat_mod([wis])]"],
        // ["wis_check", "[roll]+[wis_mod]"],
        // ["cha", "20"],
        // ["cha_mod", "[stat_mod([cha])]"],
        // ["cha_check", "[roll]+[cha_mod]"],
    ];

    type Override = {
        key: string
        value: string
    }

    type Overrides = [string, Override[]][];


    // stat_mod: ([input]-10)//2
    // str_mod: [stat_mod][str]
    // str_mod: [stat_mod(str)]

    let overrides: Overrides = [
        ["advantage", [{key: "attack_roll", value: "(2[input]kh1)"}]]
    ]

    for (const kvp of unparsed) {
        attributes.add_attribute(kvp[0], kvp[1]);
    }

    let text_fields = new TextFieldContainer;
    text_fields.set("name", "Mixolydian");
    text_fields.set("class", "Sorcerer 11");
    text_fields.set("race", "Reborn")
    text_fields.set("background", "Hermit");
    text_fields.set("size", "Medium");
    text_fields.set("alignment", "Lawful Good");

    return new Charsheet(new AttrContainer(attributes), text_fields);
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
    
        const sheet = new CharsheetApp(createCharsheet());

        return (
            <CssVarsProvider theme={pocketsTheme}>
            <CS.Provider value={{sheet}}>
                <Tabs defaultValue={1}>
                    <TabList>
                        <Tab variant='plain' color='neutral'>Layout</Tab>
                        <Tab variant='plain' color='neutral'>Attributes</Tab>
                        <Tab variant='plain' color="neutral">Signal Test</Tab>
                        <Tab variant='plain' color="neutral">Map list Test</Tab>
                    </TabList>
                    <TabPanel value={0}>
                        <PkEditModeToggle />
                        <PkLayout />
                    </TabPanel>
                    <TabPanel value={1}>
                    <EvalContainer eval_result={sheet.last_ran_expr} show_tree={false}/>
                        <AttributeMenu attributes={sheet.attributes} />
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