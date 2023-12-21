
import { Result } from 'true-myth';

export class ErrorContext {

    display: string;

    constructor(display: string) {
        this.display = display;
    }
}

export abstract class Error {
    context_stack: ErrorContext[] = [];

    abstract Display(): string;

    PrintContext(): string {
        let out = "";
        this.context_stack.forEach(element => {
            out += element.display + "\n";
        });
        return out;
    }

    PushContext(context: ErrorContext): void {
        this.context_stack.push(context);
    }
}

export class UnknownVariable extends Error {
    name: string;

    constructor(name: string) {
        super();
        this.name = name;
    }

    Display(): string {
        return `Unknown Variable \"${this.name}\"`
    }
};

export class AttributeCycle extends Error {
    name: string;

    constructor(name: string) {
        super();
        this.name = name;
    }

    Display(): string {
        return `Attribute cycle \"${this.name}\"`
    }
};

export class Timeout extends Error {
    Display(): string {
        return `Timeout`
    }
};

export class DivisionByZero extends Error {
    Display(): string {
        return `Division by zero`;
    }
};

export class ParsingError extends Error {
    description: string | null = null;

    Display(): string {
        if (this.description !== null) {
            return `Parsing error \"${this.description}\"`;
        } else {
            return "Parsing error";
        }
    }
}

export type MyResult<T> = Result<T, Error>;

export function add_context<T>(result: MyResult<T>, context_display: string): MyResult<T> {

    if (result.isErr) {
        result.error.PushContext(new ErrorContext(context_display));
    }
    
    return result;
}