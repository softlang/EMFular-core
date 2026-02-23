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

export interface ModelList<
    T, Kind extends RefKind = "link"
>
    extends OmitKeys<Array<T>, ForbiddenArrayMethods> {
    //additional operations
    move(from: number, to: number): void;
    swap(from: number, to: number): void;
    remove(...items: T[]): boolean;
}

export type TreeList<T> = ModelList<T, "tree">;
export type LinkList<T> = ModelList<T, "link">;
export type ParentRef<T> = SingleRef<T, "parent">;