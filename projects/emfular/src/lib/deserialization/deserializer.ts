
/*
idea:
  1) create the tree backbone, only following tree relationships
  2) use add references to add all created references afterwards
 */
import {Referencable} from "../referencing/referencable/referenceable";
import {RefHandler} from "../referencing/ref/ref-handler";

export class Deserializer {

  private readonly completeJSON: any;

  // all so far parsed objects
  private context: Map<string, Referencable> = new Map<string, Referencable>();

  constructor(json: any) {
    this.completeJSON = json;
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
    return (this.context.get($ref) as T);
  }

  put<T extends Referencable>(elem: T ) {
    this.context.set(elem.getRef().$ref, elem);
  }

  addAllReferences() {
    this.context.forEach((ref: Referencable) => {
      ref.addReferences(this)
    })
  }
}
