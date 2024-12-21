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
    
    // let unparsed = [
    //     ["attack_roll", "d20"],
    //     ["str", "2"],
    //     ["weapon_attack_roll", "[attack_roll]+[weapon_attack_modifier]"],
    //     ["weapon_attack_modifier", "[str]+[pb]"],
    //     ["pb", "4"],
    // ];

    // roll mod = 

    let unparsed = [
        ["roll", "d20"],
        ["pb", "3"],

        ["str", "8"],
        ["str_mod", "([str]-10)//2"],
        ["str_check", "[roll]+[str_mod]"],
        ["dex", "15"],
        ["dex_mod", "([dex]-10)//2"],
        ["dex_check", "[roll]+[dex_mod]"],
        ["con", "18"],
        ["con_mod", "([con]-10)//2"],
        ["con_check", "[roll]+[con_mod]"],
        ["int", "9"],
        ["int_mod", "([int]-10)//2"],
        ["int_check", "[roll]+[int_mod]"],
        ["wis", "11"],
        ["wis_mod", "([wis]-10)//2"],
        ["wis_check", "[roll]+[wis_mod]"],
        ["cha", "20"],
        ["cha_mod", "([cha]-10)//2"],
        ["cha_check", "[roll]+[cha_mod]"],
    ]

    type Override = {
        key: string
        value: string
    }

    type Overrides = [string, Override[]][];

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
                <Tabs defaultValue={0}>
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