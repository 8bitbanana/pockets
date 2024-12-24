import { Component } from "preact"
import { PkSwitch, PkTriSwitch } from "./PkSwitch"
import { PkAttributeViewerField } from "./PkAttributeField"
import { PkTextLabel } from "./PkTextLabel"
import * as css from "../pk.module.css"

type PkSkillFieldProps = {
    prof_key: string,
    mod_key: string,
    label: string
}

export default class PkSkillField extends Component<PkSkillFieldProps> {
    render() {
        return <div className={css.pkskillfield}>
            <PkTriSwitch my_key={this.props.prof_key} />
            <PkAttributeViewerField my_key={this.props.mod_key} modifier/>
            <PkTextLabel label={this.props.label} />
            </div>
    }
}