import { Logo } from './Logo';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { logout } from '../store/userSlice';
import Login from './LoginSignup/Login';
import Signup from './LoginSignup/Signup';
import Avatar from './Avatar';

const Header = () => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [openModalSignup, setOpenModalSignup] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="flex items-center justify-between py-10">
      <div>
        <Link href="/">
          <div className="flex items-center justify-between">
            <div className="mr-3">
              <Logo />
            </div>
            <div className="hidden h-6 text-2xl font-semibold sm:block hover:text-primary-500">IL BLOG DI TNV</div>
          </div>
        </Link>
      </div>

      <div className="flex items-center space-x-4 leading-5 sm:space-x-6">

        <Link href="/blog" className="hidden font-medium text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400 sm:block">Blog</Link>
        <Link href="/tags" className="hidden font-medium text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400 sm:block">Tags</Link>

        <div className="w-1 h-12 bg-gray-500 mx-4"> | </div>

        {!user.email && (
          <>
            <button className="openModalBtn hover:text-primary-500" onClick={() => setOpenModal(true)}>Login</button>
            <button className="openModalBtn hover:text-primary-500" onClick={() => setOpenModalSignup(true)}>Signup</button>
          </>
        )}

        {openModal && <Login closeModal={setOpenModal} />}
        {openModalSignup && <Signup closeModal={setOpenModalSignup} />}

        {user.name && (
          <div className="flex items-center space-x-4">
            <Avatar displayName={user.name} />
            <button className="logoutBtn hover:text-primary-500" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
