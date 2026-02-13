import { ReTreeParentContainer } from './re-tree-parent-container';
import {ReferencableTester} from "../../../test/referencable-tester";

describe('ReferencableTreeParentContainer', () => {
  it('should create an instance', () => {
    let tester = new ReferencableTester()
    expect(new ReTreeParentContainer(tester, 'refName', 'necessary')).toBeTruthy();
  });

  it('should serialize a contained ref', () => {

  })
});
