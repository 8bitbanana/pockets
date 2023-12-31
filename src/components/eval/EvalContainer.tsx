
import { EvaluatedExpression } from "lib/diceroll/mod";
import { MyResult } from "lib/errors";
import { Component } from "preact";
import { EvalSuccess, EvalSuccessTree } from "./EvalSuccess";
import { EvalError } from "./EvalError";
import SignalWrapper from "components/utils/SignalWrapper";
import { Maybe } from "true-myth";

type EvalContainerProps ={
    eval_result: SignalWrapper<Maybe<MyResult<EvaluatedExpression>>>
    show_tree: boolean
};

export class EvalContainer extends Component<EvalContainerProps,{}> {

    constructor() {
        super();
    }

    render() {

        const eval_result = this.props.eval_result.get_inner();

        if (eval_result.isJust) {

            if (eval_result.value.isOk) {
                if (this.props.show_tree) {
                    return <EvalSuccessTree eval_result={eval_result.value.value} />;   
                } else {
                    return <EvalSuccess eval_result={eval_result.value.value} />;
                }
            } else {
                return <EvalError eval_error={eval_result.value.error} />;
            }
            
        } else {
            // Nothing has been evaluated yet
            return <div>None</div>;
        }
    }
}

export default EvalContainer;