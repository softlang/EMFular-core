import {Ref} from "../ref/ref";
import { v4 as uuidv4 } from 'uuid';
import {ReContainer} from "./container/re-container";
import {Deserializer} from "../../serialization/deserializer";
import {JsonSerializable} from "../../serialization/json-serializable";
import {ReTreeListContainer} from "./container/tree/re-tree-list-container";
import {ReTreeSingleContainer} from "./container/tree/re-tree-single-container";

/** base class for CORE models.
 *
 */
export abstract class Referencable implements JsonSerializable<any>{

  protected ref: Ref;
  gId: string;

  /* todo two open points:
      1) we could enforce eClass already here and use it instead if deferring that to the constructor,
      2) we could allow the parent to set the refpath so that we coul avoid the parameter of prepare
  * */

  $treeChildren: (ReTreeListContainer<any>|ReTreeSingleContainer<any>)[] = [];
  $otherReferences: ReContainer<any>[] = [];

  protected constructor(ref: Ref) {
    this.ref = ref;
    this.gId = uuidv4();
  }

  public getRef(): Ref {
    return this.ref;
  }

  private setRef(ownPos: string) {
    this.ref.$ref = ownPos
  }

  prepare(ownPos: string) {
    this.setRef(ownPos)
    for (let child of this.$treeChildren) {
      child.prepare(ownPos);
    }
  }

  public addReferences(context: Deserializer) {
    let json: any = context.getJsonFromTree(this.ref.$ref)
    for (let elem of this.$otherReferences) {
      //let refType =
      let jsonElem: any = json[elem.referenceName] //assumes same name on json and internal representation
      if (Array.isArray(jsonElem)) {
        elem.addLinks(context,...jsonElem);
      } else {
        if (jsonElem != undefined)
          elem.addLinks(context, jsonElem);
      }
    }
  }

  destruct() {
    this.$otherReferences.forEach(refContainer => {
      refContainer.removeFromInverse(this)
    })
    this.$treeChildren.forEach(child => {
      child.delete()
    })
  }

  private getAttr(name: string): ReContainer<Referencable> {
    let refContainers = Object.entries(this)
    let refContainer = refContainers.find((v: [string, any]) => v[0] == '_'+name )
    if (refContainer) {
      return (refContainer[1] as ReContainer<Referencable>)
    } else
      throw new Error("Attribute _"+name + " not found on "+refContainers)
  }

  public addToReferencableContainer(name: string, item: Referencable): boolean {
    return this.getAttr(name).add(item)
  }

  public removeFromReferencableContainer(name: string, item: Referencable): boolean {
    return this.getAttr(name).remove(item)
  }

  abstract toJson(): any

  //todo use json: any?
  createChildren(context: Deserializer, parent: Ref) {
    this.$treeChildren.forEach(child => {
      child.fromJson(parent.$ref, context)
    })
  }

}
