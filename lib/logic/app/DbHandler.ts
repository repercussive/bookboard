import { inject, singleton } from 'tsyringe'
import { Firestore, doc, collection, DocumentReference, getDoc, Timestamp, getDocs, query, setDoc } from 'firebase/firestore'
import { Auth } from 'firebase/auth'
import { PlantId, ThemeId } from '@/lib/logic/app/UserDataHandler'

export const maxBooksPerDocument = 300

export interface UserDocumentData {
  colorTheme?: ThemeId,
  plants?: { a: PlantId, b: PlantId },
  completedBooksCount?: number,
  boardsMetadata?: { [boardId: string]: { name: string, timeCreated: number } }
}

export interface BoardDocumentData {
  totalBooksAdded: number,
  unreadBooksOrder: string[]
}

export interface BoardChunkDocumentData {
  [bookId: string]: {
    title: string
    author: string,
    rating?: number,
    review?: string,
    timeCompleted?: number
  }
}

type DocType = { [key: string]: any }

@singleton()
export default class DbHandler {
  public db
  private auth

  constructor(@inject('Auth') auth: Auth, @inject('Firestore') db: Firestore) {
    this.auth = auth
    this.db = db
  }

  public getDocData = async<T extends DocType>(docRef: DocumentReference<T>) => {
    const doc = await getDoc<T>(docRef)
    return doc.data()
  }

  public updateDoc = async<T extends DocType>(docRef: DocumentReference<T>, data: T) => {
    if (!this.auth.currentUser) return
    await setDoc<T>(docRef, data, { merge: true })
  }

  public getBoardChunkDocs = async (boardId: string) => {
    const chunksCollectionRef = collection(this.db, `users/${this.uid}/boards/${boardId}/chunks`)
    const chunksSnapshot = await getDocs(query<BoardChunkDocumentData>(chunksCollectionRef))
    return chunksSnapshot.docs
  }

  public boardDocRef = (boardId: string) => {
    return doc(
      this.db,
      `users/${this.uid}/boards/${boardId}`
    ) as DocumentReference<BoardDocumentData>
  }

  public boardChunkDocRef = ({ boardId, chunkIndex }: { boardId: string, chunkIndex: number }) => {
    return doc(
      this.db,
      `users/${this.uid}/boards/${boardId}/chunks/${chunkIndex}`
    ) as DocumentReference<BoardChunkDocumentData>
  }

  public get userDocRef() {
    return doc(
      this.db,
      `users/${this.uid}`
    ) as DocumentReference<UserDocumentData>
  }

  private get uid() {
    return this.auth.currentUser?.uid
  }
}