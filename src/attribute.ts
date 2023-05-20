import { ParsedExpression, EvaluatedExpression } from "./diceroll/mod";

import { MyResult } from "./errors";
import * as Error from './errors';

type AttrKey = string;
export type Attribute = ParsedExpression;

export class AttrContainer {

    data: Map<AttrKey, Attribute> = new Map();

    add(name: string, expression: Attribute) {
        this.data.set(name, expression);
    }

    evaluate(attrToEvaluate: AttrKey): MyResult<EvaluatedExpression> {

        const attr = this.data.get(attrToEvaluate);

        //if (attr === undefined) { return { name: attrToEvaluate }; }
        throw "unimpl";
    
    }
}