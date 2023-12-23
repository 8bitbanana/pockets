export type Diceroll = {
    result: number,
    size: number,
    ignored: boolean,
    crit_success: boolean,
    crit_fail: boolean
}

export type DicerollSet = {
    total: number,
    results: Diceroll[]
}
