
import { TextFieldContainer } from "./TextFieldContainer";
import {AttrContainer} from "./attribute";
import { EvaluatedExpression } from "./diceroll/mod";
import { MyResult } from "./errors";

export class Charsheet {
    public attributes: AttrContainer;
    public text_fields: TextFieldContainer;

    public last_ran_expr?: MyResult<EvaluatedExpression>;

    public edit_mode: boolean;

    constructor(attributes: AttrContainer, text_fields: TextFieldContainer) {
        this.attributes = attributes;
        this.text_fields = text_fields;
        this.edit_mode = false;
    }
}