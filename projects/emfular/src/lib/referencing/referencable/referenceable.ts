import {Ref} from "../ref/ref";
import {v4 as uuidv4} from 'uuid';
import {ReContainer} from "./container/re-container";
import {Deserializer} from "../../serialization/deserializer";
import {getAllAttributes} from "../../binding/attribute-collector";
import {AttributeOptions} from "../../binding/attribute-decorator";
import {JsonOf} from "../../serialization/json-deserializable";
import {SerializationContext} from "../../serialization/serialization-context";
import {RefHandler} from "../ref/ref-handler";
import {ReTreeChildrenContainer} from "./container/tree/re-tree-children-container";
import {ReLinkContainer} from "./container/link/re-link-container";
import {ModelRegistry} from "../../binding/model-registry";
import {ClassMeta, ModelDefinition, ReferenceMeta} from "../../binding/model-definition";
import {DeletionMode} from "../../utils/deletion-mode";
import {REFERENCE_INTERNAL_API} from "./referencable-symbols";

//private, no export
const INIT_REFERENCES = Symbol("initReferences");
const GET_CONTAINER = Symbol("getContainer");
const REFERENCES_TO_JSON = Symbol("referenceToJson");
const ATTRIBUTES_TO_JSON = Symbol("attributesToJson");


/** base class for CORE models.
 *
 */
export abstract class Referencable<
    Parent extends Referencable<any>
