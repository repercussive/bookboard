import { inject, singleton } from 'tsyringe'
import { Firestore, doc, collection, DocumentReference, getDoc, Timestamp, getDocs, query } from 'firebase/firestore'
import { Auth } from 'firebase/auth'
import { PlantId, ThemeId } from '@/lib/logic/app/UserDataHandler'

export const maxBooksPerDocument = 300

export interface UserDocumentData {
  colorTheme?: ThemeId,
  plants?: { a: PlantId, b: PlantId },
  completedBooksCount?: number,
  boardsMetadata?: { [boardId: string]: { name: string, dateCreated: Timestamp } }
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
    dateCompleted?: Timestamp
  }
}

@singleton()
export default class DbHandler {
  public db
  private auth

  constructor(@inject('Auth') auth: Auth, @inject('Firestore') db: Firestore) {
    this.auth = auth
    this.db = db
  }

  public getDocData = async(docRef: DocumentReference) => {
    const doc = await getDoc(docRef)
    return doc.data()
  }

  public getBoardChunkDocs = async (boardId: string) => {
    const chunksCollectionRef = collection(this.db, `users/${this.uid}/boards/${boardId}/chunks`)
    const chunksSnapshot = await getDocs(query<BoardChunkDocumentData>(chunksCollectionRef))
    return chunksSnapshot.docs
  }

  public boardDocRef = (boardId: string) => {
    return doc(this.db, `users/${this.uid}/boards/${boardId}`)
  }

  public boardChunkDocRef = ({ boardId, chunkIndex }: { boardId: string, chunkIndex: number }) => {
    return doc(this.db, `users/${this.uid}/boards/${boardId}/chunks/${chunkIndex}`)
  }

  public get userDocRef() {
    return doc(this.db, `users/${this.uid}`)
  }

  private get uid() {
    return this.auth.currentUser?.uid
  }
}