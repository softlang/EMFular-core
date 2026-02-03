/*
idea:
  1) create the tree backbone, only following tree relationships
  2) use addRefWithJson to add all created references afterwards
 */
import {Referencable} from "../referencing/referencable/referenceable";
import {RefHandler} from "../referencing/ref/ref-handler";
import {Ref} from "../referencing/ref/ref";
import {JsonDeserializable, JsonOf} from "./json-deserializable";
import {ModelRegistry} from "../binding/model-registry";

export class Deserializer {

  private registry: ModelRegistry

  // all so far parsed objects
  private createdObjects: Map<string, Referencable> = new Map<string, Referencable>();

  constructor(registry: ModelRegistry) {
    this.registry = registry;
  }

  create<T extends Referencable>( ref: Ref, json: JsonOf<T>): T {
    const entry = this.registry.get<T>(ref.eClass)
    const obj: T = entry.cls.fromJson(json, ref)
    this.put(ref,obj)
    return obj
  }

  createWithChildren<T extends Referencable>( ref: Ref, json: JsonOf<T> ): T {
    const t: T = this.create<T>(ref, json)
    t.createChildren(this, ref, json)
    return t
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

  static fromJSON<C extends JsonDeserializable<any, any>>(
      _: C, //type hint for compilation errors if lib uses it wrongly
      json: JsonOf<C>,
      registry: ModelRegistry,
      rootEClass: string
  ): InstanceType<C> {
    let context = new Deserializer(registry);
    let ref: Ref = {
      $ref: RefHandler.rootPath,
      eClass: rootEClass
    }
    let model: InstanceType<C> = context.createWithChildren<InstanceType<C>>(ref, json);
    model.addRefWithJson(context, json)
    return model;
  }

}
