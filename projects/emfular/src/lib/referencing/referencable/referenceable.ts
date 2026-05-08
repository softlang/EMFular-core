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
import {ReTreeParentContainer} from "./container/shallow/re-tree-parent-container";

/** base class for CORE models.
 *
 */
export abstract class Referencable<
    Parent extends Referencable<any>
> {

  $gId: string; //graphical ID

  declare readonly ParentType: Parent;

  declare $classMeta: ClassMeta;
  declare $modelUri: string; //now inside modelMeta
  declare $modelMeta: ModelDefinition;

  private $parent?: ReTreeChildrenContainer<this>;

  readonly $treeChildren: ReTreeChildrenContainer<any>[] = [];
  readonly $otherReferences: ReLinkContainer<any,Parent>[] = [];

  private $violations: Map<string, string> = new Map<string, string>;

  protected constructor() {
    this.$gId = uuidv4();
    this.initReferences()
  }

  private initReferences() {
    const proto = Object.getPrototypeOf(this);
    const inits = proto.__referenceInitializers;
    if (inits) {
      for (const init of inits) {
        init.call(this);
      }
    }
  }

  setParent(parent: ReTreeChildrenContainer<this> | undefined) {
    if(this.$parent) {
      this.$parent.remove(this)
    }
    this.$parent = parent;
  }

  get parent(): ReTreeChildrenContainer<this> | undefined {
    return this.$parent
  }

  get violations(): Map<string, string> {
    return this.$violations
  }

  getParentReferencable(): Parent | undefined {
    return this.$parent?._parent
  }

  getEClass(): string {
    return ModelRegistry.getEClassForInstance(this)
  }

  assignRefs(ctx: SerializationContext, path: string) {
    const ref: Ref = RefHandler.createRef(path, this.getEClass())
    ctx.put(this, ref)
    for(let child of this.$treeChildren) {
      child.assignRefs(ctx, path)
    }
  }

  destruct(mode: DeletionMode = DeletionMode.RELAXED) {
    // removal from parent is always called with deletion mode RELAXED, otherwise infinite loops occur
    this.$parent?.remove(this)
    this.$otherReferences.forEach(refContainer => {
      refContainer.removeFromInverse(this, mode)
    })
    this.$treeChildren.forEach(child => {
      child.delete(mode)
    })
  }

  protected getContainer<T extends Referencable<any>>(refName: string): ReContainer<T, Parent> {
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

  public addToReferencableContainer<T extends Referencable<any>>(name: string, item: T): boolean {
    return this.getContainer<T>(name).add(item)
  }

  public removeFromReferencableContainer<T extends Referencable<any>>(name: string, item: T, mode: DeletionMode = DeletionMode.RELAXED): boolean {
    let container = this.getContainer<T>(name)
    let result = container.remove(item, mode)
    if (result && mode === DeletionMode.CASCADE && container.isRequired) {
        const instance = container.get()
        if (instance === undefined || (Array.isArray(instance) && instance.length === 0)) {
          container._parent.destruct(mode)
        }
      }
    return result
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
    for (let container of this.$otherReferences) {
      let jsonElem: Ref[] |Ref | undefined = json[container.referenceName]
      if (jsonElem != undefined) {
        const refArray = Array.isArray(jsonElem)? jsonElem : [jsonElem]
        refArray.map((ref: Ref) => {
          container.add(context.get(ref.$ref));
        })
      }
    }
    for (let container of this.$treeChildren) {
      container.createRefsOnChildren(context, json)
    }
  }

  public collectConstraintViolations() {
    this.$violations = new Map<string, string>;
    for (const symbol of Object.getOwnPropertySymbols(this)) {
      if (symbol.description === undefined) {
        continue
      }
      const ref = this.$classMeta.references[symbol.description];
      if (!ref) {
        continue
      }
      const container = (this as any)[symbol];
      if (ref.derivingMethod !== undefined) {
        const derivedContainer = container as ReContainer<any, any> & {
          checkDerivationConstraints(): string | undefined;
        }
        const derivationViolation = derivedContainer.checkDerivationConstraints();
        if (derivationViolation !== undefined) {
          this.$violations.set(derivedContainer.referenceName, derivationViolation);
        }
      }
      if (ref.isParent === true) {
        const parentContainer = (this as any)[symbol] as ReTreeParentContainer<any>;
        if (parentContainer.meta.min === 1 && this.$parent === undefined) {
          this.$violations.set(parentContainer.referenceName, parentContainer.checkCardinalityConstraints());
        }
      }
    }
    this.$otherReferences.forEach(refContainer => {
      const cardinalityViolation = refContainer.checkCardinalityConstraints();
      if (cardinalityViolation !== undefined) {
        this.$violations.set(refContainer.referenceName, cardinalityViolation);
      }
    });
    this.$treeChildren.forEach(child => {
      const cardinalityViolation = child.checkCardinalityConstraints();
      if (cardinalityViolation !== undefined) {
        this.$violations.set(child.referenceName, cardinalityViolation);
      }
    });
  }

}
