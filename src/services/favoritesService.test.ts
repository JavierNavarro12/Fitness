import {
  getUserFavorites,
  addToFavorites,
  removeFromFavorites,
  UserFavorites,
} from './favoritesService';

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';

// Mock Firebase Firestore functions
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  arrayUnion: jest.fn(),
  arrayRemove: jest.fn(),
}));

// Mock the firebase config
jest.mock('../firebase', () => ({
  db: 'mockDb',
}));

const mockDoc = doc as jest.MockedFunction<typeof doc>;
const mockGetDoc = getDoc as jest.MockedFunction<typeof getDoc>;
const mockSetDoc = setDoc as jest.MockedFunction<typeof setDoc>;
const mockUpdateDoc = updateDoc as jest.MockedFunction<typeof updateDoc>;
const mockArrayUnion = arrayUnion as jest.MockedFunction<typeof arrayUnion>;
const mockArrayRemove = arrayRemove as jest.MockedFunction<typeof arrayRemove>;

// Mock console.error to avoid noise in tests
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

describe('FavoritesService', () => {
  const mockUid = 'test-user-123';
  const mockReportId = 'report-456';
  const mockDocRef = { id: 'mockDocRef' };

  beforeEach(() => {
    jest.clearAllMocks();
    mockDoc.mockReturnValue(mockDocRef as any);
    mockConsoleError.mockClear();
  });

  describe('getUserFavorites', () => {
    it('should return user favorites when document exists', async () => {
      const mockFavorites = ['report1', 'report2', 'report3'];
      const mockUserFavorites: UserFavorites = {
        uid: mockUid,
        favoriteReports: mockFavorites,
        updatedAt: new Date(),
      };

      const mockDocSnapshot = {
        exists: () => true,
        data: () => mockUserFavorites,
      };

      mockGetDoc.mockResolvedValueOnce(mockDocSnapshot as any);

      const result = await getUserFavorites(mockUid);

      expect(result).toEqual(mockFavorites);
      expect(mockDoc).toHaveBeenCalledWith('mockDb', 'userFavorites', mockUid);
      expect(mockGetDoc).toHaveBeenCalledWith(mockDocRef);
    });

    it('should return empty array when document does not exist', async () => {
      const mockDocSnapshot = {
        exists: () => false,
      };

      mockGetDoc.mockResolvedValueOnce(mockDocSnapshot as any);

      const result = await getUserFavorites(mockUid);

      expect(result).toEqual([]);
      expect(mockDoc).toHaveBeenCalledWith('mockDb', 'userFavorites', mockUid);
      expect(mockGetDoc).toHaveBeenCalledWith(mockDocRef);
    });

    it('should return empty array when favoriteReports is undefined', async () => {
      const mockUserFavorites = {
        uid: mockUid,
        favoriteReports: undefined,
        updatedAt: new Date(),
      };

      const mockDocSnapshot = {
        exists: () => true,
        data: () => mockUserFavorites,
      };

      mockGetDoc.mockResolvedValueOnce(mockDocSnapshot as any);

      const result = await getUserFavorites(mockUid);

      expect(result).toEqual([]);
    });

    it('should handle Firestore errors gracefully', async () => {
      const mockError = new Error('Firestore connection failed');
      mockGetDoc.mockRejectedValueOnce(mockError);

      const result = await getUserFavorites(mockUid);

      expect(result).toEqual([]);
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error getting user favorites:',
        mockError
      );
    });

    it('should handle null favoriteReports', async () => {
      const mockUserFavorites = {
        uid: mockUid,
        favoriteReports: null,
        updatedAt: new Date(),
      };

      const mockDocSnapshot = {
        exists: () => true,
        data: () => mockUserFavorites,
      };

      mockGetDoc.mockResolvedValueOnce(mockDocSnapshot as any);

      const result = await getUserFavorites(mockUid);

      expect(result).toEqual([]);
    });
  });

  describe('addToFavorites', () => {
    it('should add report to existing user favorites', async () => {
      const existingFavorites = ['report1', 'report2'];
      const mockUserFavorites: UserFavorites = {
        uid: mockUid,
        favoriteReports: existingFavorites,
        updatedAt: new Date(),
      };

      const mockDocSnapshot = {
        exists: () => true,
        data: () => mockUserFavorites,
      };

      mockGetDoc.mockResolvedValueOnce(mockDocSnapshot as any);
      mockUpdateDoc.mockResolvedValueOnce(undefined);
      mockArrayUnion.mockReturnValueOnce(mockReportId as any);

      const result = await addToFavorites(mockUid, mockReportId);

      expect(result).toBe(true);
      expect(mockDoc).toHaveBeenCalledWith('mockDb', 'userFavorites', mockUid);
      expect(mockGetDoc).toHaveBeenCalledWith(mockDocRef);
      expect(mockArrayUnion).toHaveBeenCalledWith(mockReportId);
      expect(mockUpdateDoc).toHaveBeenCalledWith(mockDocRef, {
        favoriteReports: mockReportId,
        updatedAt: expect.any(Date),
      });
    });

    it('should create new document when user has no favorites', async () => {
      const mockDocSnapshot = {
        exists: () => false,
      };

      mockGetDoc.mockResolvedValueOnce(mockDocSnapshot as any);
      mockSetDoc.mockResolvedValueOnce(undefined);

      const result = await addToFavorites(mockUid, mockReportId);

      expect(result).toBe(true);
      expect(mockDoc).toHaveBeenCalledWith('mockDb', 'userFavorites', mockUid);
      expect(mockGetDoc).toHaveBeenCalledWith(mockDocRef);
      expect(mockSetDoc).toHaveBeenCalledWith(mockDocRef, {
        uid: mockUid,
        favoriteReports: [mockReportId],
        updatedAt: expect.any(Date),
      });
    });

    it('should handle updateDoc errors gracefully', async () => {
      const mockDocSnapshot = {
        exists: () => true,
        data: () => ({ favoriteReports: ['existing'] }),
      };

      const mockError = new Error('Update failed');
      mockGetDoc.mockResolvedValueOnce(mockDocSnapshot as any);
      mockUpdateDoc.mockRejectedValueOnce(mockError);

      const result = await addToFavorites(mockUid, mockReportId);

      expect(result).toBe(false);
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error adding to favorites:',
        mockError
      );
    });

    it('should handle setDoc errors gracefully', async () => {
      const mockDocSnapshot = {
        exists: () => false,
      };

      const mockError = new Error('Create failed');
      mockGetDoc.mockResolvedValueOnce(mockDocSnapshot as any);
      mockSetDoc.mockRejectedValueOnce(mockError);

      const result = await addToFavorites(mockUid, mockReportId);

      expect(result).toBe(false);
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error adding to favorites:',
        mockError
      );
    });

    it('should handle getDoc errors gracefully', async () => {
      const mockError = new Error('Get failed');
      mockGetDoc.mockRejectedValueOnce(mockError);

      const result = await addToFavorites(mockUid, mockReportId);

      expect(result).toBe(false);
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error adding to favorites:',
        mockError
      );
    });
  });

  describe('removeFromFavorites', () => {
    it('should remove report from user favorites successfully', async () => {
      mockUpdateDoc.mockResolvedValueOnce(undefined);
      mockArrayRemove.mockReturnValueOnce(mockReportId as any);

      const result = await removeFromFavorites(mockUid, mockReportId);

      expect(result).toBe(true);
      expect(mockDoc).toHaveBeenCalledWith('mockDb', 'userFavorites', mockUid);
      expect(mockArrayRemove).toHaveBeenCalledWith(mockReportId);
      expect(mockUpdateDoc).toHaveBeenCalledWith(mockDocRef, {
        favoriteReports: mockReportId,
        updatedAt: expect.any(Date),
      });
    });

    it('should handle updateDoc errors gracefully', async () => {
      const mockError = new Error('Remove failed');
      mockUpdateDoc.mockRejectedValueOnce(mockError);

      const result = await removeFromFavorites(mockUid, mockReportId);

      expect(result).toBe(false);
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error removing from favorites:',
        mockError
      );
    });

    it('should handle Firestore permission errors', async () => {
      const mockError = new Error('Permission denied');
      mockUpdateDoc.mockRejectedValueOnce(mockError);

      const result = await removeFromFavorites(mockUid, mockReportId);

      expect(result).toBe(false);
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error removing from favorites:',
        mockError
      );
    });
  });

  describe('Integration scenarios', () => {
    it('should handle multiple operations correctly', async () => {
      // First, get empty favorites
      const mockEmptyDocSnapshot = {
        exists: () => false,
      };
      mockGetDoc.mockResolvedValueOnce(mockEmptyDocSnapshot as any);

      const emptyResult = await getUserFavorites(mockUid);
      expect(emptyResult).toEqual([]);

      // Then add a favorite
      mockGetDoc.mockResolvedValueOnce(mockEmptyDocSnapshot as any);
      mockSetDoc.mockResolvedValueOnce(undefined);

      const addResult = await addToFavorites(mockUid, mockReportId);
      expect(addResult).toBe(true);

      // Then remove the favorite
      mockUpdateDoc.mockResolvedValueOnce(undefined);
      mockArrayRemove.mockReturnValueOnce(mockReportId as any);

      const removeResult = await removeFromFavorites(mockUid, mockReportId);
      expect(removeResult).toBe(true);
    });

    it('should handle concurrent operations', async () => {
      const mockDocSnapshot = {
        exists: () => true,
        data: () => ({ favoriteReports: [] }),
      };

      // Simulate concurrent adds
      const report1 = 'report1';
      const report2 = 'report2';

      mockGetDoc.mockResolvedValue(mockDocSnapshot as any);
      mockUpdateDoc.mockResolvedValue(undefined);
      mockArrayUnion.mockImplementation(value => value as any);

      const [result1, result2] = await Promise.all([
        addToFavorites(mockUid, report1),
        addToFavorites(mockUid, report2),
      ]);

      expect(result1).toBe(true);
      expect(result2).toBe(true);
      expect(mockUpdateDoc).toHaveBeenCalledTimes(2);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty strings for uid and reportId', async () => {
      const emptyUid = '';
      const emptyReportId = '';

      // This should still work but create documents with empty strings
      const mockDocSnapshot = {
        exists: () => false,
      };

      mockGetDoc.mockResolvedValueOnce(mockDocSnapshot as any);
      mockSetDoc.mockResolvedValueOnce(undefined);

      const result = await addToFavorites(emptyUid, emptyReportId);

      expect(result).toBe(true);
      expect(mockDoc).toHaveBeenCalledWith('mockDb', 'userFavorites', emptyUid);
      expect(mockSetDoc).toHaveBeenCalledWith(mockDocRef, {
        uid: emptyUid,
        favoriteReports: [emptyReportId],
        updatedAt: expect.any(Date),
      });
    });

    it('should handle very long report IDs', async () => {
      const longReportId = 'a'.repeat(1000); // Very long ID

      const mockDocSnapshot = {
        exists: () => false,
      };

      mockGetDoc.mockResolvedValueOnce(mockDocSnapshot as any);
      mockSetDoc.mockResolvedValueOnce(undefined);

      const result = await addToFavorites(mockUid, longReportId);

      expect(result).toBe(true);
      expect(mockSetDoc).toHaveBeenCalledWith(mockDocRef, {
        uid: mockUid,
        favoriteReports: [longReportId],
        updatedAt: expect.any(Date),
      });
    });
  });
});
