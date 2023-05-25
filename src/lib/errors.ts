
import { Result } from 'true-myth';

export interface Error {

}

export class UnknownVariable implements Error {
    name: string;

    constructor(name: string) {
        this.name = name;
    }
};

export class AttributeCycle implements Error {
    name: string;

    constructor(name: string) {
        this.name = name;
    }
};

// export class RuntimeEvalError implements Error {
//     description: string = "" 
// };

export class Timeout implements Error {};

export class DivisionByZero implements Error {};

export class ParsingError implements Error {
    description: string | null = null;
}

export type MyResult<T> = Result<T, Error>;