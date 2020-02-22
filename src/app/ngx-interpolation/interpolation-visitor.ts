import { 
  // Discovered
  AstVisitor,
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

  // Undiscovered
  Chain,
  FunctionCall,
  KeyedWrite,
  BindingPipe,
  PrefixNot,
  NonNullAssert,
  PropertyWrite,
  Quote,

  AST
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
      ast.receiver.visit(this, context);
    }
    this._context = this._context[ast.name];
    
    if(this._targetAst == ast){
      this._targetAst = null;
      return this._context;
    }

    return null;
  }

  visitMethodCall(ast: MethodCall, context: any) {
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
    throw new Error("Method not implemented.");
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
}
