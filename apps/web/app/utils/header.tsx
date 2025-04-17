import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils';
import React from 'react';

//@ts-ignore
export const fetcher = (...args) => fetch(...args).then(res => res.json())

type Components = { title: string; href: string; description: string; imageSrc: string; }[]

export function Header({components}:{components: Components}) {
    return (
    <header className='flex flex-wrap justify-between'>
      TODO: Blue Altair Logo
      <NavigationMenu className='[&_div.absolute]:-left-[170px]'>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              Welcome
            </NavigationMenuTrigger>
            <NavigationMenuContent>
            <ul className="grid w-[250px] gap-3 p-2">
              {
                components.map(c => (
                    <ListItem
                    key={c.title}
                    title={c.title}
                    href={c.href}
                    //@ts-ignore
                    src={c.imageSrc}
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
    )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
  //@ts-ignore
>(({ className, title, src, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "flex flex-row select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <Avatar>
            <AvatarImage src={src} alt='profile avatar'/>
            <AvatarFallback>BA</AvatarFallback>
          </Avatar>
          <div className='flex flex-col'>
            <span className="text-sm font-medium leading-none">{title}</span>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
