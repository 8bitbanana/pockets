import { Signal } from "@preact/signals";

export default class SignalWrapper<T> extends Signal<boolean> {
    private _inner: T;

    constructor(inner: T) {
        super(false);

        this._inner = inner;
    }

    get_inner(): Readonly<T> {

        // Read the signal value so the calling component is subscribed
        const a = this.value;

        return this._inner;
    }

    unpack(): T {
        return this._inner;
    }

    set_inner(new_inner: T, update: boolean = true) {

        this._inner = new_inner;

        if (update) {
            // Modify the signal value, so any subscribed components are rerendered
            this.value = !this.value;
        }
    }

    mutate(func: (inner: T) => void, update: boolean = true) {

        func(this._inner);

        if (update) {
            // Modify the signal value, so any subscribed components are rerendered
            this.value = !this.value;
        }
    }
    
}