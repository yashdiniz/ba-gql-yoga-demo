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
import { redirect } from "react-router-dom";

const fetchFn: FetchFunction = (params, variables) => {
    const token = useSessionStore.getState().token;
    if (!token) {
        redirect('/login')
        return Observable.from(Promise.reject(new Error("No token found"))); // Handle case where no token
    } else {
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
    }
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