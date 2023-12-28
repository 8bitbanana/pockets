import { err, ok } from "true-myth/dist/es/result";
import { ContainerBase } from "./ContainerBase";
import { MyResult } from "./errors";
import * as Error from "./errors";

type TextFieldKey = string;
export type TextField = string;

export class TextFieldContainer extends ContainerBase<TextFieldKey, TextField> {

    get_text_field_string(key: TextFieldKey): MyResult<string> {
        return this.get_text_field(key);
    }

    private get_text_field(key: TextFieldKey): MyResult<TextFieldKey> {
        const attr = this.data.get(key);
        if (attr === undefined) {
            return err(new Error.UnknownVariable(key));
        }
        return ok(attr);
    }
}