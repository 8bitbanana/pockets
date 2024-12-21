import { CharsheetApp } from "components/charsheet_app";
import PkTextField from "./PkTextField";


export class PkAttributeEditorField extends PkTextField {

    get_field_value(sheet: CharsheetApp): string | undefined {
        return sheet.attributes.get_inner()
            .get_unparsed(false).get_attribute(this.props.my_key)
            .unwrapOr(undefined);
    }

    set_field_value(sheet: CharsheetApp, new_value: string): void {
        sheet.attributes.mutate((inner) => {
            inner.get_unparsed(true).modify_attribute(this.props.my_key, new_value);
        });
    }
}

export class PkAttributeViewerField extends PkTextField {

    get_field_value(sheet: CharsheetApp): string | undefined {
        return sheet.attributes.get_inner()
            .get_parsed().evaluate(this.props.my_key)
            .unwrapOr(undefined)?.total.toString();
    }

    is_editable(): boolean {
        return false;
    }

    set_field_value(sheet: CharsheetApp, new_value: string): void {
    }
}
