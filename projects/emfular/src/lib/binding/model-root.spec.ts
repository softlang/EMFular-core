import { ModelRoot } from './model-root';

class RootTester extends ModelRoot {
  constructor() {
    super();
  }

}

describe('ModelRoot', () => {
  it('should create an instance', () => {
    expect(new RootTester()).toBeTruthy();
  });
});
