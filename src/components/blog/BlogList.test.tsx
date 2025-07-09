import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BlogList from './BlogList';

// Importar el mock después de definirlo
import { ContentfulService } from '../../services/contentful';
import { likesService } from '../../services/likesService';
import { commentsService } from '../../services/commentsService';

// Mock de useTranslation
const mockUseTranslation = jest.fn();
jest.mock('react-i18next', () => ({
  useTranslation: () => mockUseTranslation(),
}));

// Mock del servicio de Contentful
jest.mock('../../services/contentful', () => ({
  ContentfulService: {
    getBlogs: jest.fn(),
  },
}));

// Mock del Loader
jest.mock('../shared/Loader', () => () => (
  <div data-testid='loader'>Loader</div>
));

// Mock de los servicios de likes y comentarios para BlogList
jest.mock('../../services/likesService', () => ({
  likesService: {
    getLikes: jest.fn().mockResolvedValue({ likes: 0, dislikes: 0 }),
    addLike: jest.fn().mockResolvedValue(undefined),
    addDislike: jest.fn().mockResolvedValue(undefined),
    getUserVote: jest.fn().mockReturnValue(null),
  },
}));

jest.mock('../../services/commentsService', () => ({
  commentsService: {
    getComments: jest.fn().mockResolvedValue([]),
    addComment: jest.fn().mockResolvedValue(undefined),
  },
}));

