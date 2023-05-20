import { ParsedExpression, EvaluatedExpression } from "./diceroll/mod";

import * as Error from './errors';

type AttrKey = string;
export type Attribute = ParsedExpression;

type AttrEvalError =
    Error.UnknownVariable |
    Error.AttributeCycle;

export class AttrContainer {

    data: Map<AttrKey, Attribute> = new Map();

    add(name: string, expression: Attribute) {
        this.data.set(name, expression);
    }

    evaluate(attrToEvaluate: AttrKey): EvaluatedExpression | AttrEvalError {

        const attr = this.data.get(attrToEvaluate);

        if (attr === undefined) { return { name: attrToEvaluate }; }
        throw "unimpl";
    
    }
}