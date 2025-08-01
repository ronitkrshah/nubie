import { ClassDecorator, ControllerBase } from "../../abstracts";

export default function Inject(token: string) {
    return function (target: any, _paramKey: undefined, paramIndex: number) {
        const metadata = ClassDecorator.getMetadata(ControllerBase.METADATA_KEY, target);
        ClassDecorator.updateMetadata(ControllerBase.METADATA_KEY, target, {
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
