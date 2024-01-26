class Func<T, R> {
  constructor(private fn: (arg: T) => R) {}

  ["|>"]<U>(otherFnOrConst: ((arg: R) => U) | Func<R, U>): Func<T, U> {
    const otherFn =
      typeof otherFnOrConst === "function"
        ? otherFnOrConst
        : otherFnOrConst.getFn();

    return new Func((a) => otherFn(this.fn(a)));
  }

  public getFn() {
    return this.fn;
  }
}

const $fn = <T, R>(fn: (arg: T) => R) => new Func(fn);

const numToStr = $fn((a: number) => a.toString());

const IOInspect =
  <T>() =>
  (a: T): T => {
    console.log(a);
    return a;
  };

const foo = numToStr["|>"](IOInspect())
  ["|>"](parseFloat)
  ["|>"]((x) => x * 2)
  ["|>"](IOInspect())
  ["|>"]((x) => x * 3)
  ["|>"](IOInspect());

foo.getFn()(2);
