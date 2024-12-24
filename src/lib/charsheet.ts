
import { TextFieldContainer } from "./TextFieldContainer";
import {AttrContainer, UnparsedAttrContainer} from "./attribute";
import { EvaluatedExpression } from "./diceroll/mod";
import { MyResult } from "./errors";

type CharsheetSkillsBoxEntry = {
    key_prof: string,
    key_mod: string,
    key_check: string,
    ability: string,
    label: string,
    starting_proficiency: string
}

type Ability = "str" | "dex" | "con" | "int" | "wis" | "cha";
type Proficiency = "0" | "1" | "2";

export class CharsheetSkillsBox {
    public title: string;
    public skills: CharsheetSkillsBoxEntry[] = [];

    constructor(title: string) {
        this.title = title;
    }

    AddSkill(prefix: string, label: string, ability: Ability, value: Proficiency = "0") {
        this.skills.push({
            key_prof: prefix + "_prof",
            key_mod: prefix + "_mod",
            key_check: prefix + "_check",
            ability,
            label,
            starting_proficiency: value
        })
    }
}

export class Charsheet {
    public attributes: AttrContainer;
    public text_fields: TextFieldContainer;
    public skills: CharsheetSkillsBox;

    constructor(attributes: AttrContainer, text_fields: TextFieldContainer, skills: CharsheetSkillsBox) {
        this.attributes = attributes;
        this.text_fields = text_fields;
        this.skills = skills;

        for (const skill of skills.skills) {
            const attrs = this.attributes.get_unparsed(true);
            attrs.add_attribute(skill.key_prof, skill.starting_proficiency);
            attrs.add_attribute(skill.key_mod, `[${skill.ability}_mod]+[${skill.key_prof}]*[pb]`)
            attrs.add_attribute(skill.key_check, `[roll]+[${skill.key_mod}]`);
        }
    }
}