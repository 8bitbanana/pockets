
import * as style from "./AttributeMenu.module.css"

import { AttrContainer, Attribute } from "lib/attribute";
import { Component } from "preact";
import { ParsedExpression } from "lib/diceroll/mod";
import { JSXInternal } from "preact/src/jsx";
import { useContext } from "preact/hooks";

import { CS } from "./app";

type AttributeMenuElementProps = {
    attrkey: string,
    // attribute: ParsedExpression
};

// Component<props, state>
class AttributeMenuElement extends Component<AttributeMenuElementProps, {}> {

    constructor() {
        super();
    }

    render() {

        const charsheet = useContext(CS);

        const expr_string = charsheet.attributes.get_expression_string(this.props.attrkey);
        if (expr_string.isErr) {
            throw "Invalid attrkey";
        }

        return <div>
            <input type="text" value={this.props.attrkey} />
            <input type="text" value={expr_string.value} />
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

        const charsheet = useContext(CS);

        const names = charsheet.attributes.data;

        const elements: JSXInternal.Element[] = [];
        charsheet.attributes.data.forEach((value, key) => {
            elements.push(
                <AttributeMenuElement attrkey={key} />
            )
        });

        return <div>{elements}</div>;
    }

}

export default AttributeMenu;