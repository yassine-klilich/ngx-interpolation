import { TestBed } from '@angular/core/testing';

import { NgxInterpolation } from './ngx-interpolation.service';

describe('NgxInterpolation', () => {
  let service: NgxInterpolation;
  let context: any = {
    methodCall01: () => {
      return () => {
        return 10;
      };
    },
    methodCall02: () => {
      return () => {
        return (number: any) => {
          return number;
        };
      };
    },
    prop1: {
      prop2: {
        prop3: {
          prop4: 'Alohaaa !',
        },
      },
    },
    prop01: {
      prop02: {
        prop04: 'Alohaaa !',
      },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxInterpolation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return Hello', () => {
    expect(service.interpolate('Hello', context)).toBe('Hello');
  });

  it('should return 10', () => {
    let context: any = {
      methodCall01: () => {
        return () => {
          return 10;
        };
      },
      methodCall02: () => {
        return () => {
          return (number: any) => {
            return number;
          };
        };
      },
    };

    expect(service.interpolate('{{methodCall01()()}}', context)).toBe('10');
  });

  it('should return 20', () => {
    let context: any = {
      methodCall01: () => {
        return () => {
          return 10;
        };
      },
      methodCall02: () => {
        return () => {
          return (number: any) => {
            return number;
          };
        };
      },
    };

    expect(service.interpolate('{{methodCall02()()(20)}}', context)).toBe('20');
  });

  it('should return 30', () => {
    let context: any = {
      methodCall01: () => {
        return () => {
          return 10;
        };
      },
      methodCall02: () => {
        return () => {
          return (number: any) => {
            return number;
          };
        };
      },
    };

    expect(
      service.interpolate(
        '{{methodCall01()() + methodCall02()()(20)}}',
        context
      )
    ).toBe('30');
  });

  it('should return Alohaaa !', () => {
    let context: any = {
      prop1: {
        prop2: {
          prop3: {
            prop4: 'Alohaaa !',
          },
        },
      },
    };

    expect(service.interpolate('{{prop1?.prop2?.prop3?.prop4}}', context)).toBe(
      'Alohaaa !'
    );
  });

  it('should return empty string', () => {
    let context: any = {
      prop1: {
        prop2: {
          prop4: 'Alohaaa !',
        },
      },
    };

    expect(service.interpolate('{{prop1?.prop2?.prop3?.prop4}}', context)).toBe(
      ''
    );
  });

  it("should throw >> Cannot read property 'prop4' of undefined << error", () => {
    let context: any = {
      prop1: {
        prop2: {
          prop4: 'Alohaaa !',
        },
      },
    };

    expect(() => {
      service.interpolate('{{prop1?.prop2?.prop3.prop4}}', context);
    }).toThrowError("Cannot read properties of undefined (reading 'prop4')");
  });

  it('should return John Doe', () => {
    let context = {
      prop1: {
        method: function (param: any) {
          return param;
        },
      },
      prop2: null,
    };

    expect(service.interpolate("{{prop1?.method('John Doe')}}", context)).toBe(
      'John Doe'
    );
  });

  it('should return empty string', () => {
    let context = {
      prop1: {
        method: function (param: any) {
          return param;
        },
      },
      prop2: null,
    };

    expect(service.interpolate("{{prop2?.method('John Doe')}}", context)).toBe(
      ''
    );
  });

  it("should throw >> Cannot read properties of null (reading 'method') << error", () => {
    let context = {
      prop1: {
        method: function (param: any) {
          return param;
        },
      },
      prop2: null,
    };

    expect(() => {
      service.interpolate("{{prop2.method('John Doe')}}", context);
    }).toThrowError("Cannot read properties of null (reading 'method')");
  });

  it('should return John Doe', () => {
    let context = {
      prop1: {
        method: function (param: any) {
          return param;
        },
      },
      prop2: null,
    };

    expect(service.interpolate("{{prop1.method('John Doe')}}", context)).toBe(
      'John Doe'
    );
  });

  it('should return true', () => {
    let context: any = {
      firstName: 'John',
      lastName: 'Debik',
    };

    expect(
      service.interpolate("{{(firstName === 'John') ? true : false}}", context)
    ).toBe('true');
    expect(
      service.interpolate("{{firstName === 'John' ? true : false}}", context)
    ).toBe('true');
  });

  it('should return false', () => {
    let context: any = {
      firstName: 'John',
      lastName: 'Debik',
    };

    expect(
      service.interpolate("{{(lastName === 'Doe') ? true : false}}", context)
    ).toBe('false');
  });

  it('should return John Doe with the configured encapsulation delimiters', () => {
    let context: any = {
      firstName: 'John',
      lastName: 'Doe',
    };

    expect(
      service.interpolate('%firstName% %lastName%', context, {
        start: '%',
        end: '%',
      })
    ).toBe('John Doe');
  });

  it('should return (Alohaaa !)', () => {
    let context: any = {
      prop1: {
        prop2: {
          prop3: 'Alohaaa !',
        },
      },
    };

    expect(service.interpolate("{{prop1?.prop2?.['prop3']}}", context)).toBe(
      'Alohaaa !'
    );
  });

  it('should return (1,2.6,3)', () => {
    expect(service.interpolate('{{[1, 2.6, 3]}}', context)).toBe('1,2.6,3');
  });

  it('should return (true,12,Alohaaa !,Morocco,1.5)', () => {
    expect(
      service.interpolate("{{[true, 12, 'Alohaaa !', ['Morocco', 1.5]]}}")
    ).toBe('true,12,Alohaaa !,Morocco,1.5');
  });

  it('should return (100)', () => {
    expect(service.interpolate('{{100}}')).toBe('100');
  });

  it('should return (true)', () => {
    expect(service.interpolate('{{true}}')).toBe('true');
  });

  it('should return (100)', () => {
    expect(service.interpolate('{{({key: 100}).key}}')).toBe('100');
  });

  it('should return ([object Object])', () => {
    expect(service.interpolate('{{({key: 100})}}')).toBe('[object Object]');
  });

  it('should calculate', () => {
    expect(service.interpolate('{{1 + 2 * 3}}')).toBe('7');
    expect(service.interpolate('{{(1 + 2) * 3}}')).toBe('9');
    expect(service.interpolate("{{3 + 4 + '5'}}")).toBe('75');
  });

  it('should return (John is the husband of Maria Doe)', () => {
    const context: any = {
      firstName: 'John',
      lastName: 'Doe',
      wife: {
        fullName: 'Maria Doe',
      },
    };

    expect(
      service.interpolate(
        "{{firstName}} is the husband of {{wife['fullName']}}",
        context
      )
    ).toBe('John is the husband of Maria Doe');
  });

  it(`should return (Hello! my name is John Doe, I'm from Morocco)`, () => {
    const context: any = {
      firstName: 'John',
      lastName: 'Doe',
      getFullName: function () {
        return `${this.firstName} ${this.lastName}`;
      },
      country: (country: string) => {
        return country;
      },
    };

    expect(
      service.interpolate(
        "Hello! my name is {{getFullName()}}, I'm from {{country('Morocco')}}",
        context
      )
    ).toBe("Hello! my name is John Doe, I'm from Morocco");
  });

  it(`should return (Hello! my name is John Doe, I'm from Morocco)`, () => {
    let context: any = {
      prop1: {
        method: function (param: any) {
          return param;
        },
      },
      prop2: null,
    };

    expect(service.interpolate("{{prop1?.method('John Doe')}}", context)).toBe(
      'John Doe'
    );
    expect(service.interpolate("{{prop2?.method('John Doe')}}", context)).toBe(
      ''
    );
  });

  it(`should return (dummy value)`, () => {
    const context = {
      func: (ccc: string) => {
        return ccc;
      },
    };
    expect(service.interpolate("{{func?.('dummy value')}}", context)).toBe(
      'dummy value'
    );
  });

  it(`should return empty string`, () => {
    const context = {};
    expect(
      service.interpolate("{{someNonExistentMethod?.('dummy value')}}", context)
    ).toBe('');
  });

  it(`should return (dummy value)`, () => {
    const context = {
      arr: ['dummy value'],
    };
    expect(service.interpolate('{{arr[0]}}', context)).toBe('dummy value');
  });

  it(`should return empty string`, () => {
    const context = {
      arr: ['dummy value'],
    };
    expect(service.interpolate('{{arr[6]}}', context)).toBe('');
  });

  it(`should return (dummy value)`, () => {
    const context = {
      arr: ['dummy value'],
    };
    expect(service.interpolate('{{arr?.[0]}}', context)).toBe('dummy value');
  });

  it(`should return (dummy value)`, () => {
    const context = {};
    expect(service.interpolate('{{arr?.[0]}}', context)).toBe('');
  });

  it(`should return (true)`, () => {
    expect(service.interpolate('{{!false}}')).toBe('true');
  });

  it(`should return (false)`, () => {
    expect(service.interpolate('{{1 == 30}}')).toBe('false');
  });

  it(`should return (true)`, () => {
    expect(service.interpolate('{{!(1 == 30)}}')).toBe('true');
  });

  it(`should return (false)`, () => {
    expect(service.interpolate('{{!!(1 == 30)}}')).toBe('false');
  });

  it(`should return (20)`, () => {
    expect(service.interpolate("{{'' || 20}}")).toBe('20');
  });

  it(`should return (Hello)`, () => {
    expect(service.interpolate("{{'Hello' || 20}}")).toBe('Hello');
  });

  it(`should return (20)`, () => {
    expect(service.interpolate("{{'Hello' && 20}}")).toBe('20');
  });

  it(`should return (false)`, () => {
    expect(service.interpolate('{{!10 && 20}}')).toBe('false');
  });

  it(`should return (10,20,30)`, () => {
    const context: any = {
      arr: [[10, 20, 30]],
    };
    expect(service.interpolate('{{arr[0]}}', context)).toBe('10,20,30');
  });

  it(`should interpolate SafeKeyedRead`, () => {
    let context: any = {
      prop1: {
        prop2: {
          prop3: 'Salam Alikoum!',
        },
      },
      prop5: {
        prop6: {
          prop00008: 'Alohaaa !',
        },
      },
    };

    expect(service.interpolate("{{prop1?.prop2?.['prop3']}}", context)).toBe(
      'Salam Alikoum!'
    );
    expect(
      service.interpolate("{{prop5?.prop6?.['prop7'].prop8}}", context)
    ).toBe('');
  });

  it('NonNullAssert: Must return Hello', () => {
    let context: any = {
      prop: {
        prop: 'Hello',
      },
    };

    expect(service.interpolate('{{prop!.prop}}', context)).toBe('Hello');
  });

  it('NonNullAssert: Must throw an error prop is not defined', () => {
    let context: any = {};

    expect(() => {
      service.interpolate('{{prop!}}', context);
    }).toThrowError(`Property 'prop' does not exist`);
  });

  it('visitTypeofExpresion: Must return string', () => {
    expect(service.interpolate('{{ typeof "Hello" }}')).toBe('string');
  });

  it('visitTypeofExpresion: Must return function', () => {
    const result = service.interpolate('{{ typeof foo }}', { foo: () => {} });
    expect(result).toBe('function');
  });

  it('visitTypeofExpresion: Must return object', () => {
    const result = service.interpolate('{{ typeof obj }}', { obj: {} });
    expect(result).toBe('object');
  });

  it('visitTypeofExpresion: Must return object', () => {
    const result = service.interpolate('{{ typeof null }}');
    expect(result).toBe('object');
  });

  it('visitTypeofExpresion: Must return undefined', () => {
    const result = service.interpolate('{{ typeof undefined }}');
    expect(result).toBe('undefined');
  });
});
