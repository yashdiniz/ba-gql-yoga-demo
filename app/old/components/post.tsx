import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";

type Props = {
    title: string;
    content: string | null | undefined;
    author: string;
    createdAt: Date;
    voteCount: number;
    hasVoted: boolean;
}

export default function Post({
    title, content, author, createdAt, voteCount, hasVoted,
}: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{`u/${author} - ${createdAt.toISOString()}`}</CardDescription>
                <CardContent>
                    {content}
                </CardContent>
                <CardFooter>
                    {voteCount} {voteCount == 1 ? 'vote' : 'votes'} - Has voted: {JSON.stringify(hasVoted)}
                </CardFooter>
            </CardHeader>
        </Card>
    )
}