import {Ref} from "../ref/ref";
import { v4 as uuidv4 } from 'uuid';
import {ListUpdater} from "../../utils/list-updater";
import {ReferencableContainer} from "./referencable-container";
import {Deserializer} from "../../deserialization/deserializer";

/** base class for CORE models.
 *
 */
export abstract class Referencable {

  protected ref: Ref;
  gId: string;

  /* todo two open points:
      1) we could enforce eClass already here and use it instead if deferring that to the constructor,
      2) we could allow the parent to set the refpath so that we coul avoid the parameter of prepare
  * */

  $treeChildren: ReferencableContainer<any>[] = [];
  $otherReferences: ReferencableContainer<any>[] = [];

  public getTreeParent(): Referencable | undefined {
    return undefined;
  }

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
        elem.addReferences(context,...jsonElem);
      } else {
        if (jsonElem != undefined)
          elem.addReferences(context, jsonElem);
      }
    }
    for (let elem of this.$treeChildren) {
      // just call on all real children
      let children = elem.get()
      if (Array.isArray(children)) {
        children.map(child => {
          let c = (child as Referencable);
          c.addReferences(context)
        })
      } else {
        if (children != undefined) {
          let c = (children as Referencable);
          c.addReferences(context)
        }
      }
    }

  }

  removeFromListChild<T extends Referencable>(elem: T, list: T[]): void {
    // todo should I use the index on list children rather than the explicit list?
    if (elem.getTreeParent() == undefined || elem.getTreeParent() != this) {
      ListUpdater.removeFromList(elem, list)
    } else {
      console.log("Cannot remove from list, since I am currently the tree parent")
    }
  }

  static listToRefs<T extends Referencable>(list: T[]): Ref[] {
    if (list)
      return list.map(elem => elem.getRef())
    else
      return []
  }

  //todo
  destruct() {
    this.$treeChildren.forEach(child => {
      child.delete()
    })
    /*this.$otherReferences.forEach(list => {
      ListUpdater.destructAllFromChangingList(list.get())
    })*/
  }

  private getAttr(name: string): ReferencableContainer<Referencable> {
    let refContainers = Object.entries(this)
    let refContainer = refContainers.find((v: [string, any]) => v[0] == '_'+name )
    if (refContainer) {
      return (refContainer[1] as ReferencableContainer<Referencable>)
    } else
      throw new Error("Attribute _"+name + " not found on "+refContainers)
  }

  public addToReferencableContainer(name: string, item: Referencable): boolean {
    return this.getAttr(name).add(item)
  }

  public removeFromReferencableContainer(name: string, item: Referencable): boolean {
    return this.getAttr(name).remove(item)
  }

}
