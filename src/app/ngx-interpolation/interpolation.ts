import { Injectable } from '@angular/core';
import { Parser, Lexer, ASTWithSource } from '@angular/compiler';
import { InterpolationVisitor } from './interpolation-visitor';

@Injectable({
  providedIn: 'root'
})
export class Interpolation {

  private _parser: Parser;
  private _interpolationVisitor: InterpolationVisitor;
  
  constructor() {
    this._parser = new Parser(new Lexer());
    this._interpolationVisitor = new InterpolationVisitor();
  }

  interpolate(input: string, context: any): string {
    let result: Array<string> = new Array();
    let astWithSource: ASTWithSource = this._parser.parseInterpolation(input, context, 0);
    
    console.log(astWithSource);
    if(!astWithSource)
      return null;
    
    // if(astWithSource.errors.length)
    //   throw astWithSource.errors;
    // else {
    //   result = this._resolve(astWithSource.ast.visit(this._interpolationVisitor), context);
    // }

    return result.join('');
  }

  private _resolve(interpolation: import('@angular/compiler').Interpolation, context: any): Array<string> {
    const strings: Array<string> = interpolation.strings;
    const expressions: Array<any> = interpolation.expressions;
    let parts: Array<string> = new Array();

    for (let i = 0; i < strings.length; i++) {
      let str = strings[i];
      
      if(str.length > 0) {
        parts.push(str);
      }

      if(i < expressions.length) {
        let result: string = expressions[i].visit(this._interpolationVisitor, context);
        if(result != null && result != undefined && result != 'undefined')
          parts.push(result);
      }
    }

    return parts;
  }
}
