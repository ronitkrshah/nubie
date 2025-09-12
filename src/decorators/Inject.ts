import { ControllerBase } from "../base";
import { Metadata } from "../utils";
import { TApiControllerMetadata } from "./class-decorators";

export default function Inject(token: string) {
    return function (target: any, _paramKey: undefined, paramIndex: number) {
        const metadata = Metadata.getMetadata(ControllerBase.METADATA_KEY, target) as TApiControllerMetadata;
        Metadata.updateMetadata(ControllerBase.METADATA_KEY, target, {
            constructorInjections: [
                ...(metadata?.constructorInjections || []),
                {
                    token,
                    paramIndex,
                },
            ],
        });
    };
}
