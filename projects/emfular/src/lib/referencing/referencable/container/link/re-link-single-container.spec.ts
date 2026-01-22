import { ReLinkSingleContainer } from './re-link-single-container';
import {ReferencableTester} from "../../../test/referencable-tester";
import {RefHandler} from "../../../ref/ref-handler";

describe('ReLinkSingleContainer', () => {
  it('should create an instance', () => {
    let tester = new ReferencableTester(RefHandler.createRef('1', 'http://www.uni-koblenz.de/Tester'))
    expect(new ReLinkSingleContainer(tester, 'refName')).toBeTruthy();
  });
});
