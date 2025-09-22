import { ReferencableListContainer } from './referencable-list-container';
import {ReferencableTester} from "./referencable-tester";
import {RefHandler} from "./ref-handler";

describe('ReferencableListContainer', () => {
  it('should create an instance', () => {
    let tester = new ReferencableTester(RefHandler.createRef('1', 'http://www.uni-koblenz.de/Tester'))
    expect(new ReferencableListContainer(tester, 'refName')).toBeTruthy();
  });
});
