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
