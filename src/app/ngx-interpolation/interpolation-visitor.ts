import {
  AstVisitor,
  AST,

  // Discovered
  ASTWithSource,
  Interpolation,
  PropertyRead,
  MethodCall,
  Binary,
  LiteralPrimitive,
  LiteralArray,
  Conditional,
  ImplicitReceiver,
  KeyedRead,
  LiteralMap,
  SafePropertyRead,
  SafeMethodCall,
  BindingPipe,
  FunctionCall,

  // Undiscovered
  Chain,
  PrefixNot,
  NonNullAssert,
  KeyedWrite,
  PropertyWrite,
  Quote
} from '@angular/compiler';

export class InterpolationVisitor implements AstVisitor {

	private _isSafeAccess: boolean = true;

  // Interpolation
  visitInterpolation(ast: Interpolation, context: any) {
    console.log(ast);
    return ast;
  }

  // PropertyRead
  visitPropertyRead(ast: PropertyRead, context: any) {
		let _context: any = this._visit(ast.receiver, context);

    return this._isSafeAccess ? _context[ast.name] : null;
  }

  // SafePropertyRead
  visitSafePropertyRead(ast: SafePropertyRead, context: any) {
    let _context: any = this._visit(ast.receiver, context);
		if(_context == null || _context == undefined){
			this._isSafeAccess = false;
			return null;
		}

		return _context[ast.name];
	}

  // MethodCall
  visitMethodCall(ast: MethodCall, context: any) {
    const args: Array<any> = this._visitAll(ast.args, context);
    let _context: any = this._visit(ast.receiver, context);

    if(typeof _context[ast.name] !== 'function'){
      throw new TypeError(`_ctx.${ast.name} is not a function`);
		}

    return _context[ast.name].apply(_context, args);
  }

  // FunctionCall
  visitFunctionCall(ast: FunctionCall, context: any) {
    const args: Array<any> = this._visitAll(ast.args, context);
    let result: any = this._visit(ast.target, context);

    while(typeof result == 'function'){
      result = result.apply(undefined, args);
    }

    return result;
  }

  // SafeMethodCall
  visitSafeMethodCall(ast: SafeMethodCall, context: any) {
    const args: Array<any> = this._visitAll(ast.args, context);
    let _context: any = this._visit(ast.receiver, context);

		if(_context == null || _context == undefined){
			this._isSafeAccess = false;
			return null;
		}
    if(typeof _context[ast.name] !== 'function'){
      throw new TypeError(`_ctx.${ast.name} is not a function`);
		}

    return _context[ast.name].apply(_context, args);
  }

  // Binary
  visitBinary(ast: Binary, context: any) {
		let leftValue: any = this._visit(ast.left, context);
    let rightValue: any = this._visit(ast.right, context);
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

  // Chain
  visitChain(ast: Chain, context: any) {
    throw new Error("Method not implemented.");
  }

  // Conditional
  visitConditional(ast: Conditional, context: any) {
		let conditionResult: boolean = this._visit(ast.condition, context);
    if(conditionResult){
			return this._visit(ast.trueExp, context);
		}else{
			return this._visit(ast.falseExp, context);
		}
  }

  // ImplicitReceiver
  visitImplicitReceiver(ast: ImplicitReceiver, context: any) {
		this._isSafeAccess = true;
		return context;
  }

  // KeyedRead
  visitKeyedRead(ast: KeyedRead, context: any) {
    let obj: any = this._visit(ast.obj, context);
    let key: any = this._visit(ast.key, context);

    return obj[key];
  }

  // KeyedWrite
  visitKeyedWrite(ast: KeyedWrite, context: any) {
    throw new Error("Method not implemented.");
  }

  // LiteralArray
  visitLiteralArray(ast: LiteralArray, context: any) {
    return this._visitAll(ast.expressions, context);
  }

  // LiteralMap
  visitLiteralMap(ast: LiteralMap, context: any) {
		let obj: Object = new Object();
		ast.values.forEach((value: AST, index: number)=>{
			obj[ast.keys[index].key] = this._visit(value, context);
		})

    return obj;
  }

  // LiteralPrimitive
  visitLiteralPrimitive(ast: LiteralPrimitive, context: any) {
    return ast.value;
  }

  // Pipe
  visitPipe(ast: BindingPipe, context: any) {
    throw new Error("Method not implemented.");
  }

  // PrefixNot
  visitPrefixNot(ast: PrefixNot, context: any) {
    throw new Error("Method not implemented.");
  }

  // NonNullAssert
  visitNonNullAssert(ast: NonNullAssert, context: any) {
    throw new Error("Method not implemented.");
  }

  // PropertyWrite
  visitPropertyWrite(ast: PropertyWrite, context: any) {
    throw new Error("Method not implemented.");
  }

  // Quote
  visitQuote(ast: Quote, context: any) {
    throw new Error("Method not implemented.");
  }

  // ASTWithSource
  visitASTWithSource?(ast: ASTWithSource, context: any) {
    throw new Error("Method not implemented.");
  }

  private _visit(ast: AST, context?: any): any {
    return ast.visit(this, context);
  }

  private _visitAll(asts: AST[], context?: any): any {
    return asts.map(ast => this._visit(ast, context));
  }
}
