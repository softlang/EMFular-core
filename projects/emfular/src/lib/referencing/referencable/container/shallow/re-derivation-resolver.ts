export class ReDerivationResolver<P, R> {
    private computeFn?: (owner: P) => R;
    readonly derivingSymbol?: symbol;

    constructor(computeOrSymbol: ((owner: P) => R) | symbol) {
        if (typeof computeOrSymbol === "function") {
            this.computeFn = computeOrSymbol;
        } else {
            this.derivingSymbol = computeOrSymbol;
        }
    }

    resolve(parent: P): R {
        if (!this.computeFn) {
            if (!this.derivingSymbol) {
                throw new Error("No derivation logic defined.");
            }

            const fn = Reflect.get(parent as any, this.derivingSymbol);
            if (typeof fn !== "function") {
                throw new Error("Derived method not found on instance.");
            }
            this.computeFn = fn.bind(parent);
        }
        return this.computeFn!(parent);
    }
}
