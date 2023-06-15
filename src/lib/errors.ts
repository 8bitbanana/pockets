
import { Result } from 'true-myth';

// Todo - store parent errors so we can walk up the stack
export interface Error {
    Display(): string;
}

export class UnknownVariable implements Error {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    Display(): string {
        return `Unknown Variable \"${this.name}\"`
    }
};

export class AttributeCycle implements Error {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    Display(): string {
        return `Attribute cycle \"${this.name}\"`
    }
};

export class Timeout implements Error {
    Display(): string {
        return `Timeout`
    }
};

export class DivisionByZero implements Error {
    Display(): string {
        return `Division by zero`;
    }
};

export class ParsingError implements Error {
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