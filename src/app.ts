import * as ohm from 'ohm-js';
import * as ohm_extras from 'ohm-js/extras';
import grammer, { DicerollSemantics } from "./ohm/diceroll.ohm-bundle"
import * as operation from './diceroll/operation';
import * as expression from './diceroll/expression';

const semantics: DicerollSemantics = grammer.createSemantics();
semantics.addOperation<expression.Expr>('tree', {
    
    ExprSumInfix_Add(arg0, arg1, arg2) {
        return new expression.InfixExpression(arg0.tree(), new operation.AddOperation, arg2.tree());
    },
    ExprSumInfix_Subtract(arg0, arg1, arg2) {
        return new expression.InfixExpression(arg0.tree(), new operation.SubtractOperation, arg2.tree());
    },
    ExprProductInfix_Multiply(arg0, arg1, arg2) {
        return new expression.InfixExpression(arg0.tree(), new operation.MultiplyOperation, arg2.tree());
    },
    ExprProductInfix_FloorDivide(arg0, arg1, arg2) {
        return new expression.InfixExpression(arg0.tree(), new operation.FloorDivideOperation, arg2.tree());
    },
    ExprProductInfix_Divide(arg0, arg1, arg2) {
        return new expression.InfixExpression(arg0.tree(), new operation.DivideOperation, arg2.tree());
    },
    ExprPowerOfInfix_PowerOf(arg0, arg1, arg2) {
        return new expression.InfixExpression(arg0.tree(), new operation.PowerOfOperation, arg2.tree());
    },
    ExprRollInfix_Dice(arg0, arg1, arg2) {
        return new expression.InfixExpression(arg0.tree(), new operation.RollOperation, arg2.tree());
    },
    ExprPriority_Paren(arg0, arg1, arg2) {
        return arg1.tree();
    },
    ExprPriority_RollPrefix(arg0, arg1) {
        return new expression.PrefixExpression(new operation.RollOperation, arg1.tree());
    },
    ExprPriority_PosPrefix(arg0, arg1) {
        return new expression.PrefixExpression(new operation.AddOperation, arg1.tree());
    },
    ExprPriority_NegPrefix(arg0, arg1) {
        return new expression.PrefixExpression(new operation.SubtractOperation, arg1.tree());
    },
    Literal_number(arg0) {
        return new expression.NumberLiteral(parseFloat(this.sourceString));
    },
    Literal_Variable(arg0, arg1, arg2) {
        return new expression.VariableLiteral(arg1.sourceString);
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