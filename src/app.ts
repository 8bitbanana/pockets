import * as ohm from 'ohm-js';
import * as ohm_extras from 'ohm-js/extras';
import * as parser from './diceroll/mod';

var obj:any = {};
obj = window;

obj.parseFunc = function(expr: string) {
    const parsed = parser.ParsedExpression.Parse(expr);
    console.log(parsed?.Evaluate());
    return parsed;
};

console.log('Hello world!');