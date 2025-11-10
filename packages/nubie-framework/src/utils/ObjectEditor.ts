import { Draft, produce } from "immer";

export class ObjectEditor<TState extends object> {
    private _state: TState;

    public constructor(state: TState) {
        this._state = state;
    }

    public getState() {
        return this._state;
    }

    public mutateState(callback: (state: Draft<TState>) => void) {
        this._state = produce(this._state, callback);
    }
}
