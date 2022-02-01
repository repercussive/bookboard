import { inject, singleton } from 'tsyringe'
import { Firestore, doc, DocumentReference, DocumentData, getDoc } from 'firebase/firestore'
import { Auth } from 'firebase/auth'

export const maxBooksPerDocument = 300

@singleton()
export default class DbHandler {
  public db
  private auth

  constructor(@inject('Auth') auth: Auth, @inject('Firestore') db: Firestore) {
    this.auth = auth
    this.db = db
  }

  public getDocData = async (docRef: DocumentReference<DocumentData>) => {
    const doc = await getDoc(docRef)
    return doc.data()
  }

  public boardDocRef(boardId: string) {
    return doc(this.db, `users/${this.uid}/boards/${boardId}`)
  }

  public boardChunkDocRef({ boardId, chunkIndex }: { boardId: string, chunkIndex: number }) {
    return doc(this.db, `users/${this.uid}/boards/${boardId}/chunks/${chunkIndex}`)
  }

  public get userDocRef() {
    return doc(this.db, `users/${this.uid}`)
  }

  private get uid() {
    return this.auth.currentUser?.uid
  }
}