import { Injectable } from '@angular/core';
import {
  Parser,
  Lexer,
  ASTWithSource,
  InterpolationConfig,
  DEFAULT_INTERPOLATION_CONFIG,
  Interpolation,
  AST,
} from '@angular/compiler';
import { NgxInterpolationVisitor } from './ngx-interpolation.visitor';

@Injectable({
  providedIn: 'root',
})
export class NgxInterpolation {
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
   * @throws Array of error when expression is invalid.
   */
  interpolate(
    input: string,
    context?: any,
    interpolationConfig?: InterpolationConfig | undefined | null
  ): string {
    if (interpolationConfig == null) {
      interpolationConfig = DEFAULT_INTERPOLATION_CONFIG;
    }
    let interpolatedString: string;
    const astWithSource: ASTWithSource | null = this._parser.parseInterpolation(
      input,
      context,
      0,
      null,
      interpolationConfig
    );

    if (!astWithSource) return input;

    if (astWithSource.errors.length) {
      throw astWithSource.errors;
    } else {
      interpolatedString = this.#resolve(
        astWithSource.ast.visit(new NgxInterpolationVisitor()),
        context
      );
    }

    return interpolatedString;
  }

  #resolve(interpolation: Interpolation, context: any): string {
    const strings: Array<string> = interpolation.strings;
    const expressions: Array<AST> = interpolation.expressions;
    const parts: Array<any> = new Array();

    for (let i = 0; i < strings.length; i++) {
      const str = strings[i];

      if (!this.#isNullOrUndefined(str) && str !== '') {
        parts.push(str);
      }

      const expression = expressions[i];
      if (expression) {
        parts.push(expression.visit(new NgxInterpolationVisitor(), context));
      }
    }

    return parts.join('');
  }

  #isNullOrUndefined(value: any): boolean {
    return value === null || value === undefined || value === 'undefined';
  }
}
