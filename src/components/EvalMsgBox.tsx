
import { EvaluatedExpression } from "lib/diceroll/mod";
import { Component } from "preact";

type EvalMsgBoxProps = {
    expr?: EvaluatedExpression;
}

export class EvalMsgBox extends Component<EvalMsgBoxProps,{}> {

    constructor() {
        super();
    }

    render() {
        if (this.props.expr !== undefined) {
            console.log(this.props.expr.annex);

            let outstr = "";
            for (const token of this.props.expr.annex) {
                if (typeof token === "string") {
                    outstr += token;
                }
                else {
                    outstr += token.ToString();
                }
            }

            return <div>
                {this.props.expr.total} = {outstr}
            </div>;
        } else {
            return <div>None</div>;
        }
    }
}

export default EvalMsgBox;