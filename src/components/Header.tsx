// components/Header.js

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


const Header = () => {
  return (
    <div className='ml-2'>
    <header className="bg-white shadow-md p-4 flex justify-between items-center rounded ml-64 mr-8">
      <div>
        <h1 className="text-lg font-bold">Welcome Admin</h1>
        <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>
      <div className="flex items-center">
        <Link href="/notifications" className="relative mr-4">
          <FontAwesomeIcon icon={faBell} className="text-gray-600 hover:text-blue-500 transition-colors duration-200" />
          {/* Notification count (optional) */}
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">3</span>
        </Link>
        <Avatar>
  <AvatarImage src="https://github.com/shadcn.png" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>

      </div>
    </header>
    </div>
  );
};

export default Header;
