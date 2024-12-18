import { Component, JSX } from "preact";
import { useContext } from "preact/hooks";
import { CS } from "../app";

import "../pk.module.css"
import * as css from "../pk.module.css";

type PkTextFieldProps = {
    my_key: string,
    label?: string,
    className?: string
}

export default class PkTextField extends Component<PkTextFieldProps> {

    get_container_classes(): string {
        let className = css.pktextfield;
        if (this.props.className !== undefined) { className += " " + this.props.className };
        return className;
    }

    get_label_classes(): string {
        return css.pktextfield_label;
    }

    get_field_classes(): string {
        return css.pktextfield_container;
    }

    render_label() {
        if (this.props.label) {
            return <span className={this.get_label_classes()}>{this.props.label}</span>;
        }
        return null;
    }

    render_field() {
        let { sheet } = useContext(CS);

        const field_value = sheet.text_fields.get_inner().get(this.props.my_key);
        if (field_value === undefined) {
            return <p>Err!</p>;
        }

        let button = 
            <button className={sheet.edit_mode.value ? css.invisible : ""}>
                <span>{field_value.replaceAll(' ', '\u00a0')}</span>
            </button>;

        if (sheet.edit_mode.value) {
            return <div className={this.get_field_classes()}>
                <input value={field_value} type="text" onChange={(event: any) => {
                    sheet.text_fields.mutate((inner) => {
                        inner.modify(this.props.my_key, event.target.value);
                    }, false);

                    this.forceUpdate();
                }}/>
                {button}
            </div>;
        } else {
            return <div className={this.get_field_classes()}>
                {button}
            </div>;
        }
    }

    render() {
        return <div className={this.get_container_classes()}>
            {this.render_label()}{this.render_field()}
            </div>
    }
}

export class PkHeadingTextField extends PkTextField {

    render(): JSX.Element {
        return <div className={this.get_container_classes()}>
            {this.render_field()}  
            {this.render_label()}
        </div>;
    }
}