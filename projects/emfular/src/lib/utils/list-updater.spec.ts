import { ListUpdater } from './list-updater';

describe('ListUpdater', () => {

  let obj1: any = {name: "obj1"}
  let obj2: any = {name: "obj2"}
  let obj3: any = {name: "obj3"}

  it('should create an instance', () => {
    expect(new ListUpdater()).toBeTruthy();
  });

  it("should add an element only if it is missing", () => {
    const list: any[] = []
    let bool = ListUpdater.addToListIfMissing(obj1, list)
    expect(bool).toBeTruthy();
    expect(list).toEqual([obj1]);
    bool = ListUpdater.addToListIfMissing(obj1, list)
    expect(bool).toBeFalse();
    expect(list).toEqual([obj1]);
    bool = ListUpdater.addToListIfMissing(obj2, list)
    expect(bool).toBeTruthy();
    expect(list).toEqual([obj1, obj2]);
  })

  it('should remove an element', () => {
    const list: any[] = [obj1, obj2, obj3]
    let bool = ListUpdater.removeFromList(obj2, list)
    expect(bool).toBeTrue();
    expect(list).toEqual([obj1, obj3]);
    bool = ListUpdater.removeFromList(obj2, list)
    expect(bool).toBeFalse();
    expect(list).toEqual([obj1, obj3]);
    bool = ListUpdater.removeFromList(obj3, list)
    expect(bool).toBeTrue();
    expect(list).toEqual([obj1]);
    bool = ListUpdater.removeFromList(obj3, list)
    expect(bool).toBeFalse();
    expect(list).toEqual([obj1]);
    bool = ListUpdater.removeFromList(obj1, list)
    expect(bool).toBeTrue();
    expect(list).toEqual([]);
  })
});
