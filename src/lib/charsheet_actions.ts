import { Charsheet } from "./charsheet";

export enum CharsheetAction {
    ADD_BLANK_ATTRIBUTE = "ADD_BLANK_ATTRIBUTE"
}

export const CharsheetReducer = (old_sheet: Charsheet, action: CharsheetAction) => {

    let sheet: Charsheet = {...old_sheet};

    console.info("Action: " + action);

    switch (action) {
        case CharsheetAction.ADD_BLANK_ATTRIBUTE:

            let count = 0
            while (count++ < 1000) {
                const name = "new" + count;
                if (!sheet.attributes.has(name)) {
                    sheet.attributes.add(name, "0");
                    break;
                }
            }
            break; 
        default:
            return old_sheet;
    }

    return sheet;
}