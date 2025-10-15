import { GlobalContainer } from "../Container";

export function Transient(token: symbol | string) {
    return function (target: TClass) {
        GlobalContainer.addTransient(token, target);
    };
}
