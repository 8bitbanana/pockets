import { ParsedExpression, EvaluatedExpression } from "./diceroll/mod";

type AttrKey = string;
export type Attribute = ParsedExpression;

export class AttrContainer {

    data: Map<AttrKey, Attribute> = new Map();

    add(name: string, expression: Attribute) {
        this.data.set(name, expression);
    }

    evaluate(attrToEvaluate: AttrKey): EvaluatedExpression | undefined {

        // const attr = this.data.get(attrToEvaluate);
        // if (attr === undefined) { return; }
        
        

        return undefined;
    }
}