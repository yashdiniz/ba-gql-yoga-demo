import { objectType } from "nexus";
import { Reply } from "./Reply";

export const User = objectType({
    name: 'User',
    definition(t){
        t.field('replies', {
            type: Reply,
            description: 'Replies by the `User`',
        })
    }
})