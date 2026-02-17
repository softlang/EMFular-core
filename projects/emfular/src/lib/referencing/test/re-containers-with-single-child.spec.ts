import {
    EClassesSingleChild,
    ReContainersWithSingleChild,
    ReSingleChildExample
} from "./re-containers-with-single-child";

describe('ReContainersWithSingleChild tests', () => {

    it('should manage parent pointers correctly', () => {
        const root: ReContainersWithSingleChild = new ReContainersWithSingleChild();
        expect(root.$parent).toBeUndefined()
        expect(root.child).toBeUndefined()
        const child: ReSingleChildExample = new ReSingleChildExample();
        expect(child.myParent).toBeUndefined()
        expect(child.$parent).toBeUndefined()
        //set tree parent:
        child.myParent = root;
        expect(child.$parent).toBeDefined()
        expect(child.myParent).toEqual(root);
        expect(root.child).toBe(child);

        const root2 = new ReContainersWithSingleChild();
        expect(root.child).toBe(child);
        expect(root2.child).toBeUndefined();
        child.myParent = root2;
        expect(child.myParent).toEqual(root2);
        expect(root2.child).toBe(child);
        expect(root.child).toBeUndefined();

        //also set from parent end:
        root.child = child;
        expect(root.child).toEqual(child);
        expect(child.myParent).toEqual(root);
        expect(root2.child).toBeUndefined()
    })

    it('should serialize and deserialize a ReContainersWithSingleChild', () => {
        const root: ReContainersWithSingleChild = new ReContainersWithSingleChild();
        const child: ReSingleChildExample = new ReSingleChildExample();

        const rootJson = root.toJson()

        expect(rootJson).toEqual({name: "re1", eClass: EClassesSingleChild.ReContainersWithSingleChild})
        const rootFromJson: ReContainersWithSingleChild = ReContainersWithSingleChild.fromJSON(rootJson)
        expect(rootFromJson.name).toEqual(root.name)
        expect(rootFromJson.child).toBeUndefined()
        expect(rootFromJson.link).toBeUndefined()

        // now create parent/child:
        child.myParent = root;
        expect(child.myParent?.name).toEqual(root.name)
        expect(child.myParent?.link).toBeUndefined()

        const jsonNoLinks = root.toJson()
        expect(jsonNoLinks.child).toBeDefined()
        expect(jsonNoLinks.link).toBeUndefined()

        const fromNoLinks : ReContainersWithSingleChild = ReContainersWithSingleChild.fromJSON(jsonNoLinks)
        expect(fromNoLinks.link).toBeUndefined()
        expect(fromNoLinks.child?.myParent?.name).toEqual(root.name)

        //add other links:
        root.link = child;
        expect(child.otherLink).toEqual(root)
        const completeJson = root.toJson()
        expect(completeJson.name).toEqual(root.name)
        expect(completeJson.link).toBeDefined()

        const completeFromJson : ReContainersWithSingleChild = ReContainersWithSingleChild.fromJSON(completeJson)
        expect(completeFromJson.name).toEqual(root.name)
        expect(completeFromJson.link).toEqual(completeFromJson.child)
    })
})