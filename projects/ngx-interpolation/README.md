# Ngx-Interpolation

[![Generic badge](https://img.shields.io/badge/npm%20package-v0.0.7-3FB911.svg)](https://www.npmjs.com/package/ngx-interpolation)

Ngx-Interpolation is an Angular lightweight library to interprate string interpolation expressions.

Ngx-Interpolation uses Angular string interpolation parser to parse your expressions.

# Table of content

- [Supported Interpolation Expressions](#support)
- [Installation](#installation)
- [How to use](#how-to-use)
  - [Import NgxInterpolation class](#import)
  - [Interpolation Expressions](#interpolation-expression)
    - [Literal Primitive](#literalprimitive)
    - [Literal Array](#literalarray)
    - [Literal Map](#literalmap)
    - [Binary](#binary)
    - [Property Read](#propertyread)
    - [Keyed Read](#keyedread)
    - [Method Call](#methodcall)
    - [Function Call](#functioncall)
    - [Safe Property Read](#safepropertyread)
    - [Safe Method Call](#safemethodcall)
    - [Conditional](#conditional)
  - [Custom encapsulation delimiters](#delimiters)

# [Supported Interpolation Expressions](#support)

|Expression name     |Expression syntax                    |
|--------------------|-------------------------------------|
|Literal Primitive   | 'string, number or boolean values'  |
|Literal Array       | [1, 'Hello', ['bye'], true]         |
|Literal Map         | ({key: 'value'})                    |
|Binary              | 1 + 1 * 2                           |
|Property Read       | prop                                |
|Keyed Read          | obj['key']                          |
|Method Call         | method()                            |
|Function Call       | method()()                          |
|Safe Property Read  | obj?.prop                           |
|Safe Method Call    | obj?.method()                       |
|Conditional         | (expression) ? true : false         |

# [Installation](#installation)

Install Ngx-Interpolation library from the npm command :
```
npm install ngx-interpolation
```

:warning: Currently the Ngx-Interpolation built with Angular 9. Please submit an issue if you encounted any versioning issue.

# [How to use](#how-to-use)

## [Import NgxInterpolation class](#import)

```typescript
import { NgxInterpolation } from 'ngx-interpolation';
```

## [Interpolation Expressions](#interpolation-expressions)
  
  - ### [Literal Primitive](#literalprimitive)
  
  Literal Primitive expressions are the string, number and boolean values.

  Examples :
  ```typescript
  let interpolation: NgxInterpolation = new NgxInterpolation();

  interpolation.interpolate("{{'Hello world !'}}"); // => Hello world !
  interpolation.interpolate("{{100}}"); // => 100
  interpolation.interpolate("{{true}}"); // => true
  ```

  - ### [Literal Array](#literalarray)
  
  Literal Array expression is simply an array.

  Examples :
  ```typescript
  let interpolation: NgxInterpolation = new NgxInterpolation();

  interpolation.interpolate("{{[1, 2.6, 3]}}"); // => 1,2.6,3
  interpolation.interpolate("{{[true, 12, 'Alohaaa !', ['Morocco', 1.5]]}}"); // => true,12,Alohaaa !,Morocco,1.5
  ```

  - ### [Literal Map](#literalmap)
  
  Literal Map expression is the object defined in the string interpolation expression.

  Examples :
  ```typescript
  let interpolation: NgxInterpolation = new NgxInterpolation();

  interpolation.interpolate("{{({key: 100})}}"); // => [object Object]
  interpolation.interpolate("{{({key: 100}).key}}"); // => 100
  ```
  
  - ### [Binary](#binary)

  Binary expression is the Javascript arithmetic operators addition(+), subtraction(-), multiplication(*), and division(/).
  
  Except the expressions that promote side effects, including:

  - Assignments (=, +=, -=, ...)
  - Operators such as new, typeof, instanceof, etc.
  - Chaining expressions with ; or ,
  - The increment and decrement operators ++ and --
  - Some of the ES2015+ operators

  Examples :
  ```typescript
  let interpolation: NgxInterpolation = new NgxInterpolation();

  interpolation.interpolate("{{1 + 2 * 3}}"); // => 7
  interpolation.interpolate("{{(1 + 2) * 3}}"); // => 9
  interpolation.interpolate("{{3 + 4 + '5'}}"); // => 75
  ```
   
  - ### [Property Read](#propertyread)
  
  Property Read expression is the property defined in a context given at the second parameter of the interpolate() method.

  Examples :
  ```typescript
  let interpolation: NgxInterpolation = new NgxInterpolation();
  let context: any = {
    firstName: 'John',
    lastName: 'Doe',
    wife: {
      fullName: 'Maria Doe'
    }
  }  

  interpolation.interpolate("Husband: {{firstName}} {{lastName}}", context); // => Husband: John Doe
  interpolation.interpolate("Husband: {{firstName + lastName}}", context); // => Husband: JohnDoe
  interpolation.interpolate("{{firstName}} is the husband of {{wife.fullName}}", context); // => John is the husband of Maria Doe
  ```
  
  - ### [Keyed Read](#keyedread)
  
  Keyed Read expression is when you read a property from an object via the square brackets.

  Examples :
  ```typescript
  let interpolation: NgxInterpolation = new NgxInterpolation();
  let context: any = {
    firstName: 'John',
    lastName: 'Doe',
    wife: {
      fullName: 'Maria Doe'
    }
  }

  interpolation.interpolate("{{firstName}} is the husband of {{wife['fullName']}}", context); // => John is the husband of Maria Doe
  ```
  
  - ### [Method Call](#methodcall)
  
  Method Call expression is when you call a method from a context given.

  Examples :
  ```typescript
  let interpolation: NgxInterpolation = new NgxInterpolation();
  let context: any = {
    firstName: 'John',
    lastName: 'Doe',
    getFullName: function() {
      return `${this.firstName} ${this.lastName}`;
    },
    country: (country)=>{
      return country;
    }
  }
  
  interpolation.interpolate("Hello! my name is {{getFullName()}}, I'm from {{country('Morocco')}}", context); // => Hello! my name is John Doe, I'm from Morocco
  ```
  
  - ### [Function Call](#functioncall)
  
  Function Call expression is call function.

  Examples :
  ```typescript
  let interpolation: NgxInterpolation = new NgxInterpolation();
  let context: any = {
    methodCall01: ()=>{
      return ()=>{
        return 10;
      }
    },
    methodCall02: ()=>{
      return ()=>{
        return (number)=>{
          return number;
        }
      }
    }
  }
  
  interpolation.interpolate("{{methodCall01()()}}", context); // => 10
  interpolation.interpolate("{{methodCall01()() + methodCall02()()(20)}}", context); // => 30
  ```
  
  - ### [Safe Property Read](#safepropertyread)
  
  Safe Property Read expression

  Examples :
  ```typescript
  let interpolation: NgxInterpolation = new NgxInterpolation();
  let context: any = {
    prop1: {
      prop2: {
        prop3: {
          prop4: 'Alohaaa !'
        }
      }
    },
    prop5: {
      prop6: {
        prop08: 'Alohaaa !'
      }
    }
  }
  
  interpolation.interpolate("{{prop1?.prop2?.prop3?.prop4}}", context); // => Alohaaa !
  interpolation.interpolate("{{prop5?.prop6?.prop7.prop8}}", context); // => <RETURNS AN EMPTY STRING>
  ```
  
  - ### [Safe Method Call](#safemethodcall)
  
  Safe Method Call expression

  Examples :
  ```typescript
  let interpolation: NgxInterpolation = new NgxInterpolation();
  let context: any = {
    prop1: {
      method: function(param) {
        return param;
      }
    },
    prop2: null
  }
  
  interpolation.interpolate("{{prop1?.method('John Doe')}}", context); // => John Doe
  interpolation.interpolate("{{prop2?.method('John Doe')}}", context); // => <RETURNS AN EMPTY STRING>
  ```
  
  - ### [Conditional](#conditional)
  
  Conditional expression is the ternary condition syntax

  Examples :
  ```typescript
  let interpolation: NgxInterpolation = new NgxInterpolation();
  let context: any = {
    firstName: 'John',
    lastName: 'Debik',
  }
  
  interpolation.interpolate("{{(firstName === 'John') ? true : false}}", context); // => true
  interpolation.interpolate("{{(lastName === 'Doe') ? true : false}}", context); // => false
  ```

## [Custom encapsulation delimiters](#delimiters)

There is an optional parametter in the interpolate() method to set your prefered encapsulation delimiters.

Examples :
```typescript
let interpolation: NgxInterpolation = new NgxInterpolation();
let context: any = {
  firstName: 'John',
  lastName: 'Doe',
}
let interpolationConfig = {
  start: '%',
  end: '%'
}

interpolation.interpolate("%firstName% %lastName%", context, interpolationConfig); // => John Doe
```

# License

Licensed under the [MIT License](LICENSE).