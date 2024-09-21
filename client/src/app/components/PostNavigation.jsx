import Link from 'next/link';

const PostNavigation = ({ prevPost, nextPost }) => (<>
    <div className="flex justify-between py-4 xl:block xl:space-y-8 xl:py-8">
        {prevPost && (
            <div>
                <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Previous Article
                </h2>
                <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                    <Link href={`/posts/${prevPost._id}`}>{prevPost.title}</Link>
                </div>
            </div>
        )}
        {nextPost && (
            <div>
                <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Next Article
                </h2>
                <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                    <Link href={`/posts/${nextPost._id}`}>{nextPost.title}</Link>
                </div>
            </div>
        )}
    </div>

</>
);

export default PostNavigation;
