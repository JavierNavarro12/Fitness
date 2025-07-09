import { db } from '../firebase';
import { doc, getDoc, setDoc, increment } from 'firebase/firestore';

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

  async addLike(blogId: string) {
    const ref = doc(db, COLLECTION, blogId);
    await setDoc(ref, { likes: increment(1) }, { merge: true });
    setVoteLocal(blogId, 'like');
  },

  async addDislike(blogId: string) {
    const ref = doc(db, COLLECTION, blogId);
    await setDoc(ref, { dislikes: increment(1) }, { merge: true });
    setVoteLocal(blogId, 'dislike');
  },

  getUserVote(blogId: string): 'like' | 'dislike' | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(`blogVote_${blogId}`) as
      | 'like'
      | 'dislike'
      | null;
  },
};

export {};

function setVoteLocal(blogId: string, vote: 'like' | 'dislike') {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`blogVote_${blogId}`, vote);
  }
}
