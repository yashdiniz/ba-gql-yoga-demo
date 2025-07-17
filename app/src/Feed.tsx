// import { graphql } from "relay-runtime";
import { graphql } from "react-relay";
import RelayEnvironment from "./utils/RelayEnvironment";
import { Header } from "./utils";
import { useLazyLoadQuery } from "react-relay";
import FlatList from 'flatlist-react';
import Post from "./components/post";
import { FeedQuery$data, FeedQuery } from "./__generated__/FeedQuery.graphql";

const components: { title: string; href: string; description: string; imageSrc: string; }[] = [
    {
        title: 'Blue Altair',
        href: 'https://bluealtair.com',
        description: 'Blue Altair Homepage',
        imageSrc: '/favicon.webp',
    },
    {
        title: 'Profile',
        href: '/profile',
        description: 'Your profile on BA Social',
        imageSrc: '/avatar.svg',
    },
]

const feedQuery = graphql`
query FeedQuery($first: Int! $after: String) {
    feed(first: $first, after: $after) {
        edges {
            node { id title content author {id name} createdAt voteCount hasVoted }
            cursor
        }
        pageInfo { hasNextPage }
    }
}
`

export default function FeedPage() {
    // const session = useSessionStore()
    const data: FeedQuery$data = useLazyLoadQuery<FeedQuery>(feedQuery, {
        first: 0
    })
    const value = data.feed?.edges?.map(v => v?.node)
    if (!value) {
        return <div>
            Error
        </div>
    }
    return (
        <RelayEnvironment>
            <Header components={components} />
            <FlatList
                list={[
                    { id: 0, title: 'Hello World', content: 'Small post description', createdAt: new Date('1998-12-25'), author: 'yd', voteCount: 0, hasVoted: true },
                    ...value,
                ]}
                renderItem={v => v ? <Post {...v} key={v.id} author={v.author.toString()} /> : <></>}
            />
        </RelayEnvironment>
    );
}