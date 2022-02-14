import type { Auth } from 'firebase/auth'
import { inject, singleton } from 'tsyringe'
import { makeAutoObservable, runInAction } from 'mobx'
import { Firestore, doc, collection, DocumentReference, getDoc, getDocs, query, setDoc, WriteBatch } from 'firebase/firestore'
import { PlantId, ThemeId } from '@/lib/logic/app/UserDataHandler'
import { BookProperties } from '@/lib/logic/app/Board'

export const maxBooksPerDocument = 300

export interface UserDocumentData {
  colorTheme?: ThemeId,
  plants?: { a: PlantId, b: PlantId },
  completedBooksCount?: number,
  boardsMetadata?: { [boardId: string]: { name: string, timeCreated: number } }
  lastSelectedBoardId?: string
}

export interface BoardDocumentData {
  totalBooksAdded: number,
  unreadBooksOrder: string[]
}

export interface BoardChunkDocumentData {
  [bookId: string]: BookProperties
}

type DeepPartial<T> = T extends { [key: string]: any } ? {
  [P in keyof T]?: DeepPartial<T[P]>
} : T

@singleton()
export default class DbHandler {
  public db
  public isWriteComplete = true
  private auth
  private writeOperations

  constructor(@inject('Auth') auth: Auth, @inject('Firestore') db: Firestore) {
    this.auth = auth
    this.db = db
    this.writeOperations = {
      updateDoc: this.updateDoc,
      updateDocInBatch: this.updateDocInBatch,
      deleteDocInBatch: this.deleteDocInBatch
    }
    makeAutoObservable(this)
  }

  public runWriteOperations = async (callback: (writeOperations: typeof this.writeOperations) => Promise<void>) => {
    this.isWriteComplete = false
    await callback(this.writeOperations)
    runInAction(() => this.isWriteComplete = true)
  }

  private updateDoc = async<T>(docRef: DocumentReference<T>, data: DeepPartial<T>) => {
    if (!this.auth.currentUser) return
    await setDoc(docRef, data, { merge: true })
  }

  private updateDocInBatch = <T>(batch: WriteBatch, docRef: DocumentReference<T>, data: DeepPartial<T>) => {
    if (!this.auth.currentUser) return
    batch.set(docRef, data, { merge: true })
  }

  private deleteDocInBatch = (batch: WriteBatch, docRef: DocumentReference) => {
    if (!this.auth.currentUser) return
    batch.delete(docRef)
  }

  public getDocData = async<T>(docRef: DocumentReference<T>) => {
    const doc = await getDoc<T>(docRef)
    return doc.data()
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

  public boardChunkDocRef = <T>({ boardId, chunkIndex }: { boardId: string, chunkIndex: number }) => {
    return doc(
      this.db,
      `users/${this.uid}/boards/${boardId}/chunks/${chunkIndex}`
    ) as (T extends object ? DocumentReference<T> : DocumentReference<BoardChunkDocumentData>)
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