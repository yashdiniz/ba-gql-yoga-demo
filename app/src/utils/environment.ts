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
    const response = fetch(`${env.SERVER}/gql`, {
        method: "POST",
        headers: [
            ["Content-Type", "application/json"],
            ["Authorization", `Bearer ${useSessionStore.getState().token}`]
        ],
        body: JSON.stringify({
            query: params.text,
            variables,
        }),
    });

    return Observable.from(response.then((data) => data.json()));
};

export function createEnvironment(): IEnvironment {
    const network = Network.create(fetchFn);
    const store = new Store(new RecordSource());
    return new Environment({ store, network });
}