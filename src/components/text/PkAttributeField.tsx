import { CharsheetApp } from "components/charsheet_app";
import { Component } from "preact";
import { CS } from "components/app";
import { useContext } from "preact/hooks";
import * as Helpers from "./PkFieldHelpers"
import * as css from "../pk.module.css"
import { MyResult } from "lib/errors";
import { err, ok } from "true-myth/dist/es/result";

type PkAttributeEditorFieldProps = {
    my_key: string,
    className?: string
    number?: boolean
}

export class PkAttributeEditorField extends Component<PkAttributeEditorFieldProps> {

    render() {
        let { sheet } = useContext(CS);

        const field_result = Helpers.get_attr_value(sheet, this.props.my_key);
        const field_value = field_result.unwrapOr("Err!");

        const edit_mode = field_result.isOk
            && Helpers.is_edit_mode_enabled(sheet);

            return <div className={Helpers.zip_classes(css.pktextfield_container, this.props.className)}>
            <input className={edit_mode ? "" : css.invisible}
                value={field_value}
                type={this.props.number ? "number" : "text"} 
                onInput={(event: any) => {
                    Helpers.set_attr_value(sheet, this.props.my_key, event.target.value);
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
}

type PkAttributeViewerFieldProps = {
    my_key: string,
    className?: string,
    modifier?: boolean
} 

export class PkAttributeViewerField extends Component<PkAttributeViewerFieldProps> {

    render() {
        let { sheet } = useContext(CS);

        const field_result = Helpers.get_attr_value(sheet, this.props.my_key)
            .andThen((key): MyResult<string> => {
                const result = sheet.attributes.get_inner()
                    .get_parsed().evaluate(this.props.my_key);

                if (result.isErr) {
                    return err(result.error);
                }

                const total = result.value.total;
                if (total >= 0 && this.props.modifier) {
                    return ok('+' + total.toString());
                } else {
                    return ok(total.toString());
                }
            });

        const field_value = field_result.unwrapOr("Err!");

        return <div className={this.props.className}>
            <div className={css.pktextfield_container}>
            <button
                onClick={ () => {
                    console.log(field_value);
                }}>
                <span>{field_value.replaceAll(' ', '\u00a0')}</span>
            </button>
        </div></div>;
    }
}
