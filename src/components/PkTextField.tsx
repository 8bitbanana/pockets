import { Button, Input } from "@mui/joy";
import { Component } from "preact";
import { useContext } from "preact/hooks";
import { CS } from "./app";
import { CA_ModifyTextField } from "lib/charsheet_actions";

type PkTextFieldProps = {
    textfieldkey: string
}

export default class PkTextField extends Component<PkTextFieldProps> {
    render() {

        const { sheet, dispatch } = useContext(CS);

        const field_value = sheet.text_fields.get_text_field_string(this.props.textfieldkey);
        if (field_value.isErr) {
            // todo: How should this best be handled?
            //  - An error placeholder, basically a fancier version of this <p> here
            //  - Removing the field from the layout? A fallable constructor?
            return <p>Err!</p>;
        }

        if (sheet.edit_mode) {
            return <Input size="sm" variant="soft" value={field_value.value}
                onChange={(event: any) => {
                    dispatch(new CA_ModifyTextField(this.props.textfieldkey, event.currentTarget.value))
                }}/>;
        } else {
            return <Button size="sm" variant="plain">{field_value.value}</Button>;
        }
    }
}