import { Component, JSX } from "preact";
import { useContext } from "preact/hooks";
import { CS } from "../app";

import "../pk.module.css"
import * as css from "../pk.module.css";
import { CharsheetApp } from "components/charsheet_app";

type PkTextFieldProps = {
    my_key: string,
    label?: string,
    className?: string
    numberinput?: boolean
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

    get_field_value(sheet: CharsheetApp): string | undefined {
        return sheet.text_fields.get_inner().get(this.props.my_key);
    }

    is_edit_mode_enabled(sheet: CharsheetApp): boolean {
        return sheet.edit_mode.value;
    }

    is_number_input(): boolean {
        return this.props.numberinput === true;
    }

    is_editable(): boolean {
        return true;
    }

    set_field_value(sheet: CharsheetApp, new_value: string) {
        sheet.text_fields.mutate((inner) => {
            inner.modify(this.props.my_key, new_value);
        }, false);
    }

    render_label() {
        if (this.props.label) {
            return <span className={this.get_label_classes()}>{this.props.label}</span>;
        }
        return null;
    }

    render_field() {

        let { sheet } = useContext(CS);

        const field_value = this.get_field_value(sheet);
        if (field_value === undefined) {
            return <div className={this.get_field_classes()}> 
            <button><span>Err!</span></button>
            </div>;
        }

        const edit_mode = this.is_editable()
            && this.is_edit_mode_enabled(sheet);

        return <div className={this.get_field_classes()}>
            <input className={edit_mode ? "" : css.invisible}
                value={field_value}
                type={this.is_number_input() ? "number" : "text"}
                onInput={(event: any) => {
                    this.set_field_value(sheet, event.target.value);
                }}
            />
            <button className={edit_mode ? css.invisible : ""}
                onClick={ () => {
                    console.log(field_value);
                }}>
                <span>{field_value.replaceAll(' ', '\u00a0')}</span>
            </button>
        </div>;
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

