
import * as parser from '../mod';
import { Error } from 'lib/errors';
import * as parser_expression from '../parser/expression';

test("Hello jest!", () => {
    expect(true).toBeTruthy();
});

test("Parser functions", () => {
    const parsed = parser.Parse("d20").unwrapOrElse((e) => {throw e;});
    expect(parsed.parsed_expression).toBeInstanceOf(parser_expression.InfixExpression);
});