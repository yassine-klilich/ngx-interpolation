import { Injectable, isDevMode } from '@angular/core';
import { Parser, Lexer, ASTWithSource, InterpolationConfig, DEFAULT_INTERPOLATION_CONFIG } from '@angular/compiler';
import { InterpolationVisitor } from './interpolation-visitor';

@Injectable({
  providedIn: 'root'
})
export class Interpolation {

  private _parser: Parser;

  constructor() {
    this._parser = new Parser(new Lexer());
  }

  /**
   * String interpolation
   * @param input The string input to be interpolated.
   * @param context Context to witch variables in the string input are resolved against.
   * @param interpolationConfig Overrides the default encapsulation start and end delimiters (`{{` and `}}`).
   * @returns Interpolated string value.
   */
  interpolate(input: string, context: any, interpolationConfig: InterpolationConfig = DEFAULT_INTERPOLATION_CONFIG): string {
    let interpolatedString: string;
    let astWithSource: ASTWithSource = this._parser.parseInterpolation(input, context, 0, interpolationConfig);

    console.log(astWithSource);

    if(!astWithSource)
      return null;

    if(astWithSource.errors.length)
      throw astWithSource.errors;
    else {
      interpolatedString = this._resolve(astWithSource.ast.visit(new InterpolationVisitor()), context);
    }

    return interpolatedString;
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
        let result: string = expressions[i].visit(new InterpolationVisitor(), context);
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
