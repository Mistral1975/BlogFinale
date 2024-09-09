// app/layouts/HomeLayout.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Link from 'next/link';
import { setList } from '../store/postsSlice';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TagsTitle from "../components/TagsTitle";

import List from '../components/List';

const HomeLayout = () => {

  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const postsList = useSelector(state => state.postblog.postsList);

  useEffect(() => {
    fetch('http://localhost:8000/list', { // recupera la lista dei Post dal DB
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `bearer ${user.accessToken}`
      },
    }).then(async res => {
      const jsonRes = await res.json();
      //console.log(`lista caricata`, jsonRes);
      dispatch(setList(jsonRes));
    }).catch(error => {
      console.error('Errore nel recuperare i post:', error);
    })
  }, []);


  const lastFivePosts = postsList.length ?
    postsList.slice() // Crea una copia di postsList
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Ordina per data di creazione (discendente)
      .slice(0, 5) // Ottieni i primi 5 elementi
    : [];

  return (
    <>
      <Header />
      <main>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <TagsTitle />
          <List items={lastFivePosts} />
        </div>

        {/* <!-- BLOCCO TUTTI I POST (All Posts →) --> */}
        <div className="flex justify-end text-base font-medium leading-6">
          <Link href="/blog" className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">All Posts →</Link>
        </div>
        {/* <!-- FINE BLOCCO TUTTI I POST (All Posts →) --> */}
      </main>
      <Footer />
    </>
  )
}

export default HomeLayout;