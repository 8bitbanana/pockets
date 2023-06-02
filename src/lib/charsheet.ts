
import {AttrContainer} from "./attribute";
import { EvaluatedExpression } from "./diceroll/expression";

export class Charsheet {
    public attributes: AttrContainer;

    public last_ran_expr?: EvaluatedExpression;

    constructor(attributes: AttrContainer) {
        this.attributes = attributes;
    }
}