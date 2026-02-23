type OmitKeys<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

type ForbiddenArrayMethods =
    | "copyWithin"
    | "fill"
    | "sort"
    | "reverse"
    | "splice"   // optional — if you want to force users to use move()
    | "shift"    // optional
    | "unshift"  // optional
    | "pop"      // optional
    | "push";    // optional



export interface ModelList<T>
    extends OmitKeys<Array<T>, ForbiddenArrayMethods> {
    //additional operations
    move(from: number, to: number): void;
    swap(from: number, to: number): void;
}
