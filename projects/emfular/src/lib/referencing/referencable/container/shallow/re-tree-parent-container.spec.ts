import { ReTreeParentContainer } from './re-tree-parent-container';
import {ReferencableTester, refTesterRef} from "../../../test/referencable-tester";

describe('ReferencableTreeParentContainer', () => {
  it('should create an instance', () => {
    let tester = new ReferencableTester()
    expect(new ReTreeParentContainer(tester, 'refName',  refTesterRef.references.test)).toBeTruthy();
  });

  it('should serialize a contained ref', () => {

  })
});