// Función helper para renderizar con Router
const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe('BlogList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset específico de los mocks de servicios
    jest
      .mocked(likesService.getLikes)
      .mockResolvedValue({ likes: 0, dislikes: 0 });
    jest.mocked(likesService.getUserVote).mockReturnValue(null);
    jest.mocked(commentsService.getComments).mockResolvedValue([]);

    // Configurar el mock por defecto
    mockUseTranslation.mockReturnValue({
      t: (key: string) => {
        const translations: { [key: string]: string } = {
          'blog.noPosts': 'No hay posts disponibles',
          'blog.readMore': 'Leer más',
        };
        return translations[key] || key;
      },
      i18n: { language: 'es' },
    });
  });

  it('muestra el loader mientras carga', () => {
    (ContentfulService.getBlogs as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    ); // Promise que nunca se resuelve
    renderWithRouter(<BlogList />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('muestra error cuando falla la carga', async () => {
    (ContentfulService.getBlogs as jest.Mock).mockRejectedValue(
      new Error('Network error')
    );
    renderWithRouter(<BlogList />);

    await waitFor(() => {
      expect(screen.getByText('Error al cargar los blogs')).toBeInTheDocument();
    });
  });

  it('muestra mensaje cuando no hay blogs', async () => {
    (ContentfulService.getBlogs as jest.Mock).mockResolvedValue([]);
    renderWithRouter(<BlogList />);

    await waitFor(() => {
      expect(screen.getByText('No hay posts disponibles')).toBeInTheDocument();
    });
  });

  it('renderiza lista de blogs correctamente', async () => {
    const mockBlogs = [
      {
        title: 'Primer Blog',
        slug: 'primer-blog',
        summary: 'Resumen del primer blog',
        author: 'Autor 1',
        publishDate: '2024-07-08T12:00:00Z',
        featuredImage: {
          fields: {
            file: { url: 'https://example.com/imagen1.jpg' },
          },
        },
      },
      {
        title: 'Segundo Blog',
        slug: 'segundo-blog',
        summary: 'Resumen del segundo blog',
        author: 'Autor 2',
        publishDate: '2024-07-09T12:00:00Z',
        featuredImage: null,
      },
    ];

    (ContentfulService.getBlogs as jest.Mock).mockResolvedValue(mockBlogs);
    renderWithRouter(<BlogList />);

    await waitFor(() => {
      expect(screen.getByText('Primer Blog')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Segundo Blog')).toBeInTheDocument();
    });

    expect(screen.getByText('7/8/2024')).toBeInTheDocument();
    expect(screen.getByText('7/9/2024')).toBeInTheDocument();
    // Ya no se muestra resumen ni autor en la tarjeta
    // Solo se verifica título, fecha y botón 'Leer más'
    expect(screen.getAllByText('Leer más').length).toBe(2);
  });

  it('renderiza blogs con imágenes destacadas', async () => {
    const mockBlogs = [
      {
        title: 'Blog con imagen',
        slug: 'blog-con-imagen',
        summary: 'Blog que tiene imagen destacada',
        author: 'Autor',
        publishDate: '2024-07-08T12:00:00Z',
        featuredImage: {
          fields: {
            file: { url: 'https://example.com/imagen.jpg' },
          },
        },
      },
    ];

    (ContentfulService.getBlogs as jest.Mock).mockResolvedValue(mockBlogs);
    renderWithRouter(<BlogList />);

    await waitFor(() => {
      const imagen = screen.getByRole('img', { name: /blog con imagen/i });
      expect(imagen).toHaveAttribute('src', 'https://example.com/imagen.jpg');
    });
  });

  it('renderiza blogs sin imágenes destacadas', async () => {
    const mockBlogs = [
      {
        title: 'Blog sin imagen',
        slug: 'blog-sin-imagen',
        summary: 'Blog que no tiene imagen destacada',
        author: 'Autor',
        publishDate: '2024-07-08T12:00:00Z',
        featuredImage: null,
      },
    ];

    (ContentfulService.getBlogs as jest.Mock).mockResolvedValue(mockBlogs);
    renderWithRouter(<BlogList />);

    await waitFor(() => {
      expect(screen.getByText('Blog sin imagen')).toBeInTheDocument();
    });

    // Verificar que no hay imagen de portada (excluir emojis)
    const images = screen.queryAllByRole('img');
    const realImages = images.filter(img => img.tagName === 'IMG');
    expect(realImages).toHaveLength(0);
  });

  it('renderiza enlaces correctos a los blogs', async () => {
    const mockBlogs = [
      {
        title: 'Blog de prueba',
        slug: 'blog-de-prueba',
        summary: 'Resumen del blog',
        author: 'Autor',
        publishDate: '2024-07-08T12:00:00Z',
        featuredImage: null,
      },
    ];

    (ContentfulService.getBlogs as jest.Mock).mockResolvedValue(mockBlogs);
    renderWithRouter(<BlogList />);

    await waitFor(() => {
      const enlace = screen.getByRole('link', { name: /leer más/i });
      expect(enlace).toHaveAttribute('href', '/blog/blog-de-prueba');
    });
  });

  it('renderiza múltiples blogs en grid', async () => {
    const mockBlogs = [
      {
        title: 'Blog 1',
        slug: 'blog-1',
        summary: 'Resumen 1',
        author: 'Autor 1',
        publishDate: '2024-07-08T12:00:00Z',
        featuredImage: null,
      },
      {
        title: 'Blog 2',
        slug: 'blog-2',
        summary: 'Resumen 2',
        author: 'Autor 2',
        publishDate: '2024-07-09T12:00:00Z',
        featuredImage: null,
      },
      {
        title: 'Blog 3',
        slug: 'blog-3',
        summary: 'Resumen 3',
        author: 'Autor 3',
        publishDate: '2024-07-10T12:00:00Z',
        featuredImage: null,
      },
    ];

    (ContentfulService.getBlogs as jest.Mock).mockResolvedValue(mockBlogs);
    renderWithRouter(<BlogList />);

    await waitFor(() => {
      expect(screen.getByText('Blog 1')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Blog 2')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Blog 3')).toBeInTheDocument();
    });

    // Verificar que hay 3 enlaces "Leer más"
    const enlaces = screen.getAllByRole('link', { name: /leer más/i });
    expect(enlaces).toHaveLength(3);
  });

  it('maneja blogs con datos incompletos', async () => {
    const mockBlogs = [
      {
        title: 'Blog incompleto',
        slug: 'blog-incompleto',
        summary: null,
        author: null,
        publishDate: null,
        featuredImage: null,
      },
    ];

    (ContentfulService.getBlogs as jest.Mock).mockResolvedValue(mockBlogs);
    renderWithRouter(<BlogList />);

    await waitFor(() => {
      expect(screen.getByText('Blog incompleto')).toBeInTheDocument();
    });

    // Verificar que se renderiza sin errores aunque falten datos
    expect(screen.getByRole('link', { name: /leer más/i })).toBeInTheDocument();
  });

  it('cambia idioma cuando cambia i18n.language', async () => {
    const mockBlogs = [
      {
        title: 'Blog en español',
        slug: 'blog-es',
        summary: 'Resumen en español',
        author: 'Autor',
        publishDate: '2024-07-08T12:00:00Z',
        featuredImage: null,
      },
    ];

    (ContentfulService.getBlogs as jest.Mock).mockResolvedValue(mockBlogs);
    const { rerender } = renderWithRouter(<BlogList />);

    await waitFor(() => {
      expect(ContentfulService.getBlogs).toHaveBeenCalledWith('es');
    });

    // Simular cambio de idioma
    (ContentfulService.getBlogs as jest.Mock).mockClear();
    (ContentfulService.getBlogs as jest.Mock).mockResolvedValue(mockBlogs);

    // Cambiar el mock para inglés
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      i18n: { language: 'en' },
    });

    rerender(
      <MemoryRouter>
        <BlogList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(ContentfulService.getBlogs).toHaveBeenCalledWith('en');
    });
  });
});
