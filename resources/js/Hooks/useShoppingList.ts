import EventEmitter from "events";
import { DateTime } from "luxon";
import { useState, useEffect } from "react";

export type ItemCheckedState = {
  id: [string, string | null];
  checked: boolean;
};
export type StoredCheckedState = { [id: string]: boolean };
export type StateIdentifier =
  | string[]
  | {
      meals: {
        slug: string;
        date: string;
      }[];
      id: [string, string | null]; // id and unit
    };

/**
 * This stores the user's checked state for the shopping
 * list in local storage
 */
export class ShoppingList extends EventEmitter {
  private startDate: string;
  private endDate: string;
  private state: StoredCheckedState;
  constructor(startDate: string, endDate: string) {
    super();
    this.startDate = startDate;
    this.endDate = endDate;
    this.state = this.read();
    this.attachListener = this.attachListener.bind(this);
  }

  /**
   * Generates a string ID to identify the ingredient
   * @param date
   * @param slug
   * @param ingredient
   * @returns
   */
  private static id(
    date: string,
    slug: string,
    [id, unit]: [string, string | null]
  ) {
    return JSON.stringify([date, slug, id, unit]);
  }

  private static asIds(ids: StateIdentifier): string[] {
    if (!Array.isArray(ids)) {
      const ingredient = ids.id;
      return ids.meals.map(({ slug, date }) =>
        ShoppingList.id(date, slug, ingredient)
      );
    }
    return ids;
  }

  /**
   * Returns whether the identified item should be shown as "checked"
   * @param identifier
   * @returns true if the item is checked, false if it's not and null when the state is indeterminate (i.e. not all meals agree)
   */
  isChecked(ids: StateIdentifier): boolean | null {
    ids = ShoppingList.asIds(ids);
    // find the checked status for all the provided meals
    const filteredItems = ids.map((id) => {
      return this.state[id] || false;
    });

    // determine the return status
    if (filteredItems.every((i) => i)) return true;
    if (filteredItems.some((i) => i)) return null;
    return false;
  }
  /**
   * Set the checked status for an item
   * @param identifier
   * @param checked
   */
  setChecked(ids: StateIdentifier, checked: boolean) {
    ids = ShoppingList.asIds(ids);

    // set the status for each provided meal
    ids.forEach((id) => {
      if (checked) this.state[id] = checked;
      else delete this.state[id];
    });
    this.update();
  }

  /**
   * Reads the state from local storage
   * @returns
   */
  private read(): StoredCheckedState {
    return JSON.parse(
      localStorage.getItem(
        `shopping-list.v1.checked.${this.startDate}-${this.endDate}`
      ) || "{}"
    );
  }
  /**
   * writes the state to local storage
   */
  private update() {
    localStorage.setItem(
      `shopping-list.v1.checked.${this.startDate}-${this.endDate}`,
      JSON.stringify(this.state)
    );
    this.emit("update");
  }
  /**
   * a useEffect-compatible handler that updates a state whenever the
   * contents of the data change
   * @param setTimestamp
   * @returns
   */
  private attachListener(setTimestamp: (v: number) => void): () => void {
    const handler = () => setTimestamp(DateTime.now().toMillis());
    this.addListener("update", handler);
    return () => this.removeListener("update", handler);
  }

  /**
   * A hook that provides a reference to a ShoppingList object and ensures re-rendering
   * whenever the data changes
   * @param startDate the start date of the current meal plan, used to determine the context
   * @param endDate the end date of the current meal plan, used to determine the context
   * @returns
   */
  static useShoppingList(startDate: string, endDate: string) {
    // the reference to the shopping list
    const [shoppingList, setShoppingList] = useState(
      () => new ShoppingList(startDate, endDate)
    );
    // when the props change, replace the reference
    useEffect(() => {
      // this is to make sure we don't create the object twice when the element is mounted
      if (
        shoppingList.startDate !== startDate ||
        shoppingList.endDate !== endDate
      ) {
        const newShoppingList = new ShoppingList(startDate, endDate);
        setShoppingList(newShoppingList);
      }
    }, [startDate, endDate]);
    // a state that's updated whenever there's an update to the shopping list data
    const [_timestamp, setTimestamp] = useState(DateTime.now().toMillis());

    // attach the event handler to trigger a state change whenever the data changes
    useEffect(() => shoppingList.attachListener(setTimestamp), [shoppingList]);

    // when the props change, replace the reference
    useEffect(() => {
      shoppingList.cleanup();
    }, [shoppingList]);

    return shoppingList;
  }
  /**
   *
   */
  cleanup() {
    // run cleanup
    for (let i = 0, len = localStorage.length; i < len; ++i) {
      const key = localStorage.key(i);
      if (!key) break;
      const mObj = key.match(
        /shopping-list\.checked\.(\d{4}-\d{2}-\d{2})-(\d{4}-\d{2}-\d{2})/
      );
      if (!mObj) continue;
      const [_, _start, end] = mObj;
      // when the item is old, remove it
      // the exact value doesn't matter that much, we just need to know
      // we don't keep filling up local storage indefinitely
      if (end < this.startDate) {
        localStorage.removeItem(key);
      }
    }
  }
}

export default ShoppingList.useShoppingList;
