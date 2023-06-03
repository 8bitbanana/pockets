
import * as parser from '../mod';

test("Hello jest!", () => {
    expect(true).toBeTruthy();
});

test("Parser functions", () => {
    const parsed = parser.Parse("d20");
    expect(parsed).toBeDefined();
});