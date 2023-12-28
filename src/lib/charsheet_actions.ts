import { Charsheet } from "./charsheet";
import { EvaluatedExpression } from "./diceroll/mod";
import { ErrorContext, add_context } from "./errors";

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
        
        sheet.last_ran_expr = eval_result;
        return true;
    }
}

export class CA_SetEditMode implements CharsheetAction {
    new_edit_mode: boolean;
    constructor(new_edit_mode: boolean) {
        this.new_edit_mode = new_edit_mode;
    }

    run(sheet: Charsheet): boolean {
        if (sheet.edit_mode !== this.new_edit_mode) {
            sheet.edit_mode = this.new_edit_mode;
            return true;
        }
        return false;
    }
}

export class CA_ModifyTextField implements CharsheetAction {
    key: string;
    new_text: string;
    constructor(key: string, new_text: string) {
        this.key = key; this.new_text = new_text;
    }

    run(sheet: Charsheet): boolean {
        return sheet.text_fields.modify(this.key, this.new_text);
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