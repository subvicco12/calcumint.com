export type FormulaValue = number | boolean;

type Token =
  | { type: "number"; value: number }
  | { type: "identifier"; value: string }
  | { type: "operator"; value: string }
  | { type: "paren"; value: "(" | ")" }
  | { type: "comma" };

const functionNames = new Set(["IF", "MIN", "MAX", "ABS", "ROUND", "FLOOR", "CEIL"]);

function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;
  while (index < source.length) {
    const rest = source.slice(index);
    const whitespace = rest.match(/^\s+/);
    if (whitespace) { index += whitespace[0].length; continue; }
    const number = rest.match(/^(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/i);
    if (number) { tokens.push({ type: "number", value: Number(number[0]) }); index += number[0].length; continue; }
    const identifier = rest.match(/^[A-Za-z_][A-Za-z0-9_]*/);
    if (identifier) { tokens.push({ type: "identifier", value: identifier[0] }); index += identifier[0].length; continue; }
    const two = rest.slice(0, 2);
    if (["<=", ">=", "==", "!=", "&&", "||"].includes(two)) { tokens.push({ type: "operator", value: two }); index += 2; continue; }
    const one = rest[0];
    if (["+", "-", "*", "/", "^", "<", ">", "!"].includes(one)) { tokens.push({ type: "operator", value: one }); index += 1; continue; }
    if (one === "(" || one === ")") { tokens.push({ type: "paren", value: one }); index += 1; continue; }
    if (one === ",") { tokens.push({ type: "comma" }); index += 1; continue; }
    throw new Error(`Unsupported formula token at position ${index + 1}`);
  }
  return tokens;
}

class Parser {
  private position = 0;
  constructor(private readonly tokens: Token[], private readonly variables: Record<string, number>) {}

  parse(): FormulaValue {
    const value = this.parseOr();
    if (this.position !== this.tokens.length) throw new Error("Unexpected formula token");
    return value;
  }

  private peek(): Token | undefined { return this.tokens[this.position]; }
  private peekParen(value: "(" | ")"): boolean { const token = this.peek(); return token?.type === "paren" && token.value === value; }
  private consume(): Token { const token = this.tokens[this.position]; if (!token) throw new Error("Unexpected end of formula"); this.position += 1; return token; }
  private matchOperator(value: string): boolean { const token = this.peek(); if (token?.type === "operator" && token.value === value) { this.position += 1; return true; } return false; }

