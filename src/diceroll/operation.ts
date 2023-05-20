import { ok, err } from "true-myth/dist/public/result";
import { MyResult, DivisionByZero } from "../errors";

export interface InfixOperation {
    RunInfix(left: number, right: number): MyResult<number>;
}
export interface PrefixOperation {
    RunPrefix(right: number): MyResult<number>;
}
export class AddOperation implements PrefixOperation, InfixOperation {
    RunInfix(left: number, right: number): MyResult<number> {
        return ok(left + right);
    }

    RunPrefix(right: number): MyResult<number> {
        return this.RunInfix(0, right);
    }
}
export class SubtractOperation implements PrefixOperation, InfixOperation {
    RunInfix(left: number, right: number): MyResult<number> {
        return ok(left - right);
    }
    RunPrefix(right: number): MyResult<number> {
        return this.RunInfix(0, right);
    }
}
export class RollOperation implements PrefixOperation, InfixOperation {
    RunInfix(left: number, right: number): MyResult<number> {

        if (left == 0 || right == 0) {
            return ok(0);
        }

        var total = 0;
        for (var i = 0; i < left; i++) {
            total += Math.floor(Math.random() * right) + 1;
        }

        return ok(total);
    }
    RunPrefix(right: number): MyResult<number> {
        return this.RunInfix(1, right);
    }
}
export class FloorDivideOperation implements InfixOperation {
    RunInfix(left: number, right: number): MyResult<number> {
        if (right === 0.0) {
            return err(new DivisionByZero);
        }

        return ok(Math.floor(left / right));
    }
}
export class DivideOperation implements InfixOperation {
    RunInfix(left: number, right: number): MyResult<number> {
        if (right == 0.0) {
            return err(new DivisionByZero);
        }

        return ok(left / right);
    }
}
export class MultiplyOperation implements InfixOperation {
    RunInfix(left: number, right: number): MyResult<number> {
        return ok(left * right);
    }
}
export class PowerOfOperation implements InfixOperation {
    RunInfix(left: number, right: number): MyResult<number> {
        return ok(left ** right);
    }
}
