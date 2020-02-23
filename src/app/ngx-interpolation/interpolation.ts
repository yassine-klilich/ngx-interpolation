import { Injectable, isDevMode } from '@angular/core';
import { Parser, Lexer, ASTWithSource, InterpolationConfig, DEFAULT_INTERPOLATION_CONFIG } from '@angular/compiler';
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

  /** 
   * String interpolation
   * @param input The string input to be interpolated.
   * @param context Context to witch variables in the string input are resolved against.
   * @param interpolationConfig Overrides the default encapsulation start and end delimiters (`{{` and `}}`).
   * @returns interpolated string value.
   */
  interpolate(input: string, context: any, interpolationConfig: InterpolationConfig = DEFAULT_INTERPOLATION_CONFIG): string {
    let result: string;
    let astWithSource: ASTWithSource = this._parser.parseInterpolation(input, context, 0, interpolationConfig);
    
    if(isDevMode()) console.log(astWithSource);
    
    if(!astWithSource)
      return null;
    
    if(astWithSource.errors.length)
      throw astWithSource.errors;
    else {
      result = this._resolve(astWithSource.ast.visit(this._interpolationVisitor), context);
    }

    return (result === "") ? null : result;
  }

  private _resolve(interpolation: import('@angular/compiler').Interpolation, context: any): string {
    const strings: Array<string> = interpolation.strings;
    const expressions: Array<any> = interpolation.expressions;
    let parts: Array<string> = new Array();

    for (let i = 0; i < strings.length; i++) {
      let str = strings[i];
      
      if(!this._isNullOrUndefined(str)) {
        parts.push(str);
      }

      if(i < expressions.length) {
        let result: string = expressions[i].visit(this._interpolationVisitor, context);
        if(!this._isNullOrUndefined(result))
          parts.push(result);
      }
    }

    return parts.join("");
  }

  private _isNullOrUndefined(value: any): boolean {
    return value === null || value === undefined || value === 'undefined';
  }
}
