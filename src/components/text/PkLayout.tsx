import { Component } from "preact";
import PkTextField, { PkHeadingTextField, PkAttributeEditorField, PkAttributeViewerField } from "./PkTextField";

import * as css from "../pk.module.css";

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
                    <PkAttributeEditorField my_key="str" label="Strength" />
                    <PkAttributeViewerField my_key="str_mod" />
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