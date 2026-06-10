import {DeletionMode} from "../../utils/deletion-mode";
import {Kind} from "./reference-kind";

export interface SingleRef<T, K extends Kind> {
    readonly __kind?: K;   // phantom field

    get value(): T | undefined;
    assign(value: T | undefined): boolean;
    remove(item: T): boolean;
    removeCascade(item: T): boolean;
    delete(mode?: DeletionMode): void;
}