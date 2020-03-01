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
  
  // Interpolation
  visitInterpolation(ast: Interpolation, context: any) {
    console.log(ast);
    return ast;
  }

  // PropertyRead
  visitPropertyRead(ast: PropertyRead, context: any) {
    let _context: any = context;
    
    if(!(ast.receiver instanceof ImplicitReceiver)) {
      _context = this._visit(ast.receiver, context);
    }
    
    return _context[ast.name];
  }
  
  // MethodCall
  visitMethodCall(ast: MethodCall, context: any) {
    const methodArgs: Array<any> = this._visitAll(ast.args, context);
    let _context: any = context;
    
    if(!(ast.receiver instanceof ImplicitReceiver)) {
      _context = this._visit(ast.receiver, context);
    }
    if(typeof _context[ast.name] !== 'function'){
      throw new TypeError(`_ctx.${ast.name} is not a function`);
    }

    return _context[ast.name].apply(_context, methodArgs);
  }
  
  // Binary
  visitBinary(ast: Binary, context: any) {
    throw new Error("Method not implemented.");
  }
  
  // Chain
  visitChain(ast: Chain, context: any) {
    throw new Error("Method not implemented.");
  }
  
  // Conditional
  visitConditional(ast: Conditional, context: any) {
    throw new Error("Method not implemented.");
  }
  
  // FunctionCall
  visitFunctionCall(ast: FunctionCall, context: any) {
    console.log(ast);
  }
  
  // ImplicitReceiver
  visitImplicitReceiver(ast: ImplicitReceiver, context: any) {
    throw new Error("Method not implemented.");
  }
  
  // KeyedRead
  visitKeyedRead(ast: KeyedRead, context: any) {
    throw new Error("Method not implemented.");
  }
  
  // KeyedWrite
  visitKeyedWrite(ast: KeyedWrite, context: any) {
    throw new Error("Method not implemented.");
  }
  
  // LiteralArray
  visitLiteralArray(ast: LiteralArray, context: any) {
    throw new Error("Method not implemented.");
  }
  
  // LiteralMap
  visitLiteralMap(ast: LiteralMap, context: any) {
    throw new Error("Method not implemented.");
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
  
  // SafeMethodCall
  visitSafeMethodCall(ast: SafeMethodCall, context: any) {
    throw new Error("Method not implemented.");
  }
  
  // SafePropertyRead
  visitSafePropertyRead(ast: SafePropertyRead, context: any) {
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
    const argsLength: number = asts.length;
    const args: Array<any> = new Array();

    for (let i = 0; i < argsLength; i++) {
      args.push(this._visit(asts[i], context));
    }

    return args;
  }
}
