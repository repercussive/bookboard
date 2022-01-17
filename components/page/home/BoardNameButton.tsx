import { container } from 'tsyringe'
import BoardsHandler from '@/logic/app/BoardsHandler'
import ShelfButton from '@/components/page/home/ShelfButton'

const BoardNameButton = () => {
  const { selectedBoard } = container.resolve(BoardsHandler)

  return (
    <ShelfButton filled>{selectedBoard.name}</ShelfButton>
  )
}

export default BoardNameButton