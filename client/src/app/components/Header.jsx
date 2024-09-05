import { Logo } from './Logo';
import Link from 'next/link';
import { useSelector } from "react-redux";
import { Welcome } from './Welcome';
import { useState } from 'react';
import Login from './LoginSignup/Login';


const Header = () => {
  const user = useSelector(state => state.user);
  const [openModal, setOpenModal] = useState(false);

  return (
    <header className="flex items-center justify-between py-10">
      <div>
        <Link href="/">
          <div className="flex items-center justify-between">
            <div className="mr-3">
              <Logo />
            </div>
            <div className="hidden h-6 text-2xl font-semibold sm:block">IL BLOG DI TNV</div>
          </div>
        </Link>
      </div>

      <div className="flex items-center space-x-4 leading-5 sm:space-x-6">
        <Link href="/blog" className="hidden font-medium text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400 sm:block">Blog</Link>
        <Link href="/tags" className="hidden font-medium text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400 sm:block">Tags</Link>

        {!user.email && (          
          <button className="openModalBtn" onClick={() => {setOpenModal(true)}}>Login</button>
        )}
        {openModal && <Login closeModal={setOpenModal} />}
        {user.email && <Welcome />}

      </div>
    </header>
  )
}

export default Header