import {Ref} from "../ref/ref";
import { v4 as uuidv4 } from 'uuid';
import {ReContainer} from "./container/re-container";
import {Deserializer} from "../../serialization/deserializer";
import {getAllAttributes} from "../../binding/attribute-collector";
import {AttributeOptions} from "../../binding/attribute-decorator";
import {JsonOf} from "../../serialization/json-deserializable";
import {ECLASS_METADATA_KEY} from "../../binding/eclass-decorator";
import {SerializationContext} from "../../serialization/serialization-context";
import {RefHandler} from "../ref/ref-handler";
import {ReTreeChildrenContainer} from "./container/tree/re-tree-children-container";
import {ReLinkContainer} from "./container/link/re-link-container";

/** base class for CORE models.
 *
 */
export abstract class Referencable {

  $gId: string; //graphical ID

  $treeChildren: ReTreeChildrenContainer<any>[] = [];
  $otherReferences: ReLinkContainer<any>[] = [];

  protected constructor() {
    this.$gId = uuidv4();
  }

  getEClass(): string {
    const eClass = Reflect.getMetadata(ECLASS_METADATA_KEY, this.constructor);
    if (!eClass) {
      throw new Error(
          `Missing @eClass decorator on ${this.constructor.name}.`
      );
    }
    return eClass;
  }

  assignRefs(ctx: SerializationContext, path: string) {
    const ref: Ref = RefHandler.createRef(path, this.getEClass())
    ctx.put(this, ref)
    for(let child of this.$treeChildren) {
      child.assignRefs(ctx, path)
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

  toJson(ctxOPt?: SerializationContext): JsonOf<this> {
    const ctx = ctxOPt ? ctxOPt : new SerializationContext(this)
    //todo: this creates one assuming that the current element is root, once we have all parent pointers we can walk up first and then start
    const json: any = {};
    json["eClass"] = this.getEClass(); //todo not always necessary
    this.attributesToJson(json);
    this.refContainersToJson(json, ctx);

    return json as JsonOf<this>;
  }


  private refContainersToJson(json: any, ctx: SerializationContext) {
    this.$treeChildren.forEach(child => {
      const jsc = child.toJson(ctx)
      if (jsc != undefined && !(Array.isArray(jsc) && jsc.length == 0)) {
        json[child.referenceName] = jsc
      }
    })
    this.$otherReferences.forEach(child => {
      const jsc = child.toJson(ctx)
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
  }

  createChildren<J extends JsonOf<this>>(context: Deserializer, parent: Ref, json: J) {
    this.$treeChildren.forEach(child => {
      child.fromJson(parent.$ref, context, json)
    })
  }

  attributesFromJson<J extends JsonOf<this>>(jsonTyped: J) {
    const json: any = jsonTyped as any
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

  public deserializeLinks<J extends JsonOf<this>>(context: Deserializer, jsonTyped: J) {
    const json = jsonTyped as any
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

}
