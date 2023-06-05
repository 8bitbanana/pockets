import { MyResult } from "lib/errors";

import { ParsedExpression } from "./parser/mod";

class EvaluatedLiteral {
    value: number;
    private constructor(value: number) {
        this.value = value;
    }
    static FixedNumber(value: number) {
        return new EvaluatedLiteral(value);
    }
    // Todo: flesh out with crits, ignores, etc.
    static Diceroll(value: number) {
        return new EvaluatedLiteral(value);
    }
    // Todo: should also store variable name
    static Variable(value: number) {
        return new EvaluatedLiteral(value);
    }

    ToString(): string {
        return String(this.value);
    }
}

type EvaluatedExpressionToken = string | EvaluatedLiteral;

export class EvaluatedExpression {

    total: number = 0;
    annex: EvaluatedExpressionToken[];

    private constructor(total: number, annex: EvaluatedExpressionToken[]) {
        this.total = total;
        this.annex = annex;
    }

    static FixedLiteral(value: number) {
        return new EvaluatedExpression(value, [EvaluatedLiteral.FixedNumber(value)]);
    }
    static RollLiteral(value: number) {
        return new EvaluatedExpression(value, [EvaluatedLiteral.Diceroll(value)]);
    }
    static VariableLiteral(value: number) {
        return new EvaluatedExpression(value, [EvaluatedLiteral.Variable(value)]);
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
}

export type EvaluationContext = {
    resolved_variables: Map<string, EvaluatedExpression>;
};

export { Parse, UnparsedExpression, ParsedExpression } from "./parser/mod";

export function Evaluate(expr: ParsedExpression, resolved_variables: Map<string, EvaluatedExpression>): MyResult<EvaluatedExpression> {
    const context: EvaluationContext = { resolved_variables: resolved_variables };

    return expr.parsed_expression.evaluate(context);
}