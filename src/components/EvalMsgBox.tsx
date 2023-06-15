
import { EvaluatedExpression } from "lib/diceroll/mod";
import { MyResult } from "lib/errors";
import { Component } from "preact";

type EvalMsgBoxProps ={
    eval_result?: MyResult<EvaluatedExpression>;
};

export class EvalMsgBox extends Component<EvalMsgBoxProps,{}> {

    constructor() {
        super();
    }

    render() {
        if (this.props.eval_result !== undefined) {

            if (this.props.eval_result.isOk) {
                // The evaluation was a success
                console.log(this.props.eval_result.value.annex);

                let outstr = "";
                for (const token of this.props.eval_result.value.annex) {
                    if (typeof token === "string") {
                        outstr += token;
                    }
                    else {
                        outstr += token.ToString();
                    }
                }

                return <div>
                    {this.props.eval_result.value.total} = {outstr}
                </div>;
            } else {
                // The evaluation errored

                return <div>
                    Error: {this.props.eval_result.error.Display()}
                </div>
            }
            
        } else {
            // Nothing has been evaluated yet
            return <div>None</div>;
        }
    }
}

export default EvalMsgBox;