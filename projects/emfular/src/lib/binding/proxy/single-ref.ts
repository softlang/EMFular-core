import {DeletionMode} from "../../utils/deletion-mode";
import {ReferenceMeta} from "../model-definition";
import {Kind, KindFromMeta} from "./reference-typing";

export type SingleRef<T, K extends Kind> = (T | undefined) & {readonly __kind?: K};

export type SingleRef2FromMeta<
    T,
    R extends ReferenceMeta
> = SingleRef2<T, KindFromMeta<R>>

export interface SingleRef2<T, K extends Kind> {
    readonly __kind?: K;   // phantom field

    readonly value: T | undefined;
    remove(item: T): boolean;
    removeCascade(item: T): boolean;
    delete(mode?: DeletionMode): void;
}