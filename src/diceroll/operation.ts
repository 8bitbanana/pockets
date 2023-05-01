export interface InfixOperation {
    RunInfix(left: number, right: number): number;
}
export interface PrefixOperation {
    RunPrefix(right: number): number;
}
export class AddOperation implements PrefixOperation, InfixOperation {
    RunInfix(left: number, right: number): number {
        return left + right;
    }

    RunPrefix(right: number): number {
        return this.RunInfix(0, right);
    }
}
export class SubtractOperation implements PrefixOperation, InfixOperation {
    RunInfix(left: number, right: number): number {
        return left - right;
    }
    RunPrefix(right: number): number {
        return this.RunInfix(0, right);
    }
}
export class RollOperation implements PrefixOperation, InfixOperation {
    RunInfix(left: number, right: number): number {

        if (left == 0 || right == 0) {
            return 0;
        }

        var total = 0;
        for (var i = 0; i < left; i++) {
            total += Math.floor(Math.random() * right) + 1;
        }

        return total;
    }
    RunPrefix(right: number): number {
        return this.RunInfix(1, right);
    }
}
export class FloorDivideOperation implements InfixOperation {
    RunInfix(left: number, right: number): number {
        return Math.floor(left / right);
    }
}
export class DivideOperation implements InfixOperation {
    RunInfix(left: number, right: number): number {
        return left / right;
    }
}
export class MultiplyOperation implements InfixOperation {
    RunInfix(left: number, right: number): number {
        return left * right;
    }
}
export class PowerOfOperation implements InfixOperation {
    RunInfix(left: number, right: number): number {
        return left ** right;
    }
}
