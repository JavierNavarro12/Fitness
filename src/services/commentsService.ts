import { db } from '../firebase';
import {
  collection,
  query,
  where,
  orderBy,
  addDoc,
  getDocs,
  Timestamp,
} from 'firebase/firestore';

const COLLECTION = 'blogComments';

export interface BlogComment {
  id?: string;
  blogId: string;
  comment: string;
  createdAt: Date;
  userName: string;
  userPhoto: string;
}

export const commentsService = {
  async getComments(blogId: string): Promise<BlogComment[]> {
    const q = query(
      collection(db, COLLECTION),
      where('blogId', '==', blogId),
      orderBy('createdAt', 'asc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({
      id: doc.id,
      blogId,
      comment: doc.data().comment,
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      userName: doc.data().userName,
      userPhoto: doc.data().userPhoto,
    }));
  },

  async addComment(
    blogId: string,
    comment: string,
    user: { displayName: string; photoURL: string }
  ) {
    await addDoc(collection(db, COLLECTION), {
      blogId,
      comment,
      createdAt: Timestamp.now(),
      userName: user.displayName,
      userPhoto: user.photoURL,
    });
  },
};

export {};
