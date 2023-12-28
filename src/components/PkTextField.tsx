import { Button, Input } from "@mui/joy";
import { Component } from "preact";
import { useContext } from "preact/hooks";
import { CS } from "./app";

type PkTextFieldProps = {
    text: string
}

export default class PkTextField extends Component<PkTextFieldProps> {
    render() {

        const { sheet, dispatch } = useContext(CS);

        if (sheet.edit_mode) {
            return <Input size="sm" variant="soft" />;
        } else {
            return <Button size="sm" variant="plain">{this.props.text}</Button>;
        }
    }
}