
import { TextFieldContainer } from "./TextFieldContainer";
import {AttrContainer, UnparsedAttrContainer} from "./attribute";
import { EvaluatedExpression } from "./diceroll/mod";
import { MyResult } from "./errors";

export class Charsheet {
    public attributes: AttrContainer;
    public text_fields: TextFieldContainer;

    constructor(attributes: AttrContainer, text_fields: TextFieldContainer) {
        this.attributes = attributes;
        this.text_fields = text_fields;
    }
}