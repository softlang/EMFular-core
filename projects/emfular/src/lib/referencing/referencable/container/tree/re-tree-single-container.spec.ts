import { ReTreeSingleContainer } from './re-tree-single-container';
import {ReferencableTester} from "../../../test/referencable-tester";

describe('ReferencableTreeSingletonContainer', () => {
  it('should create an instance', () => {
    let tester = new ReferencableTester()
    expect(new ReTreeSingleContainer(tester, 'test', false)).toBeTruthy();
  });
});
