import { Checkbox } from "@mui/joy";
import { Component } from "preact";
import { useContext } from "preact/hooks";
import { CS } from "./app";

export default class PkEditModeToggle extends Component {
    render() {
        const { sheet } = useContext(CS);

        return <Checkbox
            label="Edit Mode"
            variant="outlined"
            checked={sheet.edit_mode.value}
            onChange={(event: any) => {
                sheet.edit_mode.value = event.target.checked;
            }}
            />
    }
}