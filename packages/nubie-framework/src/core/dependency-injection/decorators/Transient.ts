import { AppContext } from "../../../AppContext";
import { Lifecycle } from "tsyringe";

export function Transient(token: symbol | string) {
    return function (target: TClass) {
        const container = AppContext.getInstance().serviceContainer.container;
        container.register(token, { useClass: target }, { lifecycle: Lifecycle.Transient });
    };
}
