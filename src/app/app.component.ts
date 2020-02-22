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
    
    // 
    let input: string = "I'm {{dd}}";
    
    let value: any = {
      fullName: { name: 'Yassine', lastName: 'Klilich', toString: function() { return `${this.name} ${this.lastName}` } },
      age: 23,
      getCountry: (country) => country
    };

    let result = this._interpolation.interpolate(input, value);

    console.log(result);
  }

}
