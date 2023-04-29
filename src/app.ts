import * as ohm from 'ohm-js';
import * as ohm_extras from 'ohm-js/extras';
import grammer, { DicerollSemantics } from "./ohm/diceroll.ohm-bundle"

abstract class Expr {

}

abstract class Literal extends Expr {};

class NumberLiteral extends Literal
{
    value: number;
    constructor(value: number) {
        super();
        this.value = value;
    }
}

class VariableLiteral extends Literal
{
    name: string;
    constructor(name: string) {
        super();
        this.name = name;
    }
}

enum InfixOperatorType {
    Add, Subtract, Multiply, Divide, FloorDivide, Roll, PowerOf
}

class InfixExpression extends Expr {
    left: Expr;
    op: InfixOperatorType;
    right: Expr;
    constructor(left: Expr, op: InfixOperatorType, right: Expr) {
        super();

        this.left = left;
        this.op = op;
        this.right = right;
    }
}

enum PrefixOperatorType {
    Roll, Positive, Negative
}

class PrefixExpression extends Expr {
    op: PrefixOperatorType;
    right: Expr;
    constructor(op: PrefixOperatorType, right: Expr) {
        super();
        this.op = op;
        this.right = right;
    }
}

const semantics: DicerollSemantics = grammer.createSemantics();
semantics.addOperation<Expr>('tree', {
    
    ExprSumInfix_Add(arg0, arg1, arg2) {
        return new InfixExpression(arg0.tree(), InfixOperatorType.Add, arg2.tree());
    },
    ExprSumInfix_Subtract(arg0, arg1, arg2) {
        return new InfixExpression(arg0.tree(), InfixOperatorType.Subtract, arg2.tree());
    },
    ExprProductInfix_Multiply(arg0, arg1, arg2) {
        return new InfixExpression(arg0.tree(), InfixOperatorType.Multiply, arg2.tree());
    },
    ExprProductInfix_FloorDivide(arg0, arg1, arg2) {
        return new InfixExpression(arg0.tree(), InfixOperatorType.FloorDivide, arg2.tree());
    },
    ExprProductInfix_Divide(arg0, arg1, arg2) {
        return new InfixExpression(arg0.tree(), InfixOperatorType.Divide, arg2.tree());
    },
    ExprPowerOfInfix_PowerOf(arg0, arg1, arg2) {
        return new InfixExpression(arg0.tree(), InfixOperatorType.PowerOf, arg2.tree());
    },
    ExprRollInfix_Dice(arg0, arg1, arg2) {
        return new InfixExpression(arg0.tree(), InfixOperatorType.Roll, arg2.tree());
    },
    ExprPriority_Paren(arg0, arg1, arg2) {
        return arg1.tree();
    },
    ExprPriority_RollPrefix(arg0, arg1) {
        return new PrefixExpression(PrefixOperatorType.Roll, arg1.tree());
    },
    ExprPriority_PosPrefix(arg0, arg1) {
        return new PrefixExpression(PrefixOperatorType.Positive, arg1.tree());
    },
    ExprPriority_NegPrefix(arg0, arg1) {
        return new PrefixExpression(PrefixOperatorType.Negative, arg1.tree());
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

window.parseFunc = parse;

console.log('Hello world!');