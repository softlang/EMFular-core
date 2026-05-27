import {
    EClassesSingleChild,
    ReContainersWithSingleChild,
    ReContainersWithSingleChildRefs
} from "./re-containers-with-single-child";
import {EClasses, RootWithChildren, RootWithChildrenRefs} from "./referencables-with-children";
import {ReferenceMeta} from "../../binding/model-definition";


describe('defaultEClass initialization for containment references', () => {

    it('sets defaultEClass on single containment container', () => {
        const parent = new ReContainersWithSingleChild();

        // Get the symbol under which the container is stored
        const childKey = (ReContainersWithSingleChildRefs.child as ReferenceMeta).containerKey;
        expect(childKey).toBeDefined();

        const childContainer = (parent as any)[childKey!];
        expect(childContainer).toBeDefined();

        expect(childContainer.defaultEClass).toBe(
            EClassesSingleChild.ReSingleChildExample
        );
    });

    it('sets defaultEClass on list containment container', () => {
        const root = new RootWithChildren();

        // Symbol under which the container is stored
        const child2Key = (RootWithChildrenRefs.child2 as ReferenceMeta).containerKey;
        expect(child2Key).toBeDefined();

        // Access the actual container instance
        const child2Container = (root as any)[child2Key!];
        expect(child2Container).toBeDefined();

        // Assert correct defaultEClass
        expect(child2Container.defaultEClass).toBe(
            EClasses.Middle2WithChildren
        );
    });


});
