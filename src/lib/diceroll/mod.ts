import { MyResult } from "lib/errors";

import { ParsedExpression } from "./parser/mod";

abstract class EvaluatedLiteral {

    abstract ToString(): string;

}

export class EvaluatedAttribute extends EvaluatedLiteral {
    name: string;
    annex: EvaluatedExpressionToken[];
    total: number;

    constructor(total: number, name: string, annex: EvaluatedExpressionToken[]) {
        super();
        this.name = name;
        this.annex = annex;
        this.total = total;
    }

    ToString(): string {
        return `${this.total} [${this.name}]`;
    }
}

export class EvaluatedFixed extends EvaluatedLiteral {
    value: number;

    constructor(value: number) {
        super();
        this.value = value;
    }

    ToString(): string {
        return this.value.toString();
    }
}

type DicerollSpec = {
    result: number,
    size: number
}

export class EvaluatedDiceroll extends EvaluatedLiteral {
    spec: DicerollSpec;

    constructor(spec: DicerollSpec) {
        super();
        this.spec = spec;
    }

    ToString(): string {
        return `[${this.spec.result.toString()}]`;
    }
}

export type EvaluatedExpressionToken = string | EvaluatedLiteral;

export class EvaluatedExpression {

    total: number = 0;
    annex: EvaluatedExpressionToken[];

    private constructor(total: number, annex: EvaluatedExpressionToken[]) {
        this.total = total;
        this.annex = annex;
    }

    static FixedLiteral(value: number) {
        return new EvaluatedExpression(value, [new EvaluatedFixed(value)]);
    }

    static RollLiteral(value: number, dice_size: number, results: number[]) {

        return new EvaluatedExpression(value, results.map((result) => {
            return new EvaluatedDiceroll({result, size: dice_size});
        }))
    }

    static AttributeLiteral(value: number, attribute_name: string, attribute_inner: EvaluatedExpressionToken[]) {
        return new EvaluatedExpression(value, [new EvaluatedAttribute(value, attribute_name, attribute_inner)]);
    }

    static Infix(new_total: number, lhs: EvaluatedExpression, sep: string, rhs: EvaluatedExpression) {
        let new_annex = lhs.annex;
        new_annex.push(sep);
        new_annex = new_annex.concat(rhs.annex);
        return new EvaluatedExpression(new_total, new_annex);
    }

    static Prefix(new_total: number, sep: string, rhs: EvaluatedExpression) {
        let new_annex: EvaluatedExpressionToken[] = [sep];
        new_annex = new_annex.concat(rhs.annex);
        return new EvaluatedExpression(new_total, new_annex);
    }

    private static print_annex_inner(annex: EvaluatedExpressionToken[]): string {
        let outstr = "";
        for (const token of annex) {
            if (typeof token === "string") {
                outstr += token;
            }
            else if (token instanceof EvaluatedAttribute) {
                outstr += this.print_annex_inner(token.annex);
            }
            else {
                outstr += token.ToString();
            }
        }

        return outstr;
    }

    print_annex(): string {
        return EvaluatedExpression.print_annex_inner(this.annex);
    }
}

export type EvaluationContext = {
    resolved_variables: Map<string, EvaluatedExpression>;
};

export { Parse, UnparsedExpression, ParsedExpression } from "./parser/mod";

export function Evaluate(expr: ParsedExpression, resolved_variables: Map<string, EvaluatedExpression>): MyResult<EvaluatedExpression> {
    const context: EvaluationContext = { resolved_variables: resolved_variables };

    return expr.parsed_expression.evaluate(context);
}