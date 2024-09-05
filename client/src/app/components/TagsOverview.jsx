import Link from 'next/link';
import { useSelector } from 'react-redux';
//import { getTagsWithCounts } from '../selectors/postsSelectors';
import { getAllTagsWithCounts } from '../selectors/postsSelectors';

import { useParams } from "next/navigation";

const TagsOverview = () => {
    const tagsWithCounts = useSelector(getAllTagsWithCounts);
    const params = useParams();
    const currentTag = params.tag;

    console.log("tag ---> ", currentTag)
    console.log("tagsWithCounts ---> ", tagsWithCounts)

    return (
        <>
            {/* <ul>
                {Object.keys(tagsWithCounts).map(tag => (
                    <li key={tag} className="my-3">
                        {currentTag === tag ? (
                            <h3 className="inline px-3 py-2 text-sm font-bold uppercase text-primary-500">
                                {tag} ({tagsWithCounts[tag]})
                            </h3>
                        ) : (
                            <Link
                                href={`/tags/${tag}`}
                                className="px-3 py-2 text-sm font-medium uppercase text-gray-500 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500"
                            >
                                {tag} ({tagsWithCounts[tag]})
                            </Link>
                        )}
                    </li>
                ))}
            </ul> */}

            <ul>
                {tagsWithCounts.map(([tag, count]) => (
                    <li key={tag} className="my-3">
                    {currentTag === tag ? (
                        <h3 className="inline px-3 py-2 text-sm font-bold uppercase text-primary-500">
                            {tag} ({count})
                        </h3>
                    ) : (
                        <Link
                            href={`/tags/${tag}`}
                            className="px-3 py-2 text-sm font-medium uppercase text-gray-500 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500"
                        >
                            {tag} ({count})
                        </Link>
                    )}
                </li>
                ))}
            </ul>
        </>
    );
};

export default TagsOverview;
