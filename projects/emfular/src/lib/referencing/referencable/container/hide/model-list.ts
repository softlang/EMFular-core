export type ForbiddenArrayMethods =
    | "copyWithin"
    | "fill"
    | "sort"
    | "reverse"
    | "unshift";

export type RefKind = "tree" | "link" | "parent";

export type SingleRef<T, Kind extends RefKind> = T | undefined;

export type ModelList<T> = MetaAwareModelList<T, any>;

export interface MetaAwareModelList<T, Kind extends RefKind>
    extends Array<T> {

    /** @deprecated Direct index assignment is not supported. Use push()+move  or swap(). */
    [index: number]: T;

    move(from: number, to: number): void;
    swap(from: number, to: number): void;
    remove(...items: T[]): boolean;
    delete(): void;

    readonly __item: T;
    readonly __kind: Kind;
}