> {

  $gId: string; //graphical ID

  declare readonly $ParentType: Parent;

  declare $classMeta: ClassMeta;
  declare $modelUri: string; //now inside modelMeta
  declare $modelMeta: ModelDefinition;

  private _$parent?: ReTreeChildrenContainer<this>;

  readonly $treeChildren: ReTreeChildrenContainer<any>[] = [];
  readonly $otherReferences: ReLinkContainer<any,Parent>[] = [];

  protected constructor() {
    this.$gId = uuidv4();
    this[INIT_REFERENCES]()
  }

  // ************* public modeling API ********************
  set $parent(parent: ReTreeChildrenContainer<this> | undefined) {
    if(this._$parent) {
      this._$parent.remove(this)
    }
    this._$parent = parent;
  }

  get $parent(): ReTreeChildrenContainer<this> | undefined {
    return this._$parent
  }

  $getParentReferencable(): Parent | undefined {
    return this._$parent?._parent
  }

  $getEClass(): string {
    return ModelRegistry.getEClassForInstance(this)
  }

  $destruct(mode: DeletionMode = DeletionMode.RELAXED) {
    // removal from parent is always called with deletion mode RELAXED, otherwise infinite loops occur (see remove in re-tree-list/single-container.ts)
    // tests in files re-link-list/single-container.spec.ts and re-tree-list/single-container.spec.ts fail when not setting RELAXED mode explicitly
    this._$parent?.remove(this, DeletionMode.RELAXED)
    this.$otherReferences.forEach(refContainer => {
      refContainer.removeFromInverse(this, mode)
    })
    this.$treeChildren.forEach(child => {
      child.delete(mode)
    })
  }

  public [REFERENCE_INTERNAL_API]: ReferenceApi<this> = {

    // ****************** inverse handling (called by link containers) **********************
    addToReference: <U extends Referencable<any>>(name: string, item: U): boolean => {
      return this[GET_CONTAINER]<U>(name).add(item)
    },

    removeFromReference: <U extends Referencable<any>>(name: string, item: U, mode: DeletionMode = DeletionMode.RELAXED): boolean => {
      let container = this[GET_CONTAINER]<U>(name)
      let result = container.remove(item, mode)
      if (result && mode === DeletionMode.CASCADE && container.isRequired) {
        const instance = container.get()
        if (instance === undefined || (Array.isArray(instance) && instance.length === 0)) {
          container._parent.$destruct(mode)
        }
      }
      return result
    },

    //************** Serialization *************************

    serialize_assignRefs: (ctx: SerializationContext, path: string): void => {
      const ref: Ref = RefHandler.createRef(path, this.$getEClass())
      ctx.put(this, ref)
      for(let child of this.$treeChildren) {
        child.assignRefs(ctx, path)
      }
    },

    //****************** Deserialization ************************
    deserializeAttributes: <J extends JsonOf<this>>(jsonTyped: J): void => {
      const json: any = jsonTyped as any;
      const ctor = this.constructor as any;
      const attributes = getAllAttributes(ctor);
      attributes.forEach((options, key) => {
        if (json[key] !== undefined) {
          (this as any)[key] = json[key];
        } else if (options?.default !== undefined) {
          (this as any)[key] = options.default;
        }
      });
    },

    deserializeChildren: <J extends JsonOf<this>>(
        context: Deserializer,
        parent: Ref,
        json: J
    ): void => {
      this.$treeChildren.forEach(child => {
        child.fromJson(parent.$ref, context, json);
      });
    },

    deserializeOtherReferences: <J extends JsonOf<this>>(
        context: Deserializer,
        jsonTyped: J
    ): void => {
      const json = jsonTyped as any;
      for (const container of this.$otherReferences) {
        let jsonElem: Ref[] | Ref | undefined = json[container.referenceName];
        if (jsonElem != undefined) {
          const refArray = Array.isArray(jsonElem) ? jsonElem : [jsonElem];
          refArray.map((ref: Ref) => {
            container.add(context.get(ref.$ref));
          });
        }
      }
      for (const container of this.$treeChildren) {
        container.createRefsOnChildren(context, json);
      }
    }
  };


  // ****************** inverse handling (called by link containers) **********************

  private [GET_CONTAINER]<
      T extends Referencable<any>
  >(refName: string): ReContainer<T, Parent> {
    let proto: any = Object.getPrototypeOf(this);
    let meta: ReferenceMeta | undefined;

    // Walk up the prototype chain until we find the reference
    while (proto) {
      const classMeta = proto.$classMeta;
      if (classMeta && classMeta.references && refName in classMeta.references) {
        meta = classMeta.references[refName];
        break;
      }
      proto = Object.getPrototypeOf(proto);
    }
    if (!meta) {
      throw new Error(`Reference '${refName}' not found on class '${this.constructor.name}'`);
    }
    const key: symbol = meta.containerKey!;
    const container = (this as any)[key];
    if (!container) {
      throw new Error(`Container for reference '${refName}' not initialized`);
    }
    return container as ReContainer<T, Parent>;
  }

  //************** Serialization *************************

  toJson(ctxOPt?: SerializationContext): JsonOf<this> {
    const ctx = ctxOPt ? ctxOPt : new SerializationContext(this)
    //todo: this creates one assuming that the current element is root, once we have all parent pointers we can walk up first and then start
    const json: any = {};
    json["eClass"] = this.$getEClass(); //todo not always necessary
    this[ATTRIBUTES_TO_JSON](json);
    this[REFERENCES_TO_JSON](json, ctx);

    return json as JsonOf<this>;
  }

  private [ATTRIBUTES_TO_JSON](json: any) {
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

  private [REFERENCES_TO_JSON](json: any, ctx: SerializationContext) {
    const relevantReferences = [
      ...this.$treeChildren,
      ...this.$otherReferences
    ];

    relevantReferences.forEach(child => {
      const jsc = child.toJson(ctx)
      if (jsc != undefined && !(Array.isArray(jsc) && jsc.length == 0)) {
        json[child.referenceName] = jsc
      }
    })
  }

  // ************* container construction *******************
  private [INIT_REFERENCES]() {
    const proto = Object.getPrototypeOf(this);
    const inits = proto.__referenceInitializers;
    if (inits) {
      for (const init of inits) {
        init.call(this);
      }
    }
  }

}


export interface ReferenceApi<T extends Referencable<any>> {

  // ****************** inverse handling (called by link containers) **********************
  addToReference: <U extends Referencable<any>>(name: string, item: U) => boolean;
  removeFromReference: <U extends Referencable<any>>(
      name: string,
      item: U,
      mode?: DeletionMode
  ) => boolean;

  //************** Serialization *************************
  serialize_assignRefs: (ctx: SerializationContext, path: string) => void;

  //****************** Deserialization ************************
  deserializeAttributes: <J extends JsonOf<T>>(json: J) => void;
  deserializeChildren: <J extends JsonOf<T>>(
      context: Deserializer,
      parent: Ref,
      json: J
  ) => void;
  deserializeOtherReferences: <J extends JsonOf<T>>(
      context: Deserializer,
      json: J
  ) => void;
}