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

  // Undiscovered
  Chain,
  FunctionCall,
  PrefixNot,
  NonNullAssert,
  KeyedWrite,
  PropertyWrite,
  Quote
} from '@angular/compiler';

export class InterpolationVisitor implements AstVisitor {

  private _targetAst: AST;
  private _context: any;

  visitInterpolation(ast: Interpolation, context: any) {
    console.log(ast);
    return ast;
  }

  visitPropertyRead(ast: PropertyRead, context: any) {
    if(this._targetAst == null){
      this._targetAst = ast;
      this._context = context;
    }
    
    if(!(ast.receiver instanceof ImplicitReceiver)) {
      this._context = ast.receiver.visit(this, context);
    }
    if(ast.receiver instanceof ImplicitReceiver && this.isKeyExist(context, ast.name) === false){
      throw `Can not find property '${ast.name}' in the context`;
    }
    if(!(ast.receiver instanceof ImplicitReceiver) && this.isKeyExist(this._context, ast.name) === false){
      throw `Can not find property '${ast.name}'`;
    }
    
    if(this._targetAst == ast) this._targetAst = null;
    
    return this._context[ast.name];
  }

  visitMethodCall(ast: MethodCall, context: any) {
    let args: Array<any> = new Array();
    let argsLength: number = ast.args.length;
    
    for (let i = 0; i < argsLength; i++) {
      args.push(ast.args[i].visit(this, context));
    }

    if(!(ast.receiver instanceof ImplicitReceiver)) {
      ast.receiver.visit(this, context);
    }

    console.log(args);
    console.log(ast);
  }

  visitBinary(ast: Binary, context: any) {
    throw new Error("Method not implemented.");
  }
  visitChain(ast: Chain, context: any) {
    throw new Error("Method not implemented.");
  }
  visitConditional(ast: Conditional, context: any) {
    throw new Error("Method not implemented.");
  }
  visitFunctionCall(ast: FunctionCall, context: any) {
    throw new Error("Method not implemented.");
  }
  visitImplicitReceiver(ast: ImplicitReceiver, context: any) {
    throw new Error("Method not implemented.");
  }
  visitKeyedRead(ast: KeyedRead, context: any) {
    throw new Error("Method not implemented.");
  }
  visitKeyedWrite(ast: KeyedWrite, context: any) {
    throw new Error("Method not implemented.");
  }
  visitLiteralArray(ast: LiteralArray, context: any) {
    throw new Error("Method not implemented.");
  }
  visitLiteralMap(ast: LiteralMap, context: any) {
    throw new Error("Method not implemented.");
  }
  
  visitLiteralPrimitive(ast: LiteralPrimitive, context: any) {
    return ast.value;
  }

  visitPipe(ast: BindingPipe, context: any) {
    throw new Error("Method not implemented.");
  }
  visitPrefixNot(ast: PrefixNot, context: any) {
    throw new Error("Method not implemented.");
  }
  visitNonNullAssert(ast: NonNullAssert, context: any) {
    throw new Error("Method not implemented.");
  }
  visitPropertyWrite(ast: PropertyWrite, context: any) {
    throw new Error("Method not implemented.");
  }
  visitQuote(ast: Quote, context: any) {
    throw new Error("Method not implemented.");
  }
  visitSafeMethodCall(ast: SafeMethodCall, context: any) {
    throw new Error("Method not implemented.");
  }
  visitSafePropertyRead(ast: SafePropertyRead, context: any) {
    throw new Error("Method not implemented.");
  }
  visitASTWithSource?(ast: ASTWithSource, context: any) {
    throw new Error("Method not implemented.");
  }
  visit?(ast: AST, context?: any) {
    throw new Error("Method not implemented.");
  }

  /**
   * Check if a key exists in an object or not.
   * @param obj where to look for the keys.
   * @param key to look for.
   */
  isKeyExist(obj: any, key: string): boolean {
    return Object.keys(obj).includes(key);
  }
}
