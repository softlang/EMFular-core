
/*
idea:
  1) create the tree backbone, only following tree relationships
  2) use add references to add all created references afterwards
 */
import {Referencable} from "../referencing/referencable/referenceable";
import {RefHandler} from "../referencing/ref/ref-handler";
import {Ref} from "../referencing/ref/ref";
import {JsonOf} from "../serialization/json-deserializable";
import {ModelRegistry} from "../binding/model-registry";

export class Deserializer {

  private readonly completeJSON: any;

  private registry: ModelRegistry

  // all so far parsed objects
  private createdObjects: Map<string, Referencable> = new Map<string, Referencable>();

  constructor(json: any, registry: ModelRegistry) {
    this.completeJSON = json;
    this.registry = registry;
  }

  create<T extends Referencable>( ref: Ref): T {
    const entry = this.registry.get<T>(ref.eClass)
    const json = this.getJsonFromTree(ref.$ref) as JsonOf<typeof entry.cls>
    const obj: T = entry.cls.fromJson(json)
    this.put(obj)
    return obj
  }

  createWithChildren<T extends Referencable>( ref: Ref ): T {
    const t: T = this.create<T>(ref)
    t.createChildren(this)
    return t
  }

  getJsonFromTree<T>($ref: string): T {
    //first replace index access (.) by normal $ref divider, since they are all finally [] accesses
    const accessPaths = $ref.replaceAll('.', RefHandler.pathDivider).split(RefHandler.pathDivider)
    let res = this.completeJSON;
    for (let i = 1; i<accessPaths.length; i++) {
      res = res[(accessPaths[i])]
    }
    return (res as T);
  }

  get<T extends Referencable>($ref: string): T {
    return (this.createdObjects.get($ref) as T);
  }

  private put<T extends Referencable>(elem: T ) {
    this.createdObjects.set(elem.getRef().$ref, elem);
  }

  addAllReferences() {
    this.createdObjects.forEach((ref: Referencable) => {
      ref.addReferences(this)
    })
  }
}
