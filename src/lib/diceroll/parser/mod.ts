
import * as operation from './operation';
import * as expression from './expression';
import grammer, { DicerollSemantics } from "ohm/diceroll.ohm-bundle";

import { MyResult } from "lib/errors";
import * as Error from "lib/errors";
import { ok, err } from "true-myth/dist/public/result";

export type UnparsedExpression = string;

export class ParsedExpression {

    unparsed_expression: UnparsedExpression;
    parsed_expression: expression.Expr;
    unresolved_variables: string[];

    constructor(expr_str: UnparsedExpression, expr: expression.Expr, unresolved_variables: string[]) {
        this.unparsed_expression = expr_str;
        this.parsed_expression = expr;
        this.unresolved_variables = unresolved_variables;
    }
}

const diceroll_semantics: DicerollSemantics = grammer.createSemantics();
diceroll_semantics.addOperation<expression.Expr>('tree(context)', {
    ExprSumInfix_Add(arg0, arg1, arg2) {
        return new expression.InfixExpression(arg0.tree(this.args.context), new operation.AddOperation, arg2.tree(this.args.context));
    },
    ExprSumInfix_Subtract(arg0, arg1, arg2) {
        return new expression.InfixExpression(arg0.tree(this.args.context), new operation.SubtractOperation, arg2.tree(this.args.context));
    },
    ExprProductInfix_Multiply(arg0, arg1, arg2) {
        return new expression.InfixExpression(arg0.tree(this.args.context), new operation.MultiplyOperation, arg2.tree(this.args.context));
    },
    ExprProductInfix_FloorDivide(arg0, arg1, arg2) {
        return new expression.InfixExpression(arg0.tree(this.args.context), new operation.FloorDivideOperation, arg2.tree(this.args.context));
    },
    ExprProductInfix_Divide(arg0, arg1, arg2) {
        return new expression.InfixExpression(arg0.tree(this.args.context), new operation.DivideOperation, arg2.tree(this.args.context));
    },
    ExprPowerOfInfix_PowerOf(arg0, arg1, arg2) {
        return new expression.InfixExpression(arg0.tree(this.args.context), new operation.PowerOfOperation, arg2.tree(this.args.context));
    },
    ExprRollInfix_Dice(arg0, arg1, arg2) {
        return new expression.RollExpression(arg0.tree(this.args.context), arg2.tree(this.args.context));
    },
    ExprPriority_Paren(arg0, arg1, arg2) {
        return arg1.tree(this.args.context);
    },
    ExprPriority_RollPrefix(arg0, arg1) {
        return new expression.RollExpression(null, arg1.tree(this.args.context));
    },
    ExprPriority_PosPrefix(arg0, arg1) {
        return new expression.PrefixExpression(new operation.AddOperation, arg1.tree(this.args.context));
    },
    ExprPriority_NegPrefix(arg0, arg1) {
        return new expression.PrefixExpression(new operation.SubtractOperation, arg1.tree(this.args.context));
    },
    Literal_number(arg0) {
        return new expression.NumberLiteral(parseFloat(this.sourceString));
    },
    Literal_Variable(arg0, arg1, arg2) {

        this.args.context.unresolved_variables.add(arg1.sourceString);
        return new expression.VariableLiteral(arg1.sourceString);
    }
});

export function Parse(expr: UnparsedExpression): MyResult<ParsedExpression> {
    const matchResult = grammer.match(expr);

    if (matchResult.failed()) {
        return err(new Error.ParsingError);
    }

    let parse_context: expression.ParseContext = { unresolved_variables: new Set };

    const expr_tree: expression.Expr = diceroll_semantics(matchResult).tree(parse_context);

    return ok(new ParsedExpression(expr, expr_tree, Array.from(parse_context.unresolved_variables)));
}