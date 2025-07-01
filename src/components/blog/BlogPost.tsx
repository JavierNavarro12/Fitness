import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ContentfulService } from '../../services/contentful';
import Loader from '../shared/Loader';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      try {
        console.log('BlogPost: Fetching post with slug:', slug);
        const data = await ContentfulService.getBlog(slug, i18n.language);
        console.log('BlogPost: Post data received:', data);
        setPost(data);
        setLoading(false);
      } catch (err) {
        console.error('BlogPost: Error fetching post:', err);
        setError('Error al cargar el post');
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, i18n.language]);

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[50vh]'>
        <Loader />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-red-600 mb-4'>
            {error || 'Post no encontrado'}
          </h1>
          <Link
            to='/blog'
            className='text-red-600 hover:text-red-700 font-medium'
          >
            ← Volver al blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      <Link
        to='/blog'
        className='inline-flex items-center text-red-600 hover:text-red-700 font-medium mb-8'
      >
        <svg
          className='mr-2 w-4 h-4'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M15 19l-7-7 7-7'
          />
        </svg>
        {t('blog.backToList')}
      </Link>

      {post.featuredImage && (
        <div className='mb-8'>
          <img
            src={post.featuredImage.fields.file.url}
            alt={post.title}
            className='w-full h-64 md:h-96 object-cover rounded-lg'
          />
        </div>
      )}

      <header className='mb-8'>
        <h1 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
          {post.title}
        </h1>
        <div className='flex items-center text-gray-600 dark:text-gray-400 text-sm'>
          <span className='mr-4'>{post.author}</span>
          <span>{new Date(post.publishDate).toLocaleDateString()}</span>
        </div>
      </header>

      <div className='prose prose-lg max-w-none dark:prose-invert'>
        <div className='text-gray-700 dark:text-gray-300 leading-relaxed'>
          {post.content && post.content.nodeType ? (
            documentToReactComponents(post.content)
          ) : post.content && typeof post.content === 'string' ? (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : (
            <p>{post.summary}</p>
          )}
        </div>
      </div>
    </article>
  );
};

export default BlogPost;
