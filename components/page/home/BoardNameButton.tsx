import { container } from 'tsyringe'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import BoardsHandler from '@/logic/app/BoardsHandler'
import ShelfButton from '@/components/page/home/ShelfButton'
import EditBoardDialog from '@/components/page/home/EditBoardDialog'

const BoardNameButton = observer(() => {
  const [showDialog, setShowDialog] = useState(false)
  const { selectedBoard } = container.resolve(BoardsHandler)

  return (
    <>
      <EditBoardDialog isOpen={showDialog} onOpenChange={setShowDialog} />
      <ShelfButton
        onClick={() => setShowDialog(true)}
        label={`${selectedBoard.name}, select to rename board`}
        filled
      >
        {selectedBoard.name}
      </ShelfButton>
    </>
  )
})

export default BoardNameButton