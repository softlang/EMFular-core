import {Ref} from "../ref/ref";
import { v4 as uuidv4 } from 'uuid';
import {ReContainer} from "./container/re-container";
import {Deserializer} from "../../serialization/deserializer";
import {JsonSerializable} from "../../serialization/json-serializable";
import {ReTreeListContainer} from "./container/tree/re-tree-list-container";
import {ReTreeSingleContainer} from "./container/tree/re-tree-single-container";
import {getAllAttributes} from "../../binding/attribute-collector";
import {AttributeOptions} from "../../binding/attribute-decorator";

/** base class for CORE models.
 *
 */
export abstract class Referencable implements JsonSerializable<any>{

  protected ref: Ref;
  gId: string; //graphical ID

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

  public deserializeRefs(context: Deserializer, json: any) {
    for (let elem of this.$otherReferences) {
      let jsonElem: any = json[elem.referenceName]
      if (Array.isArray(jsonElem)) {
        elem.addLinks(context,...jsonElem);
      } else {
        if (jsonElem != undefined)
          elem.addLinks(context, jsonElem);
      }
    }
    for (let elem of this.$treeChildren) {
      elem.createRefsOnChildren(context, json)
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

  private getContainer(name: string): ReContainer<Referencable> {
    let refContainers = Object.entries(this)
    let refContainer = refContainers.find((v: [string, any]) => v[0] == '_'+name )
    if (refContainer) {
      return (refContainer[1] as ReContainer<Referencable>)
    } else
      throw new Error("Container _"+name + " not found on "+refContainers)
  }

  public addToReferencableContainer(name: string, item: Referencable): boolean {
    return this.getContainer(name).add(item)
  }

  public removeFromReferencableContainer(name: string, item: Referencable): boolean {
    return this.getContainer(name).remove(item)
  }

  toJson(): any {
    let json: any = {};
    this.attributesToJson(json)
    this.refContainersToJson(json)
    return json;
  }

  private refContainersToJson(json: any) {
    this.$treeChildren.forEach(child => {
      const jsc = child.toJson()
      if (jsc != undefined && !(Array.isArray(jsc) && jsc.length == 0)) {
        json[child.referenceName] = jsc
      }
    })
    this.$otherReferences.forEach(child => {
      const jsc = child.toJson()
      if (jsc != undefined && !(Array.isArray(jsc) && jsc.length == 0)) {
        json[child.referenceName] = jsc
      }
    })
  }

  private attributesToJson(json: any) {
    const ctor = this.constructor as any;
    const attributes = getAllAttributes(ctor);
    attributes.forEach((options: AttributeOptions, key) => {
      if (this.hasOwnProperty(key)) { // skip sibling attributes that are on prototype
        let value: any = (this as any)[key];
        //suppress defaults here:
        if(value == undefined || value == "" || value ==false || value == options.default) return;
        // use right name (jsonName)
        if(options.jsonName) {
          json[options.jsonName] = value;
        } else {
          json[key] = value;
        }
      }
    })
    json["eClass"]=this.ref.eClass; //todo not always necessary
  }

  createChildren(context: Deserializer, parent: Ref, json: any) {
    this.$treeChildren.forEach(child => {
      child.fromJson(parent.$ref, context, json)
    })
  }

  fill(json: any) {
    const ctor = this.constructor as any;
    const attributes = getAllAttributes(ctor);
    attributes.forEach((options, key) => {
      if (json[key] !== undefined) {
        (this as any)[key] = json[key];
      } else if (options?.default !== undefined) {
        (this as any)[key] = options.default;
      }
    })
  }

}
