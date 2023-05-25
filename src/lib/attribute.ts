import { UnparsedExpression, ParsedExpression, EvaluatedExpression } from "lib/diceroll/mod";

import { MyResult } from "./errors";
import * as Error from './errors';

import { ok, err } from 'true-myth/dist/public/result';

type AttrKey = string;
export type Attribute = UnparsedExpression;

export class AttrContainer {

    data: Map<AttrKey, Attribute> = new Map();

    add(name: string, expression: Attribute) {
        this.data.set(name, expression);
    }

    has(name: string): boolean {
        return this.data.has(name);
    }

    delete(name: string): boolean {
        return this.data.delete(name);
    }

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

    evaluate(attrToEvaluate: AttrKey): MyResult<EvaluatedExpression> {

        // const attr = this.data.get(attrToEvaluate);
        // if (attr === undefined) { return err( new Error.UnknownVariable(attrToEvaluate) ); }

        let resolved_variables: Map<string, EvaluatedExpression> = new Map;

        let stack: AttrKey[] = [attrToEvaluate];
        // stack.concat(Array.from(attr.GetUnresolvedVariables()));

        let safety = 1_000_000;
        while (safety-- > 0) {
            const attrkey = stack.pop();
            if (attrkey === undefined) {
                break;
            }

            if (resolved_variables.has(attrkey)) {
                continue;
            }

            // todo - Improve performance (set of visited attrs?)
            if (stack.includes(attrkey)) {
                return err(new Error.AttributeCycle(attrkey));
            }

            const attr_result = this.get_attribute(attrkey);
            if (attr_result.isErr) {
                return err(attr_result.error);
            }

            const parse_result = ParsedExpression.Parse(attr_result.value);
            if (parse_result.isErr) {
                return err(parse_result.error);
            }
            const parsed = parse_result.value;

            const dependencies = parsed.GetUnresolvedVariables();

            let wasDependencyFound = false;
            for (const dependency of dependencies) {
                if (!resolved_variables.has(dependency)) {

                    // This key has a dependency which isn't resolved yet.
                    // Push it back onto the stack, push it's dependency onto the stack,
                    // then continue the while loop to eval the dependency (since its on top of the stack).

                    stack.push(attrkey);
                    stack.push(dependency);
                    wasDependencyFound = true;
                    break;
                }
            }
            if (wasDependencyFound) {
                continue;
            }

            // This key has no unresolved dependencies, we're free to eval it

            const evaluation = parsed.Evaluate(resolved_variables);

            if (evaluation.isErr) {

                console.log("Evaluating %s - Error!", attrkey);
                console.log(evaluation.error);

                return evaluation;
            }

            console.log("Evaluating %s - %d!", attrkey, evaluation.value.result);
            console.log(evaluation.value);
            
            // If this is the key we asked for, return it
            if (attrkey === attrToEvaluate) {

                return evaluation;
            }

            resolved_variables.set(attrkey, evaluation.value);
        }
    
        throw "unreachable";
    
    }
}