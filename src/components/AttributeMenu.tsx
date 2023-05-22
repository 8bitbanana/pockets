
import * as style from "./AttributeMenu.module.css"

import { AttrContainer, Attribute } from "../attribute";
import { Component } from "preact";
import { ParsedExpression } from "../diceroll/mod";
import { JSXInternal } from "preact/src/jsx";

type AttributeMenuElementProps = {
    attrkey: string,
    attribute: ParsedExpression
};

// Component<props, state>
class AttributeMenuElement extends Component<AttributeMenuElementProps, {}> {

    constructor() {
        super();
    }

    render() {
        return <div>
            <input type="text" value={this.props.attrkey} />
            <input type="text" value="placeholder" />
            <button>Eval</button>
            <button>Delete</button>
        </div>;
    }
}

type AttributeMenuProps = {
    attribute_container: AttrContainer;
}

class AttributeMenu extends Component<AttributeMenuProps> {

    render() {
        //const names = ["first test", "second test", "third test"];

        const names = this.props.attribute_container.data;

        const elements: JSXInternal.Element[] = [];
        this.props.attribute_container.data.forEach((value, key) => {
            elements.push(
                <AttributeMenuElement attrkey={key} attribute={value} />
            )
        });

        return <div>{elements}</div>;
    }

}

export default AttributeMenu;