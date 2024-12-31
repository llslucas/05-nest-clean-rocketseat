import { WatchedList } from "./watched-list";

class NumberWatchedList extends WatchedList<number> {
  compareItems(a: number, b: number): boolean {
    return a === b;
  }
}

describe("Watched List", () => {
  it("should be able to create a watched list with initial items.", () => {
    const list = new NumberWatchedList([1, 2, 3]);

    expect(list.getItems()).toEqual([1, 2, 3]);
  });

  it("should be able to add new itens to the list", () => {
    const list = new NumberWatchedList([1, 2, 3]);

    list.add(4);

    expect(list.getItems()).toEqual([1, 2, 3, 4]);
    expect(list.getNewItems()).toEqual([4]);
  });

  it("should be able to remove itens to the list", () => {
    const list = new NumberWatchedList([1, 2, 3]);

    list.remove(3);

    expect(list.getItems()).toEqual([1, 2]);
    expect(list.getRemovedItems()).toEqual([3]);
  });

  it("should be able to add an item even if it was removed before", () => {
    const list = new NumberWatchedList([1, 2, 3]);

    list.remove(3);
    list.add(3);

    expect(list.getNewItems()).toEqual([]);
    expect(list.getRemovedItems()).toEqual([]);
  });

  it("should be able to remove an item even it was added before", () => {
    const list = new NumberWatchedList([1, 2, 3]);

    list.add(4);
    list.remove(4);

    expect(list.getNewItems()).toEqual([]);
    expect(list.getRemovedItems()).toEqual([]);
  });

  it("it should be able to update watched list items", () => {
    const list = new NumberWatchedList([1, 2, 3]);

    list.update([1, 3, 5]);

    expect(list.getNewItems()).toEqual([5]);
    expect(list.getRemovedItems()).toEqual([2]);
  });
});
