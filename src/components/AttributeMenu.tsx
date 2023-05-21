
import * as style from "./AttributeMenu.module.css"

import { Attribute } from "../attribute";
import { Component } from "preact";

// Component<props, state>
class AttributeMenuElement extends Component<{attrname: string}, {}> {

    constructor() {
        super();
    }

    render() {
        return <div>
            <input type="text" value={this.props.attrname} />
            <button>Eval</button>
            <button>Delete</button>
        </div>;
    }
}

const AttributeMenu = () => {

    const names = ["first test", "second test", "third test"];

    return names.map((object, i) => {
        return <AttributeMenuElement attrname={object}/>
    });
};

export default AttributeMenu;