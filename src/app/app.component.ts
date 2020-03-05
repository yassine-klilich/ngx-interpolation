import { Component } from '@angular/core';
import { Interpolation } from './ngx-interpolation/interpolation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent { 

  constructor(private _interpolation: Interpolation) {

    ////------------------- Some Test Cases That I need to support for my library -------------------\\\\
    
    // let input: string = "This is {{prop4}}"; // ==> This is Lorem ipsum
    // let input: string = "This is {{prop1.prop2.prop3}}"; // ==> This is prop_3
    // let input: string = "Lorem ipsum {{method_1('dolor')}} sit amet"; // ==> Lorem ipsum dolor sit amet
    // let input: string = "Lorem ipsum {{method_1(prop4)}} sit amet"; // ==> Lorem ipsum Lorem ipsum sit amet
    // let input: string = "Lorem ipsum {{method_1(prop1)}} sit amet"; // ==> Lorem ipsum prop_3 sit amet
    // let input: string = "Lorem ipsum {{method_1(prop1.prop2.prop3)}} sit amet"; // ==> Lorem ipsum prop_3 sit amet
    // let input: string = "Lorem ipsum {{prop5.method_1_of_prop5()}} sit amet"; // ==> Lorem ipsum Holla sit amet
    // let input: string = "Lorem ipsum {{prop5.method_2_of_prop5().prop}} sit amet"; // ==> Lorem ipsum READ OBJECT'S PROPERTY RETURNED FROM A METHOD sit amet
    // let input: string = "Lorem ipsum {{prop5.method_2_of_prop5().method()}} sit amet"; // ==> Lorem ipsum EXECUTE ME sit amet
    // let input: string = "Lorem ipsum {{prop5.method_3_of_prop5()()}} sit amet"; // ==> Lorem ipsum Hola Primo sit amet
    // let input: string = "Lorem ipsum {{prop5.method_4_of_prop5()()()}} sit amet"; // ==> Lorem ipsum Lorem ipsum sit amet
    // let input: string = "Lorem ipsum {{method_2()().method()}} sit amet"; // ==> Lorem ipsum 456 sit amet
    // let input: string = "{{1 - 2 + '4'}}"; // ==> -14
    // let input: string = "{{1 - 2 + method_2()().method()}}"; // ==> 455
    // let input: string = "{{[1, 2, 3]}}"; // ==> 1,2,3
    let input: string = "{{[1, 2, 3].join('')}}"; // ==> 123

    let context: any = {
      prop1: {
        prop2: {
          prop3: 'prop_3'
        },
        toString: function() { return `${this.prop2.prop3}` }
      },
      prop4: "Lorem ipsum",
      prop5: {
        method_1_of_prop5: () => 'Holla',
        method_2_of_prop5: ()=> ({prop: "READ OBJECT'S PROPERTY RETURNED FROM A METHOD", method: () => 'EXECUTE ME' }),
        method_3_of_prop5: () => {
          return function(){ return 'Hola Primo' }
        },
        method_4_of_prop5: () => {
          return function(){ return function(){ return context.prop4 }; }
        }
      },
      propNum: 10,
      method_1: param => param,
      method_2: ()=>{
        return function(){
          return {
            method: ()=>{
              return 456
            }
          }
        }
      }
    };
    
    let result = this._interpolation.interpolate(input, context);

    // Log The Result
    console.log(`%c${result}`, "color: #24b33b; font-size: 20px;");
  }

}






// Mixed
// let input: string = "I'm {{fullName.name}} from {{getCountry('Morocco')}}";
// let input: string = "I'm {{1 + 1}} from {{getCountry('Morocco')}}";
// let input: string = "I'm {{++age}} from {{getCountry('Morocco')}}";

// LiteralPrimitive
// let input: string = "I'm {{true}}";

// Binary
// let input: string = "1 + 1 - 3";

// Conditional
// let input: string = "{{(fullName.name == 'Yassine') ? true : false}}";

// LiteralArray
// let input: string = "{{[1, 2, 3]}}";

// KeyedRead
// let input: string = "{{fullName['name']}}";

// KeyedRead
// let input: string = "{{fullName['name']}}";

// LiteralMap
// let input: string = "{{({ top: 10 })}}";

// SafePropertyRead
// let input: string = "{{fullName?.name}}";

// SafeMethodCall
// let input: string = "{{fullName?.toString()}}";

// BindingPipe
// let input: string = "I'm {{firstName | pipe}}";

// FunctionCall
// let input: string = "Lorem ipsum {{method_1('dolor')()}} sit amet";


// 
// let input: string = "I'm {{fullName.name}} from {{getCountry(fullName.lastName)}}";
// let input: string = "I'm {{fullName.toString()}} from {{getCountry(fullName.name, 'Morocco')}}";