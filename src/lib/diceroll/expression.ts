import { InfixOperation, PrefixOperation } from './operation';

import { ok, err } from 'true-myth/dist/public/result';

import { MyResult } from "lib/errors";
import * as Error from "lib/errors";

export type ParseContext = {
    unresolved_variables: Set<string>;
}

export class EvaluatedExpression {
    result: number = 0;
    constructor(result: number) {
        this.result = result;
    }
}

export type EvaluationContext = {
    resolved_variables: Map<string, EvaluatedExpression>;
};

export abstract class Expr {

    abstract evaluate(context: EvaluationContext): MyResult<EvaluatedExpression>;
}

abstract class Literal extends Expr {
}
;
export class NumberLiteral extends Literal {
    value: number;
    constructor(value: number) {
        super();
        this.value = value;
    }

    evaluate(context: EvaluationContext): MyResult<EvaluatedExpression> {
        return ok(new EvaluatedExpression(this.value));
    }
}
export class VariableLiteral extends Literal {
    name: string;
    constructor(name: string) {
        super();
        this.name = name;
    }

    evaluate(context: EvaluationContext): MyResult<EvaluatedExpression> {

        const attr = context.resolved_variables.get(this.name);

        if (attr !== undefined) {
            return ok(new EvaluatedExpression(attr.result));
        } else {
            return err(new Error.UnknownVariable(this.name));
        }
    }
}
export class InfixExpression extends Expr {
    left: Expr;
    op: InfixOperation;
    right: Expr;
    constructor(left: Expr, op: InfixOperation, right: Expr) {
        super();

        this.left = left;
        this.op = op;
        this.right = right;
    }

    evaluate(context: EvaluationContext): MyResult<EvaluatedExpression> {
        const leftEval = this.left.evaluate(context);
        if (leftEval.isErr) { return leftEval; }
        const rightEval = this.right.evaluate(context);
        if (rightEval.isErr) { return rightEval; }

        const result = this.op.RunInfix(leftEval.value.result, rightEval.value.result);

        return result.map((t) => new EvaluatedExpression(t));
    }
}
export class PrefixExpression extends Expr {
    op: PrefixOperation;
    right: Expr;
    constructor(op: PrefixOperation, right: Expr) {
        super();
        this.op = op;
        this.right = right;
    }

    evaluate(context: EvaluationContext): MyResult<EvaluatedExpression> {
        const rightEval = this.right.evaluate(context);
        if (rightEval.isErr) { return rightEval; }

        const result = this.op.RunPrefix(rightEval.value.result);
        return result.map((t) => new EvaluatedExpression(t));
    }
}