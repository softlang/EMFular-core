import {Ref} from "./ref";
import { v4 as uuidv4 } from 'uuid';
import {ListUpdater} from "../utils/list-updater";
import {ReferencableContainer} from "./referencable-container";

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

  singleChildren: Map<string, Referencable> = new Map();
  listChildren: Map<string, Referencable[]> = new Map();

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
    this.ref = new Ref(ownPos, this.ref.eClass)
  }

  prepare(ownPos: string) {
    this.setRef(ownPos)
    for (let single of this.singleChildren) {
      single[1].prepare(Ref.computePrefix(ownPos, single[0]));
    }
    for (let list of this.listChildren) {
      Referencable.prepareList(Ref.computePrefix(ownPos, list[0]) ,list[1])
    }
  }

  static prepareList<T extends Referencable>(prefix: string, list: T[]): void {
    if (list?.length > 0) {
      list.map((ref: Referencable, index) => {
        ref.prepare(Ref.mixWithIndex(prefix, index))
      })
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

  destruct() {
    this.singleChildren.forEach(child => {
      child.destruct()
    })
    this.listChildren.forEach(list => {
      ListUpdater.destructAllFromChangingList(list)
    })
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
