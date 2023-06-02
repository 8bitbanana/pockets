
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
            return <div>
                {this.props.expr.result}
            </div>;
        } else {
            return <div>None</div>;
        }
    }
}

export default EvalMsgBox;