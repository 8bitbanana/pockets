import { Component } from "preact";
import PkTextField, { PkHeadingTextField } from "./PkTextField";

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
        </div>
    }
}