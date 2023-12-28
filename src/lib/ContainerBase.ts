

export class ContainerBase<TKey, TValue> {
    data: Map<TKey, TValue> = new Map();

    add(key: TKey, value: TValue) {
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

    delete(key: TKey): boolean {
        return this.data.delete(key);
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
        return true;
    }
}
