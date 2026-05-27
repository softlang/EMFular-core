import {Referencable} from "../referencing/referencable/referenceable";
import { DeletionMode } from "./deletion-mode";

export class ListUpdater {

  // ************** Helper *********************
  public static removeFromList<T>(elem: T, list: T[]): boolean {
    if(!list) {
      return false;
    }
    const index = list.indexOf(elem)
    if(index > -1) {
      list.splice(index, 1);
      return true;
    }
    return false;
  }

  static addToListIfMissing<T>(item: T, list: T[]): boolean {
    const index = list.indexOf(item);
    if(index > -1) {
      return false;
    } else {
      list.push(item);
      return true;
    }
  }

  static destructAllFromChangingList<T extends Referencable<any>>(list: T[], mode: DeletionMode) {
    while(list?.length > 0){
      if (mode === DeletionMode.CASCADE) {
        list[0].$destruct(mode)
      } else if (mode === DeletionMode.RELAXED) {
        list[0].$parent?.remove(list[0], mode)
      }
    }
  }

}
