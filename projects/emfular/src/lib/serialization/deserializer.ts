/*
idea:
  1) create the tree backbone, only following tree relationships
  2) use addRefWithJson to add all created references afterwards
 */
import {Referencable} from "../referencing/referencable/referenceable";
import {RefHandler} from "../referencing/ref/ref-handler";
import {Ref} from "../referencing/ref/ref";
import {JsonOf} from "./json-deserializable";
import {ModelRegistry} from "../binding/model-registry";

export class Deserializer {

  private registry: ModelRegistry

  // all so far parsed objects
  private createdObjects: Map<string, Referencable> = new Map<string, Referencable>();

  constructor(registry: ModelRegistry) {
    this.registry = registry;
  }

  createTreeBackbone<T extends Referencable>(ref: Ref, json: JsonOf<T>): T {
    const entry = this.registry.get<T>(ref.eClass)
    const obj: T = new entry()
    this.put(ref,obj)
    obj.attributesFromJson(json)
    obj.createChildren(this, ref, json)
    return obj
  }

  static getEClass(json: any, defaultStr?: string): (string|undefined) {
    const jsonEclass: (string|undefined) = json['eClass']
    return jsonEclass? jsonEclass: defaultStr
  }

  static getEClasses(json: any[], defaultStr?: string): (string|undefined)[] {
    if (!json) {
      return []
    }
    return  json.map((item) => this.getEClass(item, defaultStr))
  }

  get<T extends Referencable>($ref: string): T {
    return (this.createdObjects.get($ref) as T);
  }

  private put<T extends Referencable>(ref: Ref, elem: T ) {
    this.createdObjects.set(ref.$ref, elem);
  }

  //only call on the root to trigger the complete deserialization
  static fromJSON<C extends Referencable>(
      json: JsonOf<C>,
      registry: ModelRegistry,
      rootEClass: string
  ): C {
    const context = new Deserializer(registry);
    const ref: Ref = {
      $ref: RefHandler.rootPath,
      eClass: rootEClass
    }
    const model: C = context.createTreeBackbone<C>(ref, json);
    model.deserializeLinks(context, json)
    return model;
  }

}
