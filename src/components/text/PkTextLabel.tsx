import { Component } from "preact";
import * as css from "../pk.module.css";

type PkTextLabelProps = {
    label: string
}

export class PkTextLabel extends Component<PkTextLabelProps> {
    render() {
        return <span className={css.pktextfield_label}>{this.props.label}</span>;
    }
}