import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ContentfulService } from '../../services/contentful';
import Loader from '../shared/Loader';
import { likesService } from '../../services/likesService';

const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t, i18n } = useTranslation();
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await ContentfulService.getBlogs(i18n.language);
        setBlogs(data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los blogs');
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [i18n.language]);

  // Cargar likes para todos los blogs
  useEffect(() => {
    if (blogs.length === 0) return;

    const loadLikes = async () => {
      const likesData: { [key: string]: number } = {};

      for (const blog of blogs) {
        try {
          const likes = await likesService.getLikes(blog.slug);
          likesData[blog.slug] = likes.likes;
        } catch (error) {
          console.error(`Error cargando likes para ${blog.slug}:`, error);
          likesData[blog.slug] = 0;
        }
      }

      setLikesMap(likesData);
    };

    loadLikes();
  }, [blogs]);

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[50vh]'>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center text-red-600 py-8'>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className='w-full flex flex-col items-center px-2 sm:px-4 lg:px-0 pt-4 pb-12 sm:pt-8 min-h-[70vh] bg-gray-100 dark:bg-gray-900'>
      <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-10 w-full max-w-7xl text-center px-2 sm:px-0'>
        Blogs
      </h1>
      {blogs.length === 0 ? (
        <div className='text-center text-gray-500 py-12'>
          <p>{t('blog.noPosts')}</p>
        </div>
      ) : (
        <div className='w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
          {blogs.map(blog => (
            <article
              key={blog.slug}
              className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full border border-gray-100 dark:border-gray-700'
            >
              {blog.featuredImage && (
                <div className='aspect-w-16 aspect-h-9 w-full bg-gray-200 dark:bg-gray-700'>
                  <img
                    src={blog.featuredImage.fields.file.url}
                    alt={blog.title}
                    className='w-full h-64 object-cover object-center'
                  />
                </div>
              )}
              <div className='flex flex-col flex-1 p-6'>
                <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2'>
                  {blog.title}
                </h2>
                <div className='flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1'>
                  <span>{new Date(blog.publishDate).toLocaleDateString()}</span>
                </div>
                {blog.seoDescription && (
                  <p className='text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 min-h-[3.5em]'>
                    {blog.seoDescription}
                  </p>
                )}
                <div className='mt-auto pt-2 flex items-center justify-between'>
                  <Link
                    to={`/blog/${blog.slug}`}
                    className='inline-flex items-center text-red-600 hover:text-red-700 font-medium'
                  >
                    {t('blog.readMore')}
                    <svg
                      className='ml-1 w-4 h-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 5l7 7-7 7'
                      />
                    </svg>
                  </Link>
                  <span className='flex items-center gap-1 ml-4'>
                    <span className='text-2xl' role='img' aria-label='likes'>
                      👍
                    </span>
                    <span className='text-lg font-semibold'>
                      {likesMap[blog.slug] ?? 0}
                    </span>
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;
