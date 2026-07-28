import { ModelRoot } from './model-root';
import { describe, expect, it } from 'vitest';

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
