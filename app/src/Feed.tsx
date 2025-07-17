import React from "react";
// import { graphql } from "relay-runtime";
import { graphql } from "react-relay";
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

function FeedContent() {
    const data: FeedQuery$data = useLazyLoadQuery<FeedQuery>(feedQuery, {
        first: 10,
        after: null
    }, {
        fetchPolicy: 'store-or-network'
    })
    
    const value = data.feed?.edges?.map(v => v?.node) || []
    
    const listItems = [
        { id: 0, title: 'Hello World', content: 'Small post description', createdAt: new Date('1998-12-25'), author: 'yd', voteCount: 0, hasVoted: true },
        ...value,
    ];
    
    return (
        <>
            <Header components={components} />
            <div style={{ padding: '20px' }}>
                <h2>Feed ({listItems.length} items)</h2>
                {listItems.length === 1 ? (
                    <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
                        <p>No posts found in the database. Showing demo post only.</p>
                    </div>
                ) : null}
                <FlatList
                    list={listItems}
                    renderItem={v => {
                        if (!v) return <div>Empty item</div>;
                        
                        const authorName = typeof v.author === 'string' ? v.author : v.author?.name || 'unknown';
                        const createdAt = typeof v.createdAt === 'string' ? new Date(v.createdAt) : v.createdAt;
                        
                        return (
                            <div style={{ marginBottom: '10px' }}>
                                <Post 
                                    {...v} 
                                    key={v.id} 
                                    author={authorName} 
                                    createdAt={createdAt}
                                />
                            </div>
                        );
                    }}
                />
            </div>
        </>
    );
}

export default function FeedPage() {
  return (
    <FeedContent />
  );
}