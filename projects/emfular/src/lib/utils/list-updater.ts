import {Referencable} from "../referencing/referencable/referenceable";

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


  static destructAllFromChangingList<T extends Referencable<any>>(list: T[]) {
    while(list?.length > 0){
      list[0].destruct()
    }
  }

}
