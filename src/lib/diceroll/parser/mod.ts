
import * as operation from './operation';
import * as expression from './expression';
import * as rollmod from './rollmods';
import grammer, { DicerollSemantics } from "ohm/diceroll.ohm-bundle";

import { MyResult } from "lib/errors";
import * as Error from "lib/errors";
import { ok, err } from "true-myth/dist/es/result";

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

diceroll_semantics.addOperation<rollmod.RollMod>('rollmods(context)', {
    RollMod_KeepHighest(arg0, arg1) {
        return new rollmod.FilterRollMod("keep", "higher", parseInt(arg1.sourceString));
    },
    RollMod_KeepLowest(arg0, arg1) {
        return new rollmod.FilterRollMod("keep", "lower", parseInt(arg1.sourceString));
    },
    RollMod_DropHighest(arg0, arg1) {
        return new rollmod.FilterRollMod("drop", "higher", parseInt(arg1.sourceString));
    },
    RollMod_DropLowest(arg0, arg1) {
        return new rollmod.FilterRollMod("drop", "lower", parseInt(arg1.sourceString));
    },
});

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
    ExprRollInfix_Dice(arg0, arg1, arg2, arg3) {
        const mods = arg3.asIteration().children.map(
            c => {return c.rollmods(this.args.context)}
        );

        return new expression.RollExpression(
            arg0.tree(this.args.context),
            arg2.tree(this.args.context),
            mods);
    },
    ExprPriority_Paren(arg0, arg1, arg2) {
        return arg1.tree(this.args.context);
    },
    ExprPriority_RollPrefix(arg0, arg1, arg2) {
        const mods = arg2.asIteration().children.map(
            c => {return c.rollmods(this.args.context)}
        );

        return new expression.RollExpression(null, arg1.tree(this.args.context), mods);
    },
    ExprPriority_PosPrefix(arg0, arg1) {
        return new expression.PrefixExpression(new operation.AddOperation, arg1.tree(this.args.context));
    },
    ExprPriority_NegPrefix(arg0, arg1) {
        return new expression.PrefixExpression(new operation.SubtractOperation, arg1.tree(this.args.context));
    },
    AttributeInner_Function(arg0, arg1, arg2, arg3) {

        this.args.context.unresolved_variables.add(arg0.sourceString);

        const funcargs = arg2.asIteration().children.map(
            c => {return c.tree(this.args.context)}
        );

        return new expression.FunctionLiteral(arg0.sourceString, funcargs);
    },
    AttributeInner_Single(arg0) {
        this.args.context.unresolved_variables.add(arg0.sourceString);
        return new expression.FunctionLiteral(arg0.sourceString, []);
    },
    Literal_FunctionInput(arg0, arg1, arg2) {
        let index = parseInt(arg1.sourceString);
        return new expression.FunctionInputLiteral(index);
    },
    Literal_FunctionInputSingle(arg0) {
        return new expression.FunctionInputLiteral(0);
    },
    Literal_Attribute(arg0, arg1, arg2) {
        return arg1.tree(this.args.context);
    },
    Literal_number(arg0) {
        return new expression.NumberLiteral(parseFloat(this.sourceString));
    },
});

export function Parse(expr: UnparsedExpression): MyResult<ParsedExpression> {
    const matchResult = grammer.match(expr);

    // const expr_trace = grammer.trace(expr).toString();
    // console.log(expr_trace);

    if (matchResult.failed()) {
        return err(new Error.ParsingError(matchResult.shortMessage));
    }

    let parse_context: expression.ParseContext = { unresolved_variables: new Set };

    const expr_tree: expression.Expr = diceroll_semantics(matchResult).tree(parse_context);

    return ok(new ParsedExpression(expr, expr_tree, Array.from(parse_context.unresolved_variables)));
}