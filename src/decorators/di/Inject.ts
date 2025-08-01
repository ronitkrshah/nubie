import { ClassDecorator } from "../abstracts";

export default function Inject(token: string) {
    return function (target: any, _paramKey: undefined, paramIndex: number) {
        const metadata = ClassDecorator.getMetadata(target);
        ClassDecorator.updateMetadata(target, {
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
