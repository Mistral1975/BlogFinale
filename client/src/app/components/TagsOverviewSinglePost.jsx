import Link from 'next/link';
import { useSelector } from 'react-redux';
import { getTagsForSinglePost } from '../selectors/postsSelectors';

const TagsOverviewSinglePost = ({ postId }) => {
    const tags = useSelector(state => getTagsForSinglePost(state, postId));

    return (
        <div className="flex flex-wrap">
            {
                tags.map(tag => (
                    <Link
                        href={`/tags/${tag}`}
                        className="mr-3 text-sm font-medium uppercase text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                    >
                        {tag}
                    </Link>
                ))
            }
        </div>
    );
};

export default TagsOverviewSinglePost;
