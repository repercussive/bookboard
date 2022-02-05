import type { Firestore } from 'firebase-admin/firestore'

export default function getDbShortcuts(db: Firestore) {
  const userDoc = (uid: string) => db.collection('users').doc(uid)
  const boardDoc = (uid: string, boardId: string) => userDoc(uid).collection('boards').doc(boardId) 
  const boardChunkDoc = (uid: string, boardId: string, chunkIndex: number) => boardDoc(uid, boardId).collection('chunks').doc(`${chunkIndex}`)

  return {
    userDoc,
    boardDoc,
    boardChunkDoc
  }
}