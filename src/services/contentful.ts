import { createClient } from 'contentful';
import { contentfulConfig } from '../config/contentful';

const client = createClient({
  space: contentfulConfig.space,
  accessToken: contentfulConfig.accessToken,
  environment: contentfulConfig.environment,
});

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
        console.log(
          'Contentful credentials not configured, returning empty array'
        );
        return [];
      }

      console.log('Fetching blogs with params:', {
        content_type: 'pageBlogPost',
        order: ['-fields.publishedDate'],
        locale: 'es',
      });

      const response = await client.getEntries({
        content_type: 'pageBlogPost',
        order: ['-fields.publishedDate'],
        locale: 'es',
      });

      console.log('Total blogs found:', response.total);
      console.log('Blogs items:', response.items);

      return response.items.map((item: any) => {
        console.log('Processing blog item:', item);
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
          featuredImage: item.fields?.featuredImage || null,
          author,
          publishDate: item.fields?.publishedDate || new Date().toISOString(),
        };
      });
    } catch (error) {
      console.error('Error fetching blogs:', error);
      // Retornar array vacío en lugar de lanzar error
      return [];
    }
  },

  getBlog: async (slug: string, locale: string = 'es') => {
    try {
      console.log('Fetching single blog with slug:', slug);

      const response = await client.getEntries({
        content_type: 'pageBlogPost',
        'fields.slug': slug,
        locale: 'es',
      });

      console.log('Single blog response:', response);

      if (response.items.length === 0) {
        throw new Error('Blog post not found');
      }

      const post = response.items[0];
      console.log('Fetched post:', post);

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
        featuredImage: post.fields.featuredImage || null,
        author,
        publishDate: post.fields.publishedDate,
      };
    } catch (error) {
      console.error('Error fetching blog:', error);
      throw error;
    }
  },
};
