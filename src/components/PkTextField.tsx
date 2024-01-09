import { Button, Input } from "@mui/joy";
import { Component } from "preact";
import { useContext } from "preact/hooks";
import { CS } from "./app";
import SignalWrapper from "./utils/SignalWrapper";
import { TextFieldContainer } from "lib/TextFieldContainer";

import "./pk.module.css"
import * as css from "./pk.module.css";

type PkTextFieldProps = {
    my_key: string
}

export default class PkTextField extends Component<PkTextFieldProps> {
    render() {

        let { sheet } = useContext(CS);

        const field_value = sheet.text_fields.get_inner().get(this.props.my_key);
        if (field_value === undefined) {
            // todo: How should this best be handled?
            //  - An error placeholder, basically a fancier version of this <p> here
            //  - Removing the field from the layout? A fallable constructor?
            return <p>Err!</p>;
        }

        if (sheet.edit_mode.value) {

            return <div><span className={css.pktextfield}>
                <input value={field_value} type="text" onChange={(event: any) => {
                    sheet.text_fields.mutate((inner) => {
                        inner.modify(this.props.my_key, event.currentTarget.value);
                    }, false);

                    this.forceUpdate();
                }}/>
                <span key="pklabel" className={css.invisible}>{field_value.replaceAll(' ', '\u00a0')}</span>
            </span></div>;
        } else {
            return <div><span className={css.pktextfield}>
                <button onClick={() => alert(field_value)}>
                    <span>{field_value.replaceAll(' ', '\u00a0')}</span>
                </button>
            </span></div>;
        }
    }
}