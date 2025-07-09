import { db } from '../firebase';
import {
  doc,
  getDoc,
  setDoc,
  increment,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { User } from 'firebase/auth';

const COLLECTION = 'blogLikes';

export const likesService = {
  async getLikes(blogId: string) {
    const ref = doc(db, COLLECTION, blogId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      return {
        likes: data.likes || 0,
        dislikes: data.dislikes || 0,
      };
    }
    return { likes: 0, dislikes: 0 };
  },

  async addLike(blogId: string, user: User) {
    // Verificar si el usuario ya ha dado like
    const userLikeRef = doc(db, COLLECTION, blogId, 'likes', user.uid);
    const userLikeSnap = await getDoc(userLikeRef);

    if (userLikeSnap.exists()) {
      throw new Error('Ya has dado like a este post');
    }

    // Crear el documento del usuario en la subcolección likes
    await setDoc(userLikeRef, {
      displayName: user.displayName || user.email || 'Usuario',
      photoURL: user.photoURL || '',
      createdAt: new Date().toISOString(),
      voteType: 'like',
    });

    // Incrementar el contador global de likes
    const ref = doc(db, COLLECTION, blogId);
    await setDoc(ref, { likes: increment(1) }, { merge: true });

    // Guardar en localStorage para UI local
    setVoteLocal(blogId, 'like');
  },

  async addDislike(blogId: string, user: User) {
    // Verificar si el usuario ya ha dado dislike
    const userDislikeRef = doc(db, COLLECTION, blogId, 'likes', user.uid);
    const userDislikeSnap = await getDoc(userDislikeRef);

    if (userDislikeSnap.exists()) {
      throw new Error('Ya has dado dislike a este post');
    }

    // Crear el documento del usuario en la subcolección likes
    await setDoc(userDislikeRef, {
      displayName: user.displayName || user.email || 'Usuario',
      photoURL: user.photoURL || '',
      createdAt: new Date().toISOString(),
      voteType: 'dislike',
    });

    // Incrementar el contador global de dislikes
    const ref = doc(db, COLLECTION, blogId);
    await setDoc(ref, { dislikes: increment(1) }, { merge: true });

    // Guardar en localStorage para UI local
    setVoteLocal(blogId, 'dislike');
  },

  async getUserVote(
    blogId: string,
    user: User | null
  ): Promise<'like' | 'dislike' | null> {
    if (!user) {
      // Si no hay usuario autenticado, usar localStorage como fallback
      if (typeof window === 'undefined') return null;
      return localStorage.getItem(`blogVote_${blogId}`) as
        | 'like'
        | 'dislike'
        | null;
    }

    try {
      const userVoteRef = doc(db, COLLECTION, blogId, 'likes', user.uid);
      const userVoteSnap = await getDoc(userVoteRef);

      if (userVoteSnap.exists()) {
        const data = userVoteSnap.data();
        return data.voteType as 'like' | 'dislike';
      }

      return null;
    } catch (error) {
      console.error('Error obteniendo voto del usuario:', error);
      return null;
    }
  },

  // Función para obtener la lista de usuarios que han dado like (para backend)
  async getUsersWhoLiked(
    blogId: string
  ): Promise<
    Array<{ displayName: string; photoURL: string; createdAt: string }>
  > {
    try {
      const likesRef = collection(db, COLLECTION, blogId, 'likes');
      const q = query(likesRef, where('voteType', '==', 'like'));
      const querySnapshot = await getDocs(q);

      const users = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          displayName: data.displayName,
          photoURL: data.photoURL,
          createdAt: data.createdAt,
        };
      });

      return users;
    } catch (error) {
      console.error('Error obteniendo usuarios que dieron like:', error);
      return [];
    }
  },
};

export {};

function setVoteLocal(blogId: string, vote: 'like' | 'dislike') {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`blogVote_${blogId}`, vote);
  }
}
