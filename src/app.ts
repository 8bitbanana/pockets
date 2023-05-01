import * as ohm from 'ohm-js';
import * as ohm_extras from 'ohm-js/extras';
import grammer, { DicerollSemantics } from "./ohm/diceroll.ohm-bundle"

interface InfixOperation {
    RunInfix(left: number, right: number): number;
}

interface PrefixOperation {
    RunPrefix(right: number): number;
}

class AddOperation implements PrefixOperation, InfixOperation {
    RunInfix(left: number, right: number): number {
        return left + right;
    }

    RunPrefix (right: number): number {
        return this.RunInfix(0, right);
    }
}

class SubtractOperation implements PrefixOperation, InfixOperation {
    RunInfix(left: number, right: number): number {
        return left - right;
    }
    RunPrefix(right: number): number {
        return this.RunInfix(0, right);
    }
}

class RollOperation implements PrefixOperation, InfixOperation {
    RunInfix(left: number, right: number): number {

        if (left == 0 || right == 0) {
            return 0;
        }

        var total = 0;
        for (var i = 0; i < left; i++) {
            total += Math.floor(Math.random() * right) + 1;
        }

        return total;
    }
    RunPrefix(right: number): number {
        return this.RunInfix(1, right);
    }
}

class FloorDivideOperation implements InfixOperation {
    RunInfix(left: number, right: number): number {
        return Math.floor(left / right);
    }
}

class DivideOperation implements InfixOperation {
    RunInfix(left: number, right: number): number {
        return left / right;
    }
}

class MultiplyOperation implements InfixOperation {
    RunInfix(left: number, right: number): number {
        return left * right;
    }
}

class PowerOfOperation implements InfixOperation {
    RunInfix(left: number, right: number): number {
        return left ** right;
    }
}

class ExprEvaluation {
    result: number = 0;
    constructor(result: number) {
        this.result = result;
    }
}

abstract class Expr {
    abstract evaluate(): ExprEvaluation;
}

abstract class Literal extends Expr {

};

class NumberLiteral extends Literal
{
    value: number;
    constructor(value: number) {
        super();
        this.value = value;
    }

    evaluate(): ExprEvaluation {
        return new ExprEvaluation(this.value);
    }
}

class VariableLiteral extends Literal
{
    name: string;
    constructor(name: string) {
        super();
        this.name = name;
    }

    evaluate(): ExprEvaluation {
        return new ExprEvaluation(0);
    }
}

class InfixExpression extends Expr {
    left: Expr;
    op: InfixOperation;
    right: Expr;
    constructor(left: Expr, op: InfixOperation, right: Expr) {
        super();

        this.left = left;
        this.op = op;
        this.right = right;
    }

    evaluate(): ExprEvaluation {
        const leftEval = this.left.evaluate();
        const rightEval = this.right.evaluate();
        const result = this.op.RunInfix(leftEval.result, rightEval.result);
        return new ExprEvaluation(result);
    }
}

class PrefixExpression extends Expr {
    op: PrefixOperation;
    right: Expr;
    constructor(op: PrefixOperation, right: Expr) {
        super();
        this.op = op;
        this.right = right;
    }

    evaluate(): ExprEvaluation {
        const rightEval = this.right.evaluate();
        const result = this.op.RunPrefix(rightEval.result);
        return new ExprEvaluation(result);
    }
}

const semantics: DicerollSemantics = grammer.createSemantics();
semantics.addOperation<Expr>('tree', {
    
    ExprSumInfix_Add(arg0, arg1, arg2) {
        return new InfixExpression(arg0.tree(), new AddOperation, arg2.tree());
    },
    ExprSumInfix_Subtract(arg0, arg1, arg2) {
        return new InfixExpression(arg0.tree(), new SubtractOperation, arg2.tree());
    },
    ExprProductInfix_Multiply(arg0, arg1, arg2) {
        return new InfixExpression(arg0.tree(), new MultiplyOperation, arg2.tree());
    },
    ExprProductInfix_FloorDivide(arg0, arg1, arg2) {
        return new InfixExpression(arg0.tree(), new FloorDivideOperation, arg2.tree());
    },
    ExprProductInfix_Divide(arg0, arg1, arg2) {
        return new InfixExpression(arg0.tree(), new DivideOperation, arg2.tree());
    },
    ExprPowerOfInfix_PowerOf(arg0, arg1, arg2) {
        return new InfixExpression(arg0.tree(), new PowerOfOperation, arg2.tree());
    },
    ExprRollInfix_Dice(arg0, arg1, arg2) {
        return new InfixExpression(arg0.tree(), new RollOperation, arg2.tree());
    },
    ExprPriority_Paren(arg0, arg1, arg2) {
        return arg1.tree();
    },
    ExprPriority_RollPrefix(arg0, arg1) {
        return new PrefixExpression(new RollOperation, arg1.tree());
    },
    ExprPriority_PosPrefix(arg0, arg1) {
        return new PrefixExpression(new AddOperation, arg1.tree());
    },
    ExprPriority_NegPrefix(arg0, arg1) {
        return new PrefixExpression(new SubtractOperation, arg1.tree());
    },
    Literal_number(arg0) {
        return new NumberLiteral(parseFloat(this.sourceString));
    },
    Literal_Variable(arg0, arg1, arg2) {
        return new VariableLiteral(arg1.sourceString);
    }
});

export function parse(expr: string) {
    const matchResult = grammer.match(expr);
    return semantics(matchResult);
}

var obj:any = {};
obj = window;

obj.parseFunc = parse;

console.log('Hello world!');