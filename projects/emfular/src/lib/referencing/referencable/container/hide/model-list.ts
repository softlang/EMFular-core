type OmitKeys<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

type ForbiddenArrayMethods =
    | "copyWithin"
    | "fill"
    | "sort"
    | "reverse"
    | "unshift"  // unnecessary and complicated to do

export type RefKind = "tree" | "link" | "parent";

export type SingleRef<
    T, Kind extends RefKind = "link"
> = T | undefined;

export type ModelList<C> = MetaAwareModelList<C, any>;


export interface MetaAwareModelList<
    T, Kind extends RefKind
>
    extends OmitKeys<Array<T>, ForbiddenArrayMethods> {
    //additional operations
    move(from: number, to: number): void;
    swap(from: number, to: number): void;
    remove(...items: T[]): boolean;

    // internal metadata
    readonly __item: T;
    readonly __kind: Kind;
}
