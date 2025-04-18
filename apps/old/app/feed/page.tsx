"use client"
import Post from "@/components/post";
import { Header } from "../utils";
import RelayEnvironment from "../utils/RelayEnvironment";
import FlatList from 'flatlist-react'
import { graphql } from "relay-runtime";
import { useLazyLoadQuery } from "react-relay";
import { pageFeedQuery, pageFeedQuery$data } from "./__generated__/pageFeedQuery.graphql";

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

const FeedQuery = graphql`
  query pageFeedQuery($first: Int! $after: String) {
    feed(first: $first, after: $after) {
      edges {
        node {
          id title content author {id name} createdAt voteCount hasVoted
        }
        cursor
      }
      pageInfo { hasNextPage }
    }
  }
`

export default function FeedPage() {
  // const session = useSessionStore()
  const data: pageFeedQuery$data = useLazyLoadQuery<pageFeedQuery>(FeedQuery, {
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
