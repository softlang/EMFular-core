import {Deserializer} from "./deserializer";
import {Referencable} from "../referencing/referencable/referenceable";

export type ConstructorPointer = ($ref:string) => (p: Deserializer) => Referencable;
export type ConstructorPointerFor<T extends Referencable> = ($ref:string) => (p: Deserializer) => T;

export type ConstructorPointers = Map<string, ConstructorPointer>;

