import { createClient } from 'contentful';
import { contentfulConfig } from '../config/contentful';

const client = createClient({
  space: contentfulConfig.space,
  accessToken: contentfulConfig.accessToken,
  environment: contentfulConfig.environment,
});

// Función helper para convertir URLs HTTP a HTTPS
const ensureHttps = (url: string): string => {
  if (!url) return url;
  return url.replace(/^http:/, 'https:');
};

// Función helper para procesar imágenes y asegurar HTTPS
const processImage = (image: any) => {
  if (!image || !image.fields || !image.fields.file) return image;

  return {
    ...image,
    fields: {
      ...image.fields,
      file: {
        ...image.fields.file,
        url: ensureHttps(image.fields.file.url),
      },
    },
  };
};

export interface BlogPost {
  title: string;
  slug: string;
  content: any;
  summary: string;
  featuredImage: {
    fields: {
      file: {
        url: string;
      };
    };
  } | null;
  author: string;
  publishDate: string;
}

export const ContentfulService = {
  getBlogs: async (locale: string = 'es') => {
    try {
      // Verificar si las credenciales están configuradas
      if (!contentfulConfig.space || !contentfulConfig.accessToken) {
        return [];
      }

      const response = await client.getEntries({
        content_type: 'pageBlogPost',
        order: ['-fields.publishedDate'],
        locale: 'es',
      });

      return response.items.map((item: any) => {
        // Asegurarse de que author sea string
        let author = item.fields.author;
        if (typeof author === 'object' && author?.fields?.name) {
          author = author.fields.name;
        } else if (typeof author !== 'string') {
          author = 'Autor desconocido';
        }
        return {
          title: item.fields?.title || 'Sin título',
          slug: item.fields?.slug || 'sin-slug',
          content: item.fields?.content || null,
          summary: item.fields?.summary || 'Sin resumen disponible',
          featuredImage: item.fields?.featuredImage
            ? processImage(item.fields.featuredImage)
            : null,
          author,
          publishDate: item.fields?.publishedDate || new Date().toISOString(),
          seoDescription: item.fields?.componentSeo?.fields?.description || '',
        };
      });
    } catch (error) {
      // Retornar array vacío en lugar de lanzar error
      return [];
    }
  },

  getBlog: async (slug: string, locale: string = 'es') => {
    try {
      const response = await client.getEntries({
        content_type: 'pageBlogPost',
        'fields.slug': slug,
        locale: 'es',
      });

      if (response.items.length === 0) {
        throw new Error('Blog post not found');
      }

      const post = response.items[0];

      let author = post.fields.author;
      if (typeof author === 'object' && author?.fields?.name) {
        author = author.fields.name;
      } else if (typeof author !== 'string') {
        author = 'Autor desconocido';
      }

      return {
        title: post.fields.title,
        slug: post.fields.slug,
        content: post.fields.content,
        summary: post.fields.summary,
        featuredImage: post.fields.featuredImage
          ? processImage(post.fields.featuredImage)
          : null,
        author,
        publishDate: post.fields.publishedDate,
      };
    } catch (error) {
      throw error;
    }
  },
};
