import env from "@/env";
import {
    Store,
    RecordSource,
    Network,
    Observable,
    type FetchFunction,
    type IEnvironment,
    Environment,
} from "relay-runtime";
import { useSessionStore } from "./sessionStore";

const fetchFn: FetchFunction = (params, variables) => {
    const token = useSessionStore.getState().token;
    const response = fetch(`${env.SERVER}/gql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` })
        },
        body: JSON.stringify({
            query: params.text,
            variables,
        }),
    });

    return Observable.from(response.then((data) => data.json()));
};

// Create a singleton environment
let environment: IEnvironment | null = null;

export function createEnvironment(): IEnvironment {
    if (!environment) {
        const network = Network.create(fetchFn);
        const store = new Store(new RecordSource());
        environment = new Environment({ store, network });
    }
    return environment;
}