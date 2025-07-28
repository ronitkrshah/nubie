import { TClass } from "../../types";
import { NubieClassDecorator } from "../abstracts";

export default function Inject(token: string) {
    return function (target: any, _paramKey: undefined, paramIndex: number) {
        const metadata = NubieClassDecorator.getMetadata(target);
        NubieClassDecorator.updateMetadata(target, {
            constructorInjections: [
                ...(metadata.constructorInjections || []),
                {
                    token,
                    paramIndex,
                },
            ],
        });
    };
}
