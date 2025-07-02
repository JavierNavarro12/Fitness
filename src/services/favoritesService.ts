import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from '../firebase';

export interface UserFavorites {
  uid: string;
  favoriteReports: string[];
  updatedAt: Date;
}

/**
 * Obtener los favoritos de un usuario desde Firebase
 */
export const getUserFavorites = async (uid: string): Promise<string[]> => {
  try {
    const userDocRef = doc(db, 'userFavorites', uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const data = userDoc.data() as UserFavorites;
      return data.favoriteReports || [];
    }

    return [];
  } catch (error) {
    console.error('Error getting user favorites:', error);
    return [];
  }
};

/**
 * Agregar un informe a favoritos
 */
export const addToFavorites = async (
  uid: string,
  reportId: string
): Promise<boolean> => {
  try {
    const userDocRef = doc(db, 'userFavorites', uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      // El documento existe, agregar al array
      await updateDoc(userDocRef, {
        favoriteReports: arrayUnion(reportId),
        updatedAt: new Date(),
      });
    } else {
      // El documento no existe, crearlo
      await setDoc(userDocRef, {
        uid: uid,
        favoriteReports: [reportId],
        updatedAt: new Date(),
      });
    }

    return true;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return false;
  }
};

/**
 * Quitar un informe de favoritos
 */
export const removeFromFavorites = async (
  uid: string,
  reportId: string
): Promise<boolean> => {
  try {
    const userDocRef = doc(db, 'userFavorites', uid);

    await updateDoc(userDocRef, {
      favoriteReports: arrayRemove(reportId),
      updatedAt: new Date(),
    });

    return true;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return false;
  }
};
