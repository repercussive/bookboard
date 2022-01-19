import Book from '@/logic/app/Book'

test('when a book is created, its properties are correctly assigned', () => {
  const newBook = new Book({
    title: 'Senlin Ascends',
    author: 'Josiah Bancroft',
  })

  expect(newBook.title).toEqual('Senlin Ascends')
  expect(newBook.author).toEqual('Josiah Bancroft')
})

test('when a book is created, it is automatically assigned a random 8-character id', () => {
  const newBookA = new Book({ title: 'A title', author: 'An author' })
  const newBookB = new Book({ title: 'A title', author: 'An author' })

  expect(newBookA.id).not.toEqual(newBookB.id)
  expect(newBookA.id.length).toEqual(8)
  expect(newBookB.id.length).toEqual(8)
})

test('updating a book correctly sets its title and author', () => {
  const testBook = new Book({ title: 'Old title', author: 'Old author' })
  testBook.updateInfo({ title: 'New title', author: 'New author' })

  expect(testBook.title).toEqual('New title')
  expect(testBook.author).toEqual('New author')
})

test('updating rating works', () => {
  const testBook = new Book({ title: 'Old title', author: 'Old author' })

  testBook.updateRating(4)
  expect(testBook.rating).toEqual(4)
})

test('updating review works', () => {
  const testBook = new Book({ title: 'Old title', author: 'Old author' })

  testBook.updateReview('it is pretty good')
  expect(testBook.review).toEqual('it is pretty good')
})