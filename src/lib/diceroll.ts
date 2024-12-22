export type Diceroll = {
    result: number,
    ignored: boolean
}

export type DicerollResult = {
    result: number,
    crit_success: boolean,
    crit_fail: boolean,
    ignored: boolean
}

export type DicerollResultSet = {
    total: number,
    rolls: DicerollResult[]
}

type CritRangeMode = "greatereq" | "lessereq" | "eq" | "never";
class CritRange {

    value: number;
    mode: CritRangeMode;

    constructor(value: number, mode: CritRangeMode) {
        this.value = value;
        this.mode = mode;
    }

    is_in_range(result: number): boolean {
        switch (this.mode) {
            case "greatereq":
                return result >= this.value;
            case "lessereq":
                return result <= this.value;
            case "eq":
                return result == this.value;
            case "never":
                return false;
        }
    }
}

export class DicerollSet {
    results: Diceroll[];
    size: number;
    crit_success_range: CritRange;
    crit_fail_range: CritRange;

    constructor(results: Diceroll[], size: number) {
        this.results = results;
        this.size = size;
        this.crit_success_range = new CritRange(size, "greatereq");
        this.crit_fail_range = new CritRange(1, "lessereq");
    }

    evaluate(): DicerollResultSet {
        let total = 0;
        let rolls = [];

        for (const result of this.results) {
            if (!result.ignored) {
                total += result.result;
            }

            const eval_result: DicerollResult = {
                result: result.result,
                ignored: result.ignored,
                crit_success: this.crit_success_range.is_in_range(result.result),
                crit_fail: this.crit_fail_range.is_in_range(result.result)
            }

            rolls.push(eval_result);
        }

        return {total, rolls};
    }
}