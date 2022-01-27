import { container } from 'tsyringe'
import { useState } from 'react'
import BoardsHandler from '@/logic/app/BoardsHandler'
import ShelfButton from '@/components/page/home/ShelfButton'
import RenameBoardDialog from '@/components/page/home/RenameBoardDialog'

const BoardNameButton = () => {
  const [showDialog, setShowDialog] = useState(false)
  const { selectedBoard } = container.resolve(BoardsHandler)

  return (
    <>
      <RenameBoardDialog isOpen={showDialog} onOpenChange={setShowDialog} />
      <ShelfButton onClick={() => setShowDialog(true)} filled>
        {selectedBoard.name}
      </ShelfButton>
    </>
  )
}

export default BoardNameButton