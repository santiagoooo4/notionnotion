import { getPosts } from '@/lib/notion';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function Home() {
  try {
    const posts = await getPosts();

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Mi Blog</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link href={`/post/${post.id}`} key={post.id}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>{new Date(post.date).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{post.excerpt}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching posts:', error);
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Error</h1>
        <p>There was an error fetching the blog posts. Please check your Notion API configuration and try again.</p>
      </div>
    );
  }
}