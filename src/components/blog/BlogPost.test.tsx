import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import BlogPost from './BlogPost';

// Importar el mock después de definirlo
import { ContentfulService } from '../../services/contentful';

// Mock de useParams para simular el slug
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ slug: 'test-post' }),
  Link: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

// Mock de useTranslation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'es' } }),
}));

// Mock del Loader
jest.mock('../shared/Loader', () => () => (
  <div data-testid='loader'>Loader</div>
));

// Mock del servicio de Contentful
jest.mock('../../services/contentful', () => ({
  ContentfulService: {
    getBlog: jest.fn(),
  },
}));

describe('BlogPost', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('muestra el loader mientras carga', () => {
    (ContentfulService.getBlog as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    ); // Promise que nunca se resuelve
    render(<BlogPost />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('muestra error cuando no se encuentra el post', async () => {
    (ContentfulService.getBlog as jest.Mock).mockRejectedValue(
      new Error('Blog post not found')
    );
    render(<BlogPost />);

    await waitFor(() => {
      expect(screen.getByText('Error al cargar el post')).toBeInTheDocument();
    });
  });

  it('renderiza el post cuando se carga correctamente', async () => {
    const mockPost = {
      title: 'Título de prueba',
      slug: 'test-post',
      author: 'Autor de prueba',
      publishDate: '2024-07-08T12:00:00Z',
      featuredImage: {
        fields: {
          file: { url: 'https://example.com/portada.jpg' },
        },
      },
      content: {
        nodeType: 'document',
        content: [
          {
            nodeType: 'paragraph',
            content: [
              { nodeType: 'text', value: 'Contenido de prueba', marks: [] },
            ],
          },
        ],
      },
      summary: 'Resumen de prueba',
    };

    (ContentfulService.getBlog as jest.Mock).mockResolvedValue(mockPost);
    render(<BlogPost />);

    await waitFor(() => {
      expect(screen.getByText('Título de prueba')).toBeInTheDocument();
    });

    expect(screen.getByText('Autor de prueba')).toBeInTheDocument();
    expect(screen.getByText('Contenido de prueba')).toBeInTheDocument();
  });

  it('renderiza contenido con diferentes tipos de Rich Text', async () => {
    const mockPost = {
      title: 'Post con Rich Text completo',
      slug: 'test-post',
      author: 'Autor',
      publishDate: '2024-07-08T12:00:00Z',
      featuredImage: null,
      content: {
        nodeType: 'document',
        content: [
          {
            nodeType: 'heading-1',
            content: [{ nodeType: 'text', value: 'Título H1', marks: [] }],
          },
          {
            nodeType: 'heading-2',
            content: [{ nodeType: 'text', value: 'Título H2', marks: [] }],
          },
          {
            nodeType: 'paragraph',
            content: [
              { nodeType: 'text', value: 'Texto normal ', marks: [] },
              { nodeType: 'text', value: 'en negrita', marks: ['bold'] },
              { nodeType: 'text', value: ' y ', marks: [] },
              { nodeType: 'text', value: 'cursiva', marks: ['italic'] },
              { nodeType: 'text', value: ' y ', marks: [] },
              { nodeType: 'text', value: 'código', marks: ['code'] },
            ],
          },
          {
            nodeType: 'ul-list',
            content: [
              {
                nodeType: 'list-item',
                content: [{ nodeType: 'text', value: 'Elemento 1', marks: [] }],
              },
              {
                nodeType: 'list-item',
                content: [{ nodeType: 'text', value: 'Elemento 2', marks: [] }],
              },
            ],
          },
          {
            nodeType: 'quote',
            content: [
              { nodeType: 'text', value: 'Cita importante', marks: [] },
            ],
          },
        ],
      },
      summary: 'Resumen',
    };

    (ContentfulService.getBlog as jest.Mock).mockResolvedValue(mockPost);
    render(<BlogPost />);

    await waitFor(() => {
      expect(screen.getByText('Título H1')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Título H2')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Elemento 1')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Elemento 2')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Cita importante')).toBeInTheDocument();
    });

    // Verificar que el párrafo contiene el texto con formato
    const parrafo = screen.getByText((content, element) => {
      return (
        element?.tagName.toLowerCase() === 'p' &&
        !!element.textContent?.includes('Texto normal') &&
        !!element.textContent?.includes('en negrita') &&
        !!element.textContent?.includes('cursiva') &&
        !!element.textContent?.includes('código')
      );
    });
    expect(parrafo).toBeInTheDocument();
  });

  it('renderiza contenido como HTML cuando no es Rich Text', async () => {
    const mockPost = {
      title: 'Post con HTML',
      slug: 'test-post',
      author: 'Autor',
      publishDate: '2024-07-08T12:00:00Z',
      featuredImage: null,
      content: '<p>Contenido <strong>HTML</strong> directo</p>',
      summary: 'Resumen',
    };

    (ContentfulService.getBlog as jest.Mock).mockResolvedValue(mockPost);
    render(<BlogPost />);

    await waitFor(() => {
      expect(screen.getByText('HTML')).toBeInTheDocument();
    });
  });

  it('muestra el resumen cuando no hay contenido', async () => {
    const mockPost = {
      title: 'Post sin contenido',
      slug: 'test-post',
      author: 'Autor',
      publishDate: '2024-07-08T12:00:00Z',
      featuredImage: null,
      content: null,
      summary: 'Este es el resumen del post',
    };

    (ContentfulService.getBlog as jest.Mock).mockResolvedValue(mockPost);
    render(<BlogPost />);

    await waitFor(() => {
      expect(
        screen.getByText('Este es el resumen del post')
      ).toBeInTheDocument();
    });
  });

  it('renderiza post sin imagen de portada', async () => {
    const mockPost = {
      title: 'Post sin portada',
      slug: 'test-post',
      author: 'Autor',
      publishDate: '2024-07-08T12:00:00Z',
      featuredImage: null,
      content: {
        nodeType: 'document',
        content: [
          {
            nodeType: 'paragraph',
            content: [
              { nodeType: 'text', value: 'Contenido sin imagen', marks: [] },
            ],
          },
        ],
      },
      summary: 'Resumen',
    };

    (ContentfulService.getBlog as jest.Mock).mockResolvedValue(mockPost);
    render(<BlogPost />);

    await waitFor(() => {
      expect(screen.getByText('Post sin portada')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Contenido sin imagen')).toBeInTheDocument();
    });

    // Verifica que no hay imagen de portada
    const imagenes = screen.queryAllByRole('img');
    expect(imagenes).toHaveLength(0);
  });

  it('maneja errores específicos de Contentful', async () => {
    (ContentfulService.getBlog as jest.Mock).mockRejectedValue(
      new Error('Network error')
    );
    render(<BlogPost />);

    await waitFor(() => {
      expect(screen.getByText('Error al cargar el post')).toBeInTheDocument();
    });
  });

  it('renderiza contenido con heading-3', async () => {
    const mockPost = {
      title: 'Post con H3',
      slug: 'test-post',
      author: 'Autor',
      publishDate: '2024-07-08T12:00:00Z',
      featuredImage: null,
      content: {
        nodeType: 'document',
        content: [
          {
            nodeType: 'heading-3',
            content: [{ nodeType: 'text', value: 'Título H3', marks: [] }],
          },
        ],
      },
      summary: 'Resumen',
    };

    (ContentfulService.getBlog as jest.Mock).mockResolvedValue(mockPost);
    render(<BlogPost />);

    await waitFor(() => {
      expect(screen.getByText('Título H3')).toBeInTheDocument();
    });
  });

  it('renderiza listas ordenadas', async () => {
    const mockPost = {
      title: 'Post con lista ordenada',
      slug: 'test-post',
      author: 'Autor',
      publishDate: '2024-07-08T12:00:00Z',
      featuredImage: null,
      content: {
        nodeType: 'document',
        content: [
          {
            nodeType: 'ol-list',
            content: [
              {
                nodeType: 'list-item',
                content: [
                  { nodeType: 'text', value: 'Primer elemento', marks: [] },
                ],
              },
              {
                nodeType: 'list-item',
                content: [
                  { nodeType: 'text', value: 'Segundo elemento', marks: [] },
                ],
              },
            ],
          },
        ],
      },
      summary: 'Resumen',
    };

    (ContentfulService.getBlog as jest.Mock).mockResolvedValue(mockPost);
    render(<BlogPost />);

    await waitFor(() => {
      expect(screen.getByText('Primer elemento')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Segundo elemento')).toBeInTheDocument();
    });
  });

  it('maneja caso cuando no hay slug', async () => {
    // Mock useParams para retornar undefined
    jest.doMock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useParams: () => ({ slug: undefined }),
      Link: ({ children, ...props }: any) => <a {...props}>{children}</a>,
    }));

    render(<BlogPost />);

    // Debería mostrar el loader indefinidamente ya que no hay slug
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('maneja caso cuando post es null pero no hay error', async () => {
    (ContentfulService.getBlog as jest.Mock).mockResolvedValue(null);
    render(<BlogPost />);

    await waitFor(() => {
      expect(screen.getByText('Post no encontrado')).toBeInTheDocument();
    });
  });
});
