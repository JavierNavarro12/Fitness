import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ContentfulService } from '../../services/contentful';
import Loader from '../shared/Loader';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, MARKS } from '@contentful/rich-text-types';
import { likesService } from '../../services/likesService';
import { commentsService, BlogComment } from '../../services/commentsService';
import { auth } from '../../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

// Función helper para convertir URLs HTTP a HTTPS
const ensureHttps = (url: string): string => {
  if (!url) return url;
  return url.replace(/^http:/, 'https:');
};

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t, i18n } = useTranslation();
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userVote, setUserVote] = useState<'like' | 'dislike' | null>(null);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
    });
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // Opciones personalizadas para el renderizado del rich text
  const richTextOptions = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node: any, children: any) => (
        <p className='mb-4 leading-relaxed'>{children}</p>
      ),
      [BLOCKS.HEADING_1]: (node: any, children: any) => (
        <h1 className='text-3xl font-bold mb-6 mt-8 text-gray-900 dark:text-gray-100'>
          {children}
        </h1>
      ),
      [BLOCKS.HEADING_2]: (node: any, children: any) => (
        <h2 className='text-2xl font-bold mb-4 mt-6 text-gray-900 dark:text-gray-100'>
          {children}
        </h2>
      ),
      [BLOCKS.HEADING_3]: (node: any, children: any) => (
        <h3 className='text-xl font-bold mb-3 mt-5 text-gray-900 dark:text-gray-100'>
          {children}
        </h3>
      ),
      [BLOCKS.UL_LIST]: (node: any, children: any) => (
        <ul className='list-disc list-inside mb-4 space-y-2'>{children}</ul>
      ),
      [BLOCKS.OL_LIST]: (node: any, children: any) => (
        <ol className='list-decimal list-inside mb-4 space-y-2'>{children}</ol>
      ),
      [BLOCKS.LIST_ITEM]: (node: any, children: any) => (
        <li className='ml-4'>{children}</li>
      ),
      [BLOCKS.QUOTE]: (node: any, children: any) => (
        <blockquote className='border-l-4 border-red-500 pl-6 py-2 mb-4 italic text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-r-lg'>
          {children}
        </blockquote>
      ),
      [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
        const { file, title, description } = node.data.target.fields;
        return (
          <img
            src={ensureHttps(file.url)}
            alt={title || description || 'Imagen del blog'}
            className='my-6 rounded-lg shadow-lg mx-auto w-full max-w-xs'
            style={{ maxWidth: '400px' }}
          />
        );
      },
      [BLOCKS.EMBEDDED_ENTRY]: (node: any) => {
        const fields = node.data.target.fields;
        // Si tiene un campo image
        if (fields.image && fields.image.fields && fields.image.fields.file) {
          return (
            <img
              src={ensureHttps(fields.image.fields.file.url)}
              alt={fields.title || 'Imagen embebida'}
              className='my-6 rounded-lg shadow-lg mx-auto w-full max-w-xs'
              style={{ maxWidth: '400px' }}
            />
          );
        }
        // Si tiene un campo file directamente
        if (fields.file && fields.file.url) {
          return (
            <img
              src={ensureHttps(fields.file.url)}
              alt={fields.title || 'Imagen embebida'}
              className='my-6 rounded-lg shadow-lg mx-auto w-full max-w-xs'
              style={{ maxWidth: '400px' }}
            />
          );
        }
        // Si no, muestra un aviso
        return (
          <div style={{ color: 'red' }}>
            No se pudo renderizar la imagen embebida
          </div>
        );
      },
    },
    renderMark: {
      [MARKS.BOLD]: (text: any) => (
        <strong className='font-bold'>{text}</strong>
      ),
      [MARKS.ITALIC]: (text: any) => <em className='italic'>{text}</em>,
      [MARKS.CODE]: (text: any) => (
        <code className='bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono'>
          {text}
        </code>
      ),
    },
  };

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      try {
        const data = await ContentfulService.getBlog(slug, i18n.language);
        setPost(data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar el post');
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, i18n.language]);

  // Likes/dislikes
  useEffect(() => {
    if (!slug) return;
    let mounted = true;
    likesService.getLikes(slug).then(res => {
      if (mounted) {
        setLikes(res.likes);
        setDislikes(res.dislikes);
      }
    });
    setUserVote(likesService.getUserVote(slug));
    return () => {
      mounted = false;
    };
  }, [slug]);

  // Cargar comentarios
  useEffect(() => {
    if (!slug) return;
    let mounted = true;
    commentsService.getComments(slug).then(res => {
      if (mounted) setComments(res);
    });
    return () => {
      mounted = false;
    };
  }, [slug]);

  const handleLike = async () => {
    if (!slug || userVote) return;
    await likesService.addLike(slug);
    setLikes(likes + 1);
    setUserVote('like');
  };
  const handleDislike = async () => {
    if (!slug || userVote) return;
    await likesService.addDislike(slug);
    setDislikes(dislikes + 1);
    setUserVote('dislike');
  };

  const handleAddComment = async () => {
    if (!slug || !newComment.trim() || !currentUser) return;
    setCommentLoading(true);
    setCommentError(null);
    try {
      await commentsService.addComment(slug, newComment.trim(), {
        displayName: currentUser.displayName || currentUser.email || 'Usuario',
        photoURL: currentUser.photoURL || '',
      });
      setNewComment('');
      // Recargar comentarios
      const updated = await commentsService.getComments(slug);
      setComments(updated);
    } catch (err) {
      setCommentError('Error al enviar el comentario');
    } finally {
      setCommentLoading(false);
    }
  };

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
          {/* <span className='mr-4'>{post.author}</span> */}
          <span>{new Date(post.publishDate).toLocaleDateString()}</span>
        </div>
      </header>

      <div className='text-gray-700 dark:text-gray-300'>
        {post.content && post.content.nodeType ? (
          documentToReactComponents(post.content, richTextOptions)
        ) : post.content && typeof post.content === 'string' ? (
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        ) : (
          <p>{post.summary}</p>
        )}
      </div>

      {/* Sección de Likes/Dislikes */}
      <div className='mt-10 flex flex-col items-center gap-2'>
        <div className='flex items-center gap-4'>
          <button
            onClick={handleLike}
            disabled={!!userVote}
            className={`px-4 py-2 rounded-full border flex items-center gap-1 transition ${userVote === 'like' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-green-50'}`}
            aria-label='Me gusta'
          >
            👍 <span>{likes}</span>
          </button>
          <button
            onClick={handleDislike}
            disabled={!!userVote}
            className={`px-4 py-2 rounded-full border flex items-center gap-1 transition ${userVote === 'dislike' ? 'bg-red-100 border-red-400 text-red-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-red-50'}`}
            aria-label='No me gusta'
          >
            👎 <span>{dislikes}</span>
          </button>
        </div>
        {userVote && (
          <span className='text-xs text-gray-500 mt-1'>
            Ya has votado este blog
          </span>
        )}
      </div>

      {/* Sección de Comentarios */}
      <div className='mt-12 max-w-2xl mx-auto w-full'>
        <h2 className='text-xl font-semibold mb-4'>Comentarios</h2>
        <div className='space-y-4 mb-6'>
          {comments.length === 0 && (
            <div className='text-gray-500 text-sm'>
              Sé el primero en comentar este blog.
            </div>
          )}
          {comments.map(c => (
            <div
              key={c.id}
              className='bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-gray-800 dark:text-gray-100 text-sm'
            >
              <div className='flex items-center gap-2 mb-1'>
                {c.userPhoto && (
                  <img
                    src={c.userPhoto}
                    alt={c.userName}
                    className='w-6 h-6 rounded-full'
                  />
                )}
                <span className='font-semibold'>{c.userName}</span>
                <span className='text-xs text-gray-400 ml-2'>
                  {c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}
                </span>
              </div>
              <span>{c.comment}</span>
            </div>
          ))}
        </div>
        <div className='flex gap-2'>
          <input
            type='text'
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            className='flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 dark:bg-gray-900 dark:border-gray-700'
            placeholder={
              currentUser
                ? 'Escribe un comentario...'
                : 'Inicia sesión para comentar'
            }
            maxLength={300}
            disabled={commentLoading || !currentUser}
          />
          <button
            onClick={handleAddComment}
            disabled={commentLoading || !newComment.trim() || !currentUser}
            className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50 text-sm'
          >
            Comentar
          </button>
        </div>
        {!currentUser && (
          <div className='text-red-500 text-xs mt-2'>
            Debes iniciar sesión para comentar.
          </div>
        )}
        {commentError && (
          <div className='text-red-500 text-xs mt-2'>{commentError}</div>
        )}
      </div>
    </article>
  );
};

export default BlogPost;
