import { Charsheet } from "./charsheet";
import { EvaluatedExpression } from "./diceroll/parser/expression";

export interface CharsheetAction {
    run(sheet: Charsheet): boolean;
}

export class CA_AddBlankAttribute implements CharsheetAction {
    run(sheet: Charsheet): boolean {
        let count = 0
        while (count++ < 1000) {
            const name = "new" + count;
            if (!sheet.attributes.has(name)) {
                sheet.attributes.add(name, "0");
                return true;
            }
        }

        return false;
    }
}

export class CA_DeleteAttribute implements CharsheetAction {

    key: string;
    constructor(key: string) {
        this.key = key;
    }

    run(sheet: Charsheet): boolean {
        return sheet.attributes.delete(this.key);
    }
}

export class CA_ModifyAttribute implements CharsheetAction {
    key: string;
    new_expr: string;
    constructor(key: string, new_expr: string) {
        this.key = key; this.new_expr = new_expr;
    }

    run(sheet: Charsheet): boolean {
        return sheet.attributes.modify(this.key, this.new_expr);
    }
}

export class CA_RenameAttribute implements CharsheetAction {
    old_key: string;
    new_key: string;
    constructor(old_key: string, new_key: string) {
        this.old_key = old_key; this.new_key = new_key;
    }

    run(sheet: Charsheet): boolean {
        return sheet.attributes.rename(this.old_key, this.new_key);
    }
}

export class CA_Evaluate implements CharsheetAction {
    attr_name: string;
    constructor(attr_name: string) {
        this.attr_name = attr_name;
    }

    run(sheet: Charsheet): boolean {

        const eval_result = sheet.attributes.evaluate(this.attr_name);
        if (eval_result.isErr) {
            return false;
        }

        sheet.last_ran_expr = eval_result.value;
        return true;
    }
}

export const CharsheetReducer = (old_sheet: Charsheet, action: CharsheetAction) => {

    let sheet: Charsheet = {...old_sheet};

    console.info("Action: " + action.constructor.name);

    if (action.run(sheet)) {
        return sheet;   
    } else {
        return old_sheet;
    }
}