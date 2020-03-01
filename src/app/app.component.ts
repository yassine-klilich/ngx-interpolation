import { Component } from '@angular/core';
import { Interpolation } from './ngx-interpolation/interpolation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent { 
  
  constructor(private _interpolation: Interpolation) {

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

    // 
    // let input: string = "I'm {{fullName.name}} from {{getCountry(fullName.lastName)}}";
    // let input: string = "I'm {{fullName.toString()}} from {{getCountry(fullName.name, 'Morocco')}}";
    let input: string = "This is {{prop1.prop2.prop3}}";
    
    let context: any = {
      prop1: {
        prop2: {
          prop3: 'prop_3'
        },
        toString: function() { return `${this.prop2.prop3}` }
      },
      propNum: 10,
      method_1: (param) => param
    };

    let result = this._interpolation.interpolate(input, context);

    console.log(result);
  }

}
