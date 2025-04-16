import { Header, useSessionStore } from "../utils";

const components: { title: string; href: string; description: string; imageSrc: string; }[] = [
  {
    title: 'Blue Altair',
    href:'https://bluealtair.com',
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

export default function FeedPage() {
  const session = useSessionStore()
  return (
    <>
      <Header components={components}/>
      {session.token}
    </>
  );
}
