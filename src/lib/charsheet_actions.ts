import { Charsheet } from "./charsheet";

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

export const CharsheetReducer = (old_sheet: Charsheet, action: CharsheetAction) => {

    let sheet: Charsheet = {...old_sheet};

    console.info("Action: " + action.constructor.name);

    if (action.run(sheet)) {
        return sheet;   
    } else {
        return old_sheet;
    }
}