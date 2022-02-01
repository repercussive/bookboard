import type { Firestore } from 'firebase-admin/firestore'

export default function getDbShortcuts(db: Firestore) {
  const userDoc = (uid: string) => db.collection('users').doc(uid)
  const boardDoc = (uid: string, boardId: string) => userDoc(uid).collection('boards').doc(boardId) 

  return {
    userDoc,
    boardDoc
  }
}