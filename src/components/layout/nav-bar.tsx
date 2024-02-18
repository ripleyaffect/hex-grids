'use client';

import { FC } from 'react';
import { ThemeToggle } from '~/components/theme/theme-toggle';
import { Hexagon } from 'lucide-react';

const Logo: FC = () => {
  return (
    <span className="flex">
      <Hexagon />
      <span className="ml-2 font-semibold">
        Hex Grids
      </span>
    </span>
  )
}

export const NavBar: FC = () => {
  return (
    <div className="sticky w-full px-4 top-0 z-50 h-12 bg-background">
      <div className="flex justify-between items-center w-full h-full">
        <Logo />
        <ThemeToggle />
      </div>
    </div>
  )
}
