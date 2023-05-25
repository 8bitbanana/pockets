
import * as style from "./AttributeMenu.module.css"

import { AttrContainer, Attribute } from "lib/attribute";
import { Component } from "preact";
import { ParsedExpression, UnparsedExpression } from "lib/diceroll/mod";
import { JSXInternal } from "preact/src/jsx";
import { useContext } from "preact/hooks";

import { createAttrContainer } from "./app";

type AttributeMenuElementProps = {
    attrkey: string,
    attribute: UnparsedExpression
};

// Component<props, state>
class AttributeMenuElement extends Component<AttributeMenuElementProps, {}> {

    constructor() {
        super();
    }

    render() {

        return <div>
            <input type="text" value={this.props.attrkey} />
            <input type="text" value={this.props.attribute} />
            <button>Eval</button>
            <button>Delete</button>
        </div>;
    }
}

type AttributeMenuProps = {
    // attribute_container: AttrContainer;
}

type AttributeMenuState = {
    attributes: AttrContainer;
}

class AttributeMenu extends Component<AttributeMenuProps, AttributeMenuState> {

    constructor() {
        super();

        this.setState({
            attributes: createAttrContainer()
        });
    }

    render() {
        //const names = ["first test", "second test", "third test"];

        const names = this.state.attributes.data;

        const elements: JSXInternal.Element[] = [];
        this.state.attributes.data.forEach((value, key) => {
            elements.push(
                <AttributeMenuElement attrkey={key} attribute={value} />
            )
        });

        return (
            <div>
                {elements}
                <button onClick={() => {
                    this.setState((oldstate) => {
                        let newstate = {...oldstate};
                        newstate.attributes.add("new", "0");
                        return newstate;
                    });
                    //console.log(cs.getter.attributes);
                }} >Add</button>
            </div>
        );
    }

}

export default AttributeMenu;