

export class ContainerBase<TKey, TValue> {
    protected data: Map<TKey, TValue> = new Map();
    protected order: TKey[] = [];

    add(key: TKey, value: TValue) {

        if (!this.has(key)) {
            this.order.push(key);
        }

        this.data.set(key, value);
    }

    modify(key: TKey, new_value: TValue): boolean {
        const old_value = this.data.get(key);
        if (old_value === undefined) {
            return false;
        }
        /* Modifying to the same thing is probably fine
           It will cause a refresh since this returns true, but
           we probably want that anyway */
        // if (old_value === new_value) {
        //     return false;
        // }
        this.data.set(key, new_value);
        return true;
    }

    has(key: TKey): boolean {
        return this.data.has(key);
    }

    delete(key_to_delete: TKey): boolean {

        if (!this.has(key_to_delete)) {
            return false;
        }

        console.log(`Deleting ${key_to_delete}`);

        this.order = this.order.filter((key) => {return key !== key_to_delete});
        this.data.delete(key_to_delete);

        console.log(this.order);
        console.log(this.data);

        return true;
    }

    rename(old_key: TKey, new_key: TKey): boolean {
        const attr = this.data.get(old_key);
        if (attr === undefined) {
            return false;
        }
        if (this.data.has(new_key)) {
            return false;
        }
        this.data.delete(old_key);
        this.data.set(new_key, attr);

        const old_key_index = this.order.indexOf(old_key);
        if (old_key_index !== undefined) {
            this.order[old_key_index] = new_key;
        }

        return true;
    }

    get(key: TKey): TValue | undefined {
        return this.data.get(key);
    }

    forEachKey(func: (key: TKey) => void): void {
        this.order.forEach(func);
    }
}
