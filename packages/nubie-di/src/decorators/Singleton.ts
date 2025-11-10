import { GlobalContainer } from "../Container";

export function Singleton(token: symbol | string) {
    return function (target: TClass) {
        GlobalContainer.addSingleton(token, target);
    };
}
