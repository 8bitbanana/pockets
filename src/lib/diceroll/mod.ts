import { MyResult } from "lib/errors";

import { ParsedExpression } from "./parser/mod";

export class EvaluatedExpression {
    result: number = 0;
    constructor(result: number) {
        this.result = result;
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