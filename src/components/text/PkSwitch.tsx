import { CS } from "components/app";
import { Component } from "preact"
import { useContext } from "preact/hooks";
import * as Helpers from "./PkFieldHelpers"
import * as css from "../pk.module.css"


export type PkSwitchProps = {
    my_key: string,
    className?: string
}

export class PkSwitch extends Component<PkSwitchProps> {
    render() {
        let { sheet } = useContext(CS);

        const field_result = Helpers.get_attr_value(sheet, this.props.my_key);

        const field_value = field_result.unwrapOr("0") == "1";

        return <div className={Helpers.zip_classes(css.pkswitch, this.props.className)}>
            <input type="checkbox"
                checked={field_value}
                readonly={field_result.isErr}
                onInput={(event: any) => {
                    const value = event.target.checked ? "1" : "0";
                    Helpers.set_attr_value(sheet, this.props.my_key, value);
                }}/>
        </div>;
    }
}

export class PkTriSwitch extends Component<PkSwitchProps> {
    render() {
        let { sheet } = useContext(CS);

        const field_result = Helpers.get_attr_value(sheet, this.props.my_key);

        let field_value = (field_result.map((s) => parseInt(s)).unwrapOr(0)) % 3;

        if (field_value < 0) { field_value = 0; }
        if (field_value > 2) { field_value = 2; }

        const state_classes = [css.state0, css.state1, css.state2];

        return <div className={Helpers.zip_classes(css.pkswitch, this.props.className)}>
            <button
                className={Helpers.zip_classes(css.tri_inner, state_classes[field_value])}
                onClick={() => {
                    const next_value = (field_value + 1) % 3;
                    Helpers.set_attr_value(sheet, this.props.my_key, next_value.toString());
                }}/>
        </div>;
    }
}