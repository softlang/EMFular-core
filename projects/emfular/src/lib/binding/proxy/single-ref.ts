import {DeletionMode} from "../../utils/deletion-mode";
import {ReferenceMeta} from "../model-definition";
import {Kind, KindFromMeta} from "./reference-kind";

export type SingleRef<T, K extends Kind> =
    T & {
    readonly __kind: K;

    $_assign(item: T): boolean; //add
    $_remove(item: T): boolean;
    $_removeCascade(item: T): boolean;
    $_delete(mode?: DeletionMode): void;
};

export type SingleRefFromMeta<
    T,
    R extends ReferenceMeta
> = SingleRef<T, KindFromMeta<R>>

export interface SingleRef2<T, K extends Kind> {
    readonly __kind?: K;   // phantom field

    readonly value: T | undefined;
    remove(item: T): boolean;
    removeCascade(item: T): boolean;
    delete(mode?: DeletionMode): void;
}