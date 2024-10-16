import { getPostContent } from '@/lib/notion';
import { notFound } from 'next/navigation';

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPostContent(params.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">{new Date(post.date).toLocaleDateString()}</p>
      <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
}