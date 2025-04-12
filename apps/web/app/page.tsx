import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils';
import React from 'react';

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

export default function Home() {
  return (
    <header>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              {
              //TODO: add trigger
              }
            </NavigationMenuTrigger>
            <NavigationMenuContent>
            <ul className="grid w-[300px] gap-3 p-4">
              {
                components.map(c => (
                  <ListItem
                  key={c.title}
                  title={c.title}
                  href={c.href}
                  >
                    {c.description}
                  </ListItem>
                ))
              }
            </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
