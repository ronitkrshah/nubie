import { GlobalContainer } from "../Container";

export function Scoped(token: symbol | string) {
    return function (target: TClass) {
        GlobalContainer.addScoped(token, target);
    };
}
