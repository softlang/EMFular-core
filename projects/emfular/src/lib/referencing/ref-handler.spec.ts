import { RefHandler } from './ref-handler';

describe('RefHandler', () => {
  it('should create an instance', () => {
    expect(new RefHandler()).toBeTruthy();
  });

  it('getIndexFromString: should deliver the final part (after last .) from the string as number', () => {
    expect(RefHandler.getIndexFromString('/...../vhgvh.78')).toBe(78);
  })

  it('computePrefix: should combine prefix and suffix into path', () => {
    expect(RefHandler.computePrefix('', '')).toEqual('/@')
    expect(RefHandler.computePrefix('hakvhv.kjlb7889', 'bjklbj')).toEqual('hakvhv.kjlb7889/@bjklbj')
  })

  it('getParentAddress: should remove own part from path', () => {
    expect(RefHandler.getParentAddress('//fd/@g.89@j.89/h/gh.6')).toEqual('//fd')
    expect(RefHandler.getParentAddress('//fd/@g.89@j.89/h/@gh.6')).toEqual('//fd/@g.89@j.89/h')
    expect(RefHandler.getParentAddress('//fd/@g.89@j.89/h/@gh6')).toEqual('//fd/@g.89@j.89/h')
  })

  it('mixWithIndex: should combine prefix and number into path', () => {
    expect(RefHandler.mixWithIndex('', 0)).toEqual('.0')
    expect(RefHandler.mixWithIndex('.', 10)).toEqual('..10')
    expect(RefHandler.mixWithIndex('vjkhv/@vh.6/', 36)).toEqual('vjkhv/@vh.6/.36')
  })

  it('createRef: should create a new ref from both inputs', () => {
    expect(RefHandler.createRef('@0', 'http://test'))
        .toEqual({$ref: '@0', eClass: 'http://test'})
  })

  it('createRefIfMissing: should create a new ref if there is none given, otherwise return the given one', () => {
    let ref0 = {$ref: '@0', eClass: 'http://test'};
    let ref1 = {$ref: '', eClass: 'http://test'};
    let ref2 = {$ref: '', eClass: ''};
    let eclass0 = 'http://test2';
    let eclass1 = '';
    expect(RefHandler.createRefIfMissing(eclass0, undefined)).toEqual({
      $ref: '', eClass: eclass0
    })
    expect(RefHandler.createRefIfMissing(eclass1, undefined)).toEqual({
      $ref: '', eClass: eclass1
    })
    expect(RefHandler.createRefIfMissing(eclass0, ref0)).toEqual(
        ref0
    )
    expect(RefHandler.createRefIfMissing(eclass0, ref1)).toEqual(
        ref1
    )
    expect(RefHandler.createRefIfMissing(eclass0, ref2)).toEqual(
        ref2
    )
  })
});
