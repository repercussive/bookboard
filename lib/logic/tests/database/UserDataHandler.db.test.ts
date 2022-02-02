import '@abraham/reflection'
import { container } from 'tsyringe'
import initializeFirebase, { registerFirebaseInjectionTokens } from '@/lib/firebase-setup/initializeFirebase'
import UserDataHandler from '@/lib/logic/app/UserDataHandler'
import signInDummyUser from '@/test-setup/signInDummyUser'
import getFirebaseAdmin from '@/test-setup/getFirebaseAdmin'
import getDbShortcuts from '@/test-setup/getDbShortcuts'
import teardownFirebase from '@/test-setup/teardownFirebase'

const { db } = getFirebaseAdmin()
const { userDoc } = getDbShortcuts(db)
const firebase = initializeFirebase()

let userDataHandler: UserDataHandler
let testUserUid: string

beforeAll(async () => {
  registerFirebaseInjectionTokens(firebase)
  userDataHandler = container.resolve(UserDataHandler)
  testUserUid = (await signInDummyUser()).uid
})

afterEach(async () => {
  container.clearInstances()
  await db.recursiveDelete(userDoc(testUserUid))
})

afterAll(async () => {
  await teardownFirebase(firebase)
})

test('syncing color theme works', async () => {
  userDataHandler.setColorThemeLocally('almond')
  await userDataHandler.syncColorTheme()

  const userData = (await userDoc(testUserUid).get()).data()
  expect(userData?.colorTheme).toEqual('almond')
})

test('syncing plants works', async () => {
  userDataHandler.setPlantLocally('a', 'leah')
  userDataHandler.setPlantLocally('b', 'roman')
  await userDataHandler.syncPlants()

  const userData = (await userDoc(testUserUid).get()).data()
  expect(userData?.plants).toEqual({
    a: 'leah',
    b: 'roman'
  })
})