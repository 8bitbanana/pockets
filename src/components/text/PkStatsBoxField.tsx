import { Component } from "preact";
import { PkTextLabel } from "./PkTextLabel";
import { PkAttributeEditorField, PkAttributeViewerField } from "./PkAttributeField";

import * as css from "../pk.module.css";

type PkStatsBoxFieldProps = {
    base_key: string,
    mod_key: string,
    label: string
}

export default class PkStatsBoxField extends Component<PkStatsBoxFieldProps> {
    render() {
        return <div className={css.pkstatsbox}>
            <PkTextLabel label={this.props.label} />
            <div>
            <PkAttributeViewerField 
                my_key={this.props.mod_key}
                className={css.pkstatsbox_bignumber}/>
            </div>
            <PkAttributeEditorField
                my_key={this.props.base_key}
                numberinput/>
        </div>;
    }
}