import { Component } from "preact";
import * as css from "../pk.module.css";
import { zip_classes } from "./PkFieldHelpers";

type PkTextLabelProps = {
    label: string,
    className?: string
}

export class PkTextLabel extends Component<PkTextLabelProps> {
    render() {
        return <div className={zip_classes(css.pktextfield_label, this.props.className)}>
            {this.props.label}
        </div>;
    }
}