  private parseOr(): FormulaValue {
    let left = this.parseAnd();
    while (this.matchOperator("||")) left = this.toBoolean(left) || this.toBoolean(this.parseAnd());
    return left;
  }
  private parseAnd(): FormulaValue {
    let left = this.parseComparison();
    while (this.matchOperator("&&")) left = this.toBoolean(left) && this.toBoolean(this.parseComparison());
    return left;
  }
  private parseComparison(): FormulaValue {
    const left = this.parseAdditive();
    const token = this.peek();
    if (token?.type === "operator" && ["<", "<=", ">", ">=", "==", "!="].includes(token.value)) {
      this.position += 1;
      const right = this.parseAdditive();
      const a = this.toNumber(left); const b = this.toNumber(right);
      if (token.value === "<") return a < b;
      if (token.value === "<=") return a <= b;
      if (token.value === ">") return a > b;
      if (token.value === ">=") return a >= b;
      if (token.value === "==") return a === b;
      return a !== b;
    }
    return left;
  }
  private parseAdditive(): FormulaValue {
    let left = this.parseMultiplicative();
    while (true) {
      if (this.matchOperator("+")) left = this.toNumber(left) + this.toNumber(this.parseMultiplicative());
      else if (this.matchOperator("-")) left = this.toNumber(left) - this.toNumber(this.parseMultiplicative());
      else return left;
    }
  }
  private parseMultiplicative(): FormulaValue {
    let left = this.parsePower();
    while (true) {
      if (this.matchOperator("*")) left = this.toNumber(left) * this.toNumber(this.parsePower());
      else if (this.matchOperator("/")) {
        const right = this.toNumber(this.parsePower());
        if (right === 0) throw new Error("Division by zero");
        left = this.toNumber(left) / right;
      } else return left;
    }
  }
  private parsePower(): FormulaValue {
    let left = this.parseUnary();
    if (this.matchOperator("^")) left = this.toNumber(left) ** this.toNumber(this.parsePower());
    return left;
  }
  private parseUnary(): FormulaValue {
    if (this.matchOperator("-")) return -this.toNumber(this.parseUnary());
    if (this.matchOperator("+")) return this.toNumber(this.parseUnary());
    if (this.matchOperator("!")) return !this.toBoolean(this.parseUnary());
    return this.parsePrimary();
  }
  private parsePrimary(): FormulaValue {
    const token = this.consume();
    if (token.type === "number") return token.value;
    if (token.type === "identifier") {
      const upper = token.value.toUpperCase();
      if (upper === "TRUE") return true;
      if (upper === "FALSE") return false;
      if (this.peekParen("(")) return this.callFunction(upper);
      const value = this.variables[token.value];
      if (value === undefined || !Number.isFinite(value)) throw new Error(`Unknown or invalid variable: ${token.value}`);
      return value;
    }
    if (token.type === "paren" && token.value === "(") {
      const value = this.parseOr();
      const closing = this.consume();
      if (closing.type !== "paren" || closing.value !== ")") throw new Error("Expected closing parenthesis");
      return value;
    }
    throw new Error("Expected number, variable, function or parenthesis");
  }
  private callFunction(name: string): FormulaValue {
    if (!functionNames.has(name)) throw new Error(`Unsupported function: ${name}`);
    this.consume();
    const args: FormulaValue[] = [];
    if (!this.peekParen(")")) {
      while (true) {
        args.push(this.parseOr());
        if (this.peek()?.type === "comma") { this.consume(); continue; }
        break;
      }
    }
    const closing = this.consume();
    if (closing.type !== "paren" || closing.value !== ")") throw new Error("Expected closing parenthesis");
    if (name === "IF") { if (args.length !== 3) throw new Error("IF requires 3 arguments"); return this.toBoolean(args[0]) ? args[1] : args[2]; }
    const nums = args.map((value) => this.toNumber(value));
    if (name === "MIN") { if (!nums.length) throw new Error("MIN requires arguments"); return Math.min(...nums); }
    if (name === "MAX") { if (!nums.length) throw new Error("MAX requires arguments"); return Math.max(...nums); }
    if (name === "ABS") { if (nums.length !== 1) throw new Error("ABS requires 1 argument"); return Math.abs(nums[0]); }
    if (name === "FLOOR") { if (nums.length !== 1) throw new Error("FLOOR requires 1 argument"); return Math.floor(nums[0]); }
    if (name === "CEIL") { if (nums.length !== 1) throw new Error("CEIL requires 1 argument"); return Math.ceil(nums[0]); }
    if (name === "ROUND") {
      if (nums.length < 1 || nums.length > 2) throw new Error("ROUND requires 1 or 2 arguments");
      const digits = nums[1] ?? 0;
      if (!Number.isInteger(digits) || digits < 0 || digits > 12) throw new Error("ROUND digits must be an integer from 0 to 12");
      const factor = 10 ** digits;
      return Math.round((nums[0] + Number.EPSILON) * factor) / factor;
    }
    throw new Error(`Unsupported function: ${name}`);
  }
  private toNumber(value: FormulaValue): number { if (typeof value !== "number" || !Number.isFinite(value)) throw new Error("Expected a finite number"); return value; }
  private toBoolean(value: FormulaValue): boolean { return typeof value === "boolean" ? value : value !== 0; }
}

export function evaluateFormula(source: string, variables: Record<string, number>): FormulaValue {
  if (!source.trim()) throw new Error("Formula is required");
  if (source.length > 2000) throw new Error("Formula is too long");
  return new Parser(tokenize(source), variables).parse();
}
