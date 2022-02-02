import '@abraham/reflection'
import { container } from 'tsyringe'
import BoardsHandler from '@/lib/logic/app/BoardsHandler'
import Board from '@/lib/logic/app/Board'
import initializeFirebase, { registerFirebaseInjectionTokens } from '@/lib/firebase-setup/initializeFirebase'

let boardsHandler: BoardsHandler
const fb = initializeFirebase()

beforeEach(() => {
  registerFirebaseInjectionTokens(fb)
  boardsHandler = container.resolve(BoardsHandler)
})

afterEach(() => {
  container.clearInstances()
})

test('on initialization, one board is automatically created', () => {
  expect(boardsHandler.allBoards.length).toEqual(1)
})

test('the view mode is set to unread by default', () => {
  expect(boardsHandler.viewMode).toEqual('unread')
})

test('setting the view mode between read and unread works', () => {
  boardsHandler.setViewMode('read')
  expect(boardsHandler.viewMode).toEqual('read')
  boardsHandler.setViewMode('unread')
  expect(boardsHandler.viewMode).toEqual('unread')
})

test('adding a board works', () => {
  const newBoard = new Board({ name: 'New board' })
  boardsHandler.addBoard(newBoard)
  expect(boardsHandler.allBoards[1]).toEqual(newBoard)
})

test('when a new board is added, it is automatically set as the selected board', () => {
  const newBoard = new Board({ name: 'New board' })
  boardsHandler.addBoard(newBoard)
  expect(boardsHandler.selectedBoard).toEqual(newBoard)
})

test('deleting a board works', () => {
  const newBoard = new Board({ name: 'New board' })
  boardsHandler.addBoard(newBoard)
  boardsHandler.deleteBoard(boardsHandler.allBoards[1])
  expect(boardsHandler.allBoards.length).toEqual(1)
})

test('if the selected board is deleted, the first remaining board will be selected', () => {
  const newBoard = new Board({ name: 'New board' })
  const startingBoard = boardsHandler.allBoards[0]
  boardsHandler.addBoard(newBoard)
  boardsHandler.setSelectedBoard(startingBoard)
  boardsHandler.deleteBoard(startingBoard)
  expect(boardsHandler.selectedBoard).toEqual(newBoard)
})

test('throws an error when attempting to delete the only remaining board', () => {
  const deleteOnlyRemaining = () => boardsHandler.deleteBoard(boardsHandler.allBoards[0])
  expect(deleteOnlyRemaining).toThrow()
})

test('correctly handles board metadata', () => {  
  boardsHandler.registerBoardsMetadata({
    boardIdA: { name: 'Test board A', timeCreated: new Date('2021-01-01').valueOf() },
    boardIdB: { name: 'Test board B', timeCreated: new Date('2022-01-01').valueOf() }
  })
  expect(boardsHandler.unloadedBoardIds).toEqual(['boardIdA', 'boardIdB'])
  expect(boardsHandler.allBoards[0]).toMatchObject({ name: 'Test board A' })
  expect(boardsHandler.allBoards[1]).toMatchObject({ name: 'Test board B' })
})