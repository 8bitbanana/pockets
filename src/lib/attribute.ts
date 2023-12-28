import { Parse, Evaluate, UnparsedExpression, ParsedExpression, EvaluatedExpression } from "lib/diceroll/mod";

import { MyResult, add_context } from "./errors";
import * as Error from './errors';
import { ok, err } from "true-myth/dist/es/result";
import { ContainerBase } from "./ContainerBase";

type AttrKey = string;
export type Attribute = UnparsedExpression;

export class AttrContainer extends ContainerBase<AttrKey, Attribute> {

    get_expression_string(attrkey: AttrKey): MyResult<string> {
        return this.get_attribute(attrkey);
    }

    private get_attribute(attrkey: AttrKey): MyResult<Attribute> {
        const attr = this.data.get(attrkey);
        if (attr === undefined) {
            return err(new Error.UnknownVariable(attrkey));
        }
        return ok(attr);
    }

    private do_evaluation(
        attrkey: AttrKey,
        VisitedAttrs: Set<AttrKey>,
        ResolvedVariables: Map<AttrKey, EvaluatedExpression>,
        RecurseCount: number
        ): MyResult<EvaluatedExpression>
        {
            if (RecurseCount > 1000)
            {
                return err(new Error.Timeout);
            }

            const resolved_var = ResolvedVariables.get(attrkey);
            if (resolved_var !== undefined)
            {
                return ok(resolved_var);
            }

            if (VisitedAttrs.has(attrkey))
            {
                return err(new Error.AttributeCycle(attrkey));
            }

            const attr_result = this.get_attribute(attrkey);
            if (attr_result.isErr) {
                return err(attr_result.error);
            }

            const parse_result = Parse(attr_result.value);
            if (parse_result.isErr) {
                return err(parse_result.error);
            }
            const parsed = parse_result.value;

            VisitedAttrs.add(attrkey);

            const dependencies = parsed.unresolved_variables;
            for (const dependency of dependencies) {
                const result = add_context(
                    this.do_evaluation(dependency, VisitedAttrs, ResolvedVariables, RecurseCount + 1),
                    `Evaluating dependency \"${dependency}\"`);
                if (result.isErr)
                {
                    console.log("a");
                    return result;
                }
                ResolvedVariables.set(dependency, result.value);
            }

            VisitedAttrs.delete(attrkey);

            const evaluation = Evaluate(parsed, ResolvedVariables);

            if (evaluation.isErr) {

                console.log("Evaluating %s - Error!", attrkey);
                console.log(evaluation.error);

                return evaluation;
            }

            console.log("Evaluating %s - %d!", attrkey, evaluation.value.total);
            console.log(evaluation.value);

            return evaluation;
        }

    evaluate(attrToEvaluate: AttrKey): MyResult<EvaluatedExpression> {

        return add_context(this.do_evaluation(
            attrToEvaluate, new Set<string>, new Map<string, EvaluatedExpression>, 0
        ), `Evaluating root attribute \"${attrToEvaluate}\"`);
    }
}