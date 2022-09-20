interface Store {
    [key: string]: {
        expiresIn: number;
        data: any;
    };
}

export class Cache {
    private _store: Store = {};
    private _time = 10 * 60 * 1000;

    get<T>(key: string) {
        return this._store[key].data as T;
    }

    set(key: string, source: any): void {
        this._store[key] = {
            expiresIn: new Date().getTime() + this._time,
            data: source,
        };
    }

    isValid(key: string): boolean {
        if (!this._store[key] || new Date().getTime() > this._store[key].expiresIn) {
            return false;
        }

        return true;
    }
}
