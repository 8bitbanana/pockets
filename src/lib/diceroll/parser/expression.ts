import { InfixOperation, PrefixOperation, RollOperation } from './operation';

import { ok, err } from 'true-myth/dist/es/result';

import { MyResult } from "lib/errors";
import * as Error from "lib/errors";
import { EvaluatedExpression, EvaluationContext } from '../mod'; 

export type ParseContext = {
    unresolved_variables: Set<string>;
}

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
        return ok(EvaluatedExpression.FixedLiteral(this.value));
    }
}
export class AttributeLiteral extends Literal {
    name: string;
    constructor(name: string) {
        super();
        this.name = name;
    }

    evaluate(context: EvaluationContext): MyResult<EvaluatedExpression> {

        const attr = context.resolved_variables.get(this.name);

        if (attr !== undefined) {
            return ok(EvaluatedExpression.AttributeLiteral(attr.total, this.name, attr.annex));
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

        const result = this.op.RunInfix(leftEval.value.total, rightEval.value.total);
        return result.map((total) => {
            return EvaluatedExpression.Infix(total, leftEval.value, this.op.GetInfixStr(), rightEval.value);
        });
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

        const result = this.op.RunPrefix(rightEval.value.total);
        return result.map((total) => {
            return EvaluatedExpression.Prefix(total, this.op.GetPrefixStr(), rightEval.value);
        });
    }
}
// Rolls are not like regular prefixes/infixes:
// they are displayed as just a literal rather than a combo of lhs and rhs
export class RollExpression extends Expr {
    left: Expr;
    right: Expr;

    constructor(left: Expr | null, right: Expr) {
        super();
        
        if (left !== null) {
            this.left = left;
        } else {
            this.left = new NumberLiteral(1);
        }

        this.right = right;
    }
    
    evaluate(context: EvaluationContext): MyResult<EvaluatedExpression> {
        const leftEval = this.left.evaluate(context);
        if (leftEval.isErr) { return leftEval; }
        const rightEval = this.right.evaluate(context);
        if (rightEval.isErr) { return rightEval; }

        const result = RollOperation(leftEval.value.total, rightEval.value.total);
        return result.map((diceroll) => {
            return EvaluatedExpression.RollLiteral(diceroll.total, leftEval.value.total, diceroll.results);
        });
    }
}