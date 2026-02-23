type OmitKeys<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

type ForbiddenArrayMethods =
    | "copyWithin"
    | "fill"
    | "sort"
    | "reverse"
    | "unshift"  // unnecessary and complicated to do

export interface ModelList<T>
    extends OmitKeys<Array<T>, ForbiddenArrayMethods> {
    //additional operations
    move(from: number, to: number): void;
    swap(from: number, to: number): void;
    remove(...items: T[]): boolean;
}
