// app/layouts/UserLayout.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux"
import Link from 'next/link';
import { setList } from '../store/postsSlice';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useParams } from "next/navigation";
import { getAllTagsWithCounts } from '../selectors/postsSelectors';

const UserLayout = () => {

    const { id } = useParams();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    //const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:8000/list`, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            "Authorization": `bearer ${user.accessToken}`
          },
        }).then(async res => {
          const jsonRes = await res.json();
          dispatch(setList(jsonRes));
        }).catch(error => {
          console.error('Errore nel recuperare i post per tag:', error);
        });
      }, [id, dispatch, user.accessToken]);

    return (
        <>
            <Header />
            <main>
                <div className="flex flex-col items-start justify-start divide-y divide-gray-200 dark:divide-gray-700 md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0">
                    {/* <div className="space-x-2 pb-8 pt-6 md:space-y-5">
                        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:border-r-2 md:px-6 md:text-6xl md:leading-14">
                            Tags
                        </h1>
                    </div>
                    <div className="flex max-w-lg flex-wrap">
                        {tagsWithCounts.length === 0 && 'No tags found.'}
                        {tagsWithCounts.map(([tag, count]) => {
                            return (
                                <div key={tag} className="mb-2 mr-5 mt-2">
                                    <Link
                                        href={`/tags/${tag}`}
                                        className="mr-3 text-sm font-medium uppercase text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                                        aria-label={`View posts tagged ${tag}`}
                                    >
                                        {tag}
                                    </Link>

                                    <Link
                                        href={`/tags/${tag}`}
                                        className="-ml-2 text-sm font-semibold uppercase text-gray-600 dark:text-gray-300"
                                        aria-label={`View posts tagged ${tag}`}
                                    >
                                        {` (${count})`}
                                    </Link>
                                </div>
                            )
                        })}
                    </div> */}
                    <div className="mt-4">
                        {/* <form onSubmit={handleSubmit}> */}
                        <form>
                            <div>
                                <label htmlFor="title">Nome utente:</label>
                                <input className="dark:bg-gray-700" type="text" id="displayName" name="displayName" value={newPost.displayName} onChange={handleInputChange} required />
                            </div>
                            <div>
                                <label htmlFor="description">Email:</label>
                                <textarea className="dark:bg-gray-700" id="email" name="email" value={newPost.email} onChange={handleInputChange} required />
                            </div>
                            <div>
                                <label htmlFor="imageUrl">Image (url dell'avatar):</label>
                                <input className="dark:bg-gray-700" type="text" id="avatar" name="avatar" value={newPost.avatar} onChange={handleInputChange} />
                            </div>
                            <div className="pb-6 pt-6 text-sm text-gray-700 dark:text-gray-300">
                                <button type="submit" className="text-blue-500 hover:underline">Modifica</button>
                                {` • `}
                                <button type="button" onClick={closeForm} className="text-red-500 hover:underline">Annulla</button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}

export default UserLayout;