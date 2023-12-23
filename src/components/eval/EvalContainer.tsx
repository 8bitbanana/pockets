
import { EvaluatedExpression } from "lib/diceroll/mod";
import { MyResult } from "lib/errors";
import { Component } from "preact";
import { EvalSuccess, EvalSuccessTree } from "./EvalSuccess";
import { EvalError } from "./EvalError";

type EvalContainerProps ={
    eval_result?: MyResult<EvaluatedExpression>
    show_tree: boolean
};

export class EvalContainer extends Component<EvalContainerProps,{}> {

    constructor() {
        super();
    }

    render() {
        if (this.props.eval_result !== undefined) {

            if (this.props.eval_result.isOk) {
                if (this.props.show_tree) {
                    return <EvalSuccessTree eval_result={this.props.eval_result.value} />;   
                } else {
                    return <EvalSuccess eval_result={this.props.eval_result.value} />;
                }
            } else {
                return <EvalError eval_error={this.props.eval_result.error} />;
            }
            
        } else {
            // Nothing has been evaluated yet
            return <div>None</div>;
        }
    }
}

export default EvalContainer;