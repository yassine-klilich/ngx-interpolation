import { TestBed } from '@angular/core/testing';

import { NgxInterpolation } from '../src/lib/ngx-interpolation.service';

describe('NgxInterpolation', () => {
  let service: NgxInterpolation;
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
    },
    prop1: {
      prop2: {
        prop3: {
          prop4: 'Alohaaa !'
        }
      }
    },
    prop01: {
      prop02: {
        prop04: 'Alohaaa !'
      }
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxInterpolation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  fit('should return Hello', () => {
    expect(service.interpolate("Hello", context)).toBe('Hello');
  });

  it('should return 10', () => {
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

    expect(service.interpolate("{{methodCall01()()}}", context)).toBe('10');
  });

  it('should return 20', () => {
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

    expect(service.interpolate("{{methodCall02()()(20)}}", context)).toBe('20');
  });

  it('should return 30', () => {
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

    expect(service.interpolate("{{methodCall01()() + methodCall02()()(20)}}", context)).toBe('30');
  });

  it('should return Alohaaa !', () => {
    let context: any = {
      prop1: {
        prop2: {
          prop3: {
            prop4: 'Alohaaa !'
          }
        }
      }
    }

    expect(service.interpolate("{{prop1?.prop2?.prop3?.prop4}}", context)).toBe('Alohaaa !');
  });

  it('should return empty string', () => {
    let context: any = {
      prop1: {
        prop2: {
          prop4: 'Alohaaa !'
        }
      }
    }

    expect(service.interpolate("{{prop1?.prop2?.prop3?.prop4}}", context)).toBe("");
  });

  it("should throw >> Cannot read property 'prop4' of undefined << error", () => {
    let context: any = {
      prop1: {
        prop2: {
          prop4: 'Alohaaa !'
        }
      }
    }

    expect(()=>{service.interpolate("{{prop1?.prop2?.prop3.prop4}}", context)}).toThrowError("Cannot read property 'prop4' of undefined");
  });

  it("should return John Doe", () => {
    let context = {
      prop1: {
        method: function(param) {
          return param;
        }
      },
      prop2: null
    };

    expect(service.interpolate("{{prop1?.method('John Doe')}}", context)).toBe("John Doe");
  });

  it("should return empty string", () => {
    let context = {
      prop1: {
        method: function(param) {
          return param;
        }
      },
      prop2: null
    };

    expect(service.interpolate("{{prop2?.method('John Doe')}}", context)).toBe("");
  });

  it("should throw >> Cannot read property 'method' of null << error", () => {
    let context = {
      prop1: {
        method: function(param) {
          return param;
        }
      },
      prop2: null
    };

    expect(()=>{service.interpolate("{{prop2.method('John Doe')}}", context)}).toThrowError("Cannot read property 'method' of null");
  });

  it("should return true", () => {
    let context: any = {
      firstName: 'John',
      lastName: 'Debik',
    }

    expect(service.interpolate("{{(firstName === 'John') ? true : false}}", context)).toBe("true");
    expect(service.interpolate("{{firstName === 'John' ? true : false}}", context)).toBe("true");
  });

  it("should return false", () => {
    let context: any = {
      firstName: 'John',
      lastName: 'Debik',
    }

    expect(service.interpolate("{{(lastName === 'Doe') ? true : false}}", context)).toBe("false");
  });

  it("should return John Doe with the configured encapsulation delimiters", () => {
    let context: any = {
      firstName: 'John',
      lastName: 'Doe',
    }

    expect(service.interpolate("%firstName% %lastName%", context, { start: '%', end: '%' })).toBe("John Doe");
  });
});
