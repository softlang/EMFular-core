import { ReDerivationResolver } from './re-derivation-resolver';
import { describe, expect, it } from 'vitest';

describe('ReDerivationResolver', () => {
  it('should create an instance', () => {
    expect(new ReDerivationResolver<any, any>( () => {})).toBeTruthy();
  });
});
