import grammer, { DicerollSemantics } from "../ohm/diceroll.ohm-bundle";
import * as operation from './operation';
import * as expression from './expression';

const diceroll_semantics: DicerollSemantics = grammer.createSemantics();
diceroll_semantics.addOperation<expression.Expr>('tree', {
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

export { ExprEvaluation } from './expression'

export class ParsedExpression {

    private parsed_expression: expression.Expr;

    private constructor(expr: expression.Expr) {
        this.parsed_expression = expr;
    }

    public static Parse(expr: string): ParsedExpression | undefined {
        const matchResult = grammer.match(expr);

        if (matchResult.failed()) {
            // If we want better error reporting, can just swap undefined for an error type
            return undefined;
        }

        const expr_tree: expression.Expr = diceroll_semantics(matchResult).tree();
        return new ParsedExpression(expr_tree);
    }

    public Evaluate(): expression.ExprEvaluation | undefined {
        return this.parsed_expression.evaluate();
    }
}