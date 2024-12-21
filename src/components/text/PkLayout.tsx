import { Component } from "preact";
import PkTextField, { PkHeadingTextField } from "./PkTextField";
import { PkAttributeEditorField, PkAttributeViewerField } from "./PkAttributeField";

import * as css from "../pk.module.css";
import PkStatsBoxField from "./PkStatsBoxField";

export default class PkLayout extends Component {
    render() {
        return <div>

            <div className={css.flex}>
                <PkHeadingTextField className={css.character_name} my_key="name" label="Character Name" />

                <div className={css.flexchild_grow}>
                    <div className={css.flex}>
                        <PkHeadingTextField  className={css.flexchild_grow} my_key="class" label="Class & Level" />
                        <PkHeadingTextField my_key="background" label="Background" />
                    </div>

                    <div className={css.flex}>
                        <PkHeadingTextField className={css.flexchild_grow} my_key="race" label="Race" />
                        <PkHeadingTextField my_key="size" label="Size" />
                        <PkHeadingTextField className={css.flexchild_grow} my_key="alignment" label="Alignment" />
                    </div>
                </div>
            </div>

            <hr />

            <div className={css.flex}>
                <div id="col1-stats">
                    <PkStatsBoxField base_key="str" mod_key="str_mod" label="Strength" />
                    <PkStatsBoxField base_key="dex" mod_key="dex_mod" label="Dexterity" />
                    <PkStatsBoxField base_key="con" mod_key="con_mod" label="Constitution" />
                    <PkStatsBoxField base_key="int" mod_key="int_mod" label="Intelligence" />
                    <PkStatsBoxField base_key="wis" mod_key="wis_mod" label="Wisdom" />
                    <PkStatsBoxField base_key="cha" mod_key="cha_mod" label="Charisma" />
                </div>
                <div id="col2-skills">

                </div>
                <div id="col3-attacks" className={css.flexchild_grow}>

                </div>
                <div id="col4-feats">

                </div>
            </div>
        </div>
    }
}