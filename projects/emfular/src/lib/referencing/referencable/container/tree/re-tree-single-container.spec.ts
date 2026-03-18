import { ReTreeSingleContainer } from './re-tree-single-container';
import {ReferencableTester, refTesterRef} from "../../../test/referencable-tester";

describe('ReferencableTreeSingletonContainer', () => {
  it('should create an instance', () => {
    let tester = new ReferencableTester()
    expect(new ReTreeSingleContainer(tester, 'test', refTesterRef.references.test, false)).toBeTruthy();
  });
});
