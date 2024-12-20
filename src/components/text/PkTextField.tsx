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

        let button = 
            <button className={edit_mode ? css.invisible : ""}>
                <span>{field_value.replaceAll(' ', '\u00a0')}</span>
            </button>;

        if (edit_mode) {
            return <div className={this.get_field_classes()}>
                <input value={field_value} type="text" onInput={(event: any) => {
                    this.set_field_value(sheet, event.target.value);
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

export class PkAttributeEditorField extends PkTextField {

    get_field_value(sheet: CharsheetApp): string | undefined {
        return sheet.attributes.get_inner()
            .get_unparsed(false).get_attribute(this.props.my_key)
            .unwrapOr(undefined);
    }

    set_field_value(sheet: CharsheetApp, new_value: string): void {
        sheet.attributes.mutate((inner) => {
            inner.get_unparsed(true).modify_attribute(this.props.my_key, new_value);
        });
    }
}

export class PkAttributeViewerField extends PkTextField {

    get_field_value(sheet: CharsheetApp): string | undefined {
        return sheet.attributes.get_inner()
            .get_parsed().evaluate(this.props.my_key)
            .unwrapOr(undefined)?.total.toString();
    }

    is_editable(): boolean {
        return false;
    }

    set_field_value(sheet: CharsheetApp, new_value: string): void {
        
    }
}