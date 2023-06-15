
import {AttrContainer} from "./attribute";
import { EvaluatedExpression } from "./diceroll/mod";
import { MyResult } from "./errors";

export class Charsheet {
    public attributes: AttrContainer;

    public last_ran_expr?: MyResult<EvaluatedExpression>;

    constructor(attributes: AttrContainer) {
        this.attributes = attributes;
    }
}