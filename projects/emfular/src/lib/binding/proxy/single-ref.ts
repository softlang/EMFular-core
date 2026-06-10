import {DeletionMode} from "../../utils/deletion-mode";
import {ReferenceMeta} from "../model-definition";
import {Kind, KindFromMeta} from "./reference-kind";


export type SingleRefFromMeta<
    T,
    R extends Kind
> = SingleRef<T, R>

export interface SingleRef<T, K extends Kind> {
    readonly __kind?: K;   // phantom field

    get value(): T | undefined;
    assign(value: T | undefined): boolean;
    remove(item: T): boolean;
    removeCascade(item: T): boolean;
    delete(mode?: DeletionMode): void;
}