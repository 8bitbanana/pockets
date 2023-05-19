import { InfixOperation, PrefixOperation } from './operation';

export class EvaluatedExpression {
    result: number = 0;
    constructor(result: number) {
        this.result = result;
    }
}
export abstract class Expr {
    abstract evaluate(): EvaluatedExpression;
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

    evaluate(): EvaluatedExpression {
        return new EvaluatedExpression(this.value);
    }
}
export class VariableLiteral extends Literal {
    name: string;
    constructor(name: string) {
        super();
        this.name = name;
    }

    evaluate(): EvaluatedExpression {
        return new EvaluatedExpression(0);
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

    evaluate(): EvaluatedExpression {
        const leftEval = this.left.evaluate();
        const rightEval = this.right.evaluate();
        const result = this.op.RunInfix(leftEval.result, rightEval.result);
        return new EvaluatedExpression(result);
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

    evaluate(): EvaluatedExpression {
        const rightEval = this.right.evaluate();
        const result = this.op.RunPrefix(rightEval.result);
        return new EvaluatedExpression(result);
    }
}
