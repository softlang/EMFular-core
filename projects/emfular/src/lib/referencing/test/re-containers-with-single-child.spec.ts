import {
    EClassesSingleChild,
    ReContainersWithSingleChild,
    ReSingleChildExample
} from "./re-containers-with-single-child";
import {Ref} from "../ref/ref";
import {JsonOf} from "../../serialization/json-deserializable";

describe('ReContainersWithSingleChild tests', () => {


    it("should register the containers correctly on the parent", () => {
        const root: ReContainersWithSingleChild = new ReContainersWithSingleChild()
        const child: ReSingleChildExample = new ReSingleChildExample()


        expect(root.$treeChildren.length).toBe(1)
        expect(root.$otherReferences.length).toBe(1)

        expect(child.$treeChildren.length).toBe(0)
        expect(child.$otherReferences.length).toBe(1)
    })

    it('should manage parent pointers correctly', () => {
        const root: ReContainersWithSingleChild = new ReContainersWithSingleChild();
        expect(root.parent).toBeUndefined()
        expect(root.child.value).toBeUndefined()
        const child: ReSingleChildExample = new ReSingleChildExample();
        expect(child.myParent.value).toBeUndefined()
        expect(child.parent).toBeUndefined()
        //set tree parent:
        child.myParent.assign(root);
        expect(child.parent).toBeDefined()
        expect(child.myParent.value).toEqual(root);
        expect(root.child.value).toBe(child);

        const root2 = new ReContainersWithSingleChild();
        expect(root.child.value).toBe(child);
        expect(root2.child.value).toBeUndefined();
        child.myParent.assign(root2);
        expect(child.myParent.value).toEqual(root2);
        expect(root2.child.value).toBe(child);
        expect(root.child.value).toBeUndefined();

        //also set from parent end:
        root.child.assign(child);
        expect(root.child.value).toEqual(child);
        expect(child.myParent.value).toEqual(root);
        expect(root2.child.value).toBeUndefined()
    })

    it('should serialize and deserialize a ReContainersWithSingleChild', () => {
        const root: ReContainersWithSingleChild = new ReContainersWithSingleChild();
        const child: ReSingleChildExample = new ReSingleChildExample();

        const rootJson = root.toJson()

        expect(rootJson).toEqual({name: "re1", eClass: EClassesSingleChild.ReContainersWithSingleChild})
        const rootFromJson: ReContainersWithSingleChild = ReContainersWithSingleChild.fromJSON(rootJson)
        expect(rootFromJson.name).toEqual(root.name)
        expect(rootFromJson.child.value).toBeUndefined()
        expect(rootFromJson.link.value).toBeUndefined()

        // now create parent/child:
        child.myParent.assign(root);
        expect(child.myParent?.value?.name).toEqual(root.name)
        expect(child.myParent?.value?.link.value).toBeUndefined()

        const jsonNoLinks = root.toJson()
        expect(jsonNoLinks.child).toBeDefined()
        expect(jsonNoLinks.link).toBeUndefined()

        const fromNoLinks : ReContainersWithSingleChild = ReContainersWithSingleChild.fromJSON(jsonNoLinks)
        expect(fromNoLinks.link.value).toBeUndefined()
        expect(fromNoLinks.child?.value?.myParent?.value?.name).toEqual(root.name)

        //add other links:
        root.link.assign(child);
        expect(child.otherLink.value).toEqual(root)
        const completeJson: JsonOf<ReContainersWithSingleChild> = root.toJson()
        expect(completeJson.name).toEqual(root.name)
        expect(completeJson.link).toBeDefined()
        //todo: must compile withoutcast for correct jsonOf:
        let ref = completeJson?.link as Ref
        expect(ref.eClass).toEqual(EClassesSingleChild.ReSingleChildExample)
        const childJson: JsonOf<ReSingleChildExample> |undefined = completeJson.child;
        const completeFromJson : ReContainersWithSingleChild = ReContainersWithSingleChild.fromJSON(completeJson)
        expect(completeFromJson.name).toEqual(root.name)
        expect(completeFromJson.link.value).toEqual(completeFromJson.child.value)
    })
})