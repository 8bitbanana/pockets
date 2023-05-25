
import * as style from "./AttributeMenu.module.css"

import { AttrContainer, Attribute } from "lib/attribute";
import { Component } from "preact";
import { ParsedExpression } from "lib/diceroll/mod";
import { JSXInternal } from "preact/src/jsx";
import { useContext } from "preact/hooks";

import { CS } from "./app";
import { CA_AddBlankAttribute } from "lib/charsheet_actions";

type AttributeMenuElementProps = {
    name: string,
    expr: string
};

class AttributeMenuElement extends Component<AttributeMenuElementProps, {}> {

    constructor() {
        super();
    }

    render() {

        // const { sheet, dispatch } = useContext(CS);

        // const expr_string = sheet.attributes.get_expression_string(this.props.attrkey);
        // if (expr_string.isErr) {
        //     throw "Invalid attrkey";
        // }

        return <div>
            <input type="text" value={this.props.name} />
            <input type="text" value={this.props.expr} />
            <button>Eval</button>
            <button>Delete</button>
        </div>;
    }
}

type AttributeMenuProps = {
    // attribute_container: AttrContainer;
}

class AttributeMenu extends Component<AttributeMenuProps> {

    render() {
        //const names = ["first test", "second test", "third test"];

        const { sheet, dispatch } = useContext(CS);

        const names = sheet.attributes.data;

        const elements: JSXInternal.Element[] = [];
        sheet.attributes.data.forEach((value, key) => {
            elements.push(
                <AttributeMenuElement name={key} expr={value} />
            )
        });

        return (
            <div>
                {elements}
                <button onClick={() => {
                    dispatch(new CA_AddBlankAttribute);
                }} >Add</button>
            </div>
        );
    }

}

export default AttributeMenu;