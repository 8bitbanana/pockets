import { Checkbox } from "@mui/joy";
import { Component } from "preact";
import { useContext } from "preact/hooks";
import { CS } from "./app";
import * as Actions from "lib/charsheet_actions";

export default class PkEditModeToggle extends Component {
    render() {
        const { sheet, dispatch } = useContext(CS);

        return <Checkbox
            label="Edit Mode"
            variant="outlined"
            checked={sheet.edit_mode}
            onChange={(event: any) => {
                dispatch(new Actions.CA_SetEditMode(event.target.checked))
            }}
            />
    }
}