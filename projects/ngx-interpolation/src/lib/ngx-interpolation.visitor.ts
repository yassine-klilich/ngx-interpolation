import { UpperCasePipe } from '@angular/common';
import {
  AstVisitor,
  AST,

  // Discovered
  ASTWithSource,
  Interpolation,
  PropertyRead,
  Binary,
  LiteralPrimitive,
  LiteralArray,
  Conditional,
  ImplicitReceiver,
  KeyedRead,
  LiteralMap,
  SafePropertyRead,
  Call,
  SafeCall,
  SafeKeyedRead,
  PrefixNot,
  NonNullAssert,

  // Undiscovered
  Chain,
  KeyedWrite,
  PropertyWrite,
  ThisReceiver,
  Unary,
  BindingPipe,
} from '@angular/compiler';

export class NgxInterpolationVisitor implements AstVisitor {

  private _isSafeAccess: boolean = true;

  // Interpolation
  visitInterpolation(ast: Interpolation, context: any) {
    return ast;
  }

  // PropertyRead
  visitPropertyRead(ast: PropertyRead, context: any) {
    let _context: any = this.visit(ast.receiver, context);

    return this._isSafeAccess ? _context[ast.name] : null;
  }

  // SafePropertyRead
  visitSafePropertyRead(ast: SafePropertyRead, context: any) {
    let _context: any = this.visit(ast.receiver, context);
    if(_context == null || _context == undefined){
      this._isSafeAccess = false;
      return null;
    }

    return _context[ast.name];
  }

  // Binary
  visitBinary(ast: Binary, context: any) {
    let leftValue: any = this.visit(ast.left, context);
    let rightValue: any = this.visit(ast.right, context);
    let result: any;

    switch (ast.operation) {
      case '+':
        result = leftValue + rightValue;
        break;
      case '-':
        result = leftValue - rightValue;
        break;
      case '*':
        result = leftValue * rightValue;
        break;
      case '/':
        result = leftValue / rightValue;
        break;
      case '%':
        result = leftValue % rightValue;
        break;
      case '&&':
        result = leftValue && rightValue;
        break;
      case '||':
        result = leftValue || rightValue;
        break;
      case '==':
        result = leftValue == rightValue;
        break;
      case '!=':
        result = leftValue != rightValue;
        break;
      case '===':
        result = leftValue === rightValue;
        break;
      case '!==':
        result = leftValue !== rightValue;
        break;
      case '<':
        result = leftValue < rightValue;
        break;
      case '>':
        result = leftValue > rightValue;
        break;
      case '<=':
        result = leftValue <= rightValue;
        break;
      case '>=':
        result = leftValue >= rightValue;
        break;
      default:
        throw new Error(`Unsupported operation ${ast.operation}`);
    }

    return result;
  }

  // Conditional
  visitConditional(ast: Conditional, context: any) {
    let conditionResult: boolean = this.visit(ast.condition, context);
    if(conditionResult){
      return this.visit(ast.trueExp, context);
    }else{
      return this.visit(ast.falseExp, context);
    }
  }

  // ImplicitReceiver
  visitImplicitReceiver(ast: ImplicitReceiver, context: any) {
    this._isSafeAccess = true;
    return context;
  }

  // KeyedRead
  visitKeyedRead(ast: KeyedRead, context: any) {
    let obj: any = this.visit(ast.receiver, context);
    let key: any = this.visit(ast.key, context);

    return obj[key];
  }

  // LiteralArray
  visitLiteralArray(ast: LiteralArray, context: any) {
    return ast.expressions.map((expression: AST) => this.visit(expression, context));
  }

  // LiteralMap
  visitLiteralMap(ast: LiteralMap, context: any) {
    let obj: any = {};
    ast.values.forEach((value: AST, index: number)=>{
      const key = ast.keys[index].key;
      obj[key] = this.visit(value, context);
    })

    return obj;
  }

  // LiteralPrimitive
  visitLiteralPrimitive(ast: LiteralPrimitive, context: any) {
    return ast.value;
  }

  // Call
  visitCall(ast: Call, context: any) {
    const args: Array<any> = ast.args.map((arg: AST) => this.visit(arg, context));
    let _context: any = this.visit(ast.receiver, context);

    if(!this._isSafeAccess) {
      return null
    }
    if(typeof _context !== 'function'){
      throw new TypeError(`_ctx.${_context.name} is not a function`);
    }

    return _context.apply(context, args);
  }

  // SafeCall
  visitSafeCall(ast: SafeCall, context: any) {
    const args: Array<any> = ast.args.map((arg: AST) => this.visit(arg, context));
    let _context: any = this.visit(ast.receiver, context);

    if(_context == null || _context == undefined){
      this._isSafeAccess = false;
      return null;
    }
    if(typeof _context !== 'function'){
      throw new TypeError(`_ctx.${_context} is not a function`);
    }

    return _context.apply(context, args);
  }

  // SafeKeyedRead
  visitSafeKeyedRead(ast: SafeKeyedRead, context: any) {
    let obj: any = this.visit(ast.receiver, context);
    let key: any = this.visit(ast.key, context);

    if(obj == null || obj[key] == null){
      this._isSafeAccess = false;
      return null;
    }

    return this._isSafeAccess ? obj[key] : null;
  }

  // PrefixNot
  visitPrefixNot(ast: PrefixNot, context: any) {
    const value = this.visit(ast.expression, context);
    return !value;
  }

  // visit
  visit(ast: AST, context?: any) {
    return ast.visit(this, context)
  }

  // Pipe
  visitPipe(ast: BindingPipe, context: any) {
    throw new Error("Method not implemented.");
  }

  // NonNullAssert
  visitNonNullAssert(ast: NonNullAssert, context: any) {
    const value: any = this.visit(ast.expression, context);

    if (value == null) {
      let name: string = "{}";
      if (ast.expression instanceof SafePropertyRead || ast.expression instanceof PropertyRead || ast.expression instanceof PropertyWrite) {
        name = ast.expression.name;
      }

      throw new TypeError(`Property '${name}' does not exist`);
    }

    return value
  }

  // PropertyWrite
  visitPropertyWrite(ast: PropertyWrite, context: any) {
    throw new Error("Method not implemented.");
  }

  // ASTWithSource
  visitASTWithSource?(ast: ASTWithSource, context: any) {
    throw new Error("Method not implemented.");
  }

  visitUnary?(ast: Unary, context: any) {
    throw new Error('Method not implemented.');
  }

  visitThisReceiver?(ast: ThisReceiver, context: any) {
    throw new Error('Method not implemented.');
  }

  // KeyedWrite
  visitKeyedWrite(ast: KeyedWrite, context: any) {
    throw new Error("Method not implemented.");
  }

  // Chain
  visitChain(ast: Chain, context: any) {
    throw new Error("Method not implemented.");
  }
}
