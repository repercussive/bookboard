import { container } from 'tsyringe'
import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { styled } from '@/styles/stitches.config'
import UserDataHandler, { PlantId } from '@/lib/logic/app/UserDataHandler'
import PlantSvg from '@/components/page/home/PlantSvg'
import PlantsDialog from '@/components/page/home/PlantsDialog'

const ShelfPlant = observer(({ shelfId, flip }: { shelfId: 'a' | 'b', flip?: boolean }) => {
  const { plants, setPlantLocally, syncPlants } = container.resolve(UserDataHandler)
  const [showDialog, setShowDialog] = useState(false)

  function handleSaveSelection(plant: PlantId) {
    setPlantLocally(shelfId, plant)
    syncPlants()
  }

  return (
    <>
      <PlantsDialog
        isOpen={showDialog}
        onOpenChange={setShowDialog}
        selectedPlantOnOpen={plants[shelfId]}
        onSaveSelection={handleSaveSelection}
      />
      <PlantButton aria-label="Change plant" onClick={() => setShowDialog(true)}>
        <PlantSvg plantId={plants[shelfId]} flip={flip} />
      </PlantButton>
    </>
  )
})

const PlantButton = styled('button', {
  position: 'relative',
  width: '3rem',
  height: '3rem',
  marginBottom: '-2.25px',
  bg: 'none',
  transition: 'transform 100ms',
  '@media (hover: hover)': {
    '&:hover': {
      transform: 'translateY(-4px)',
    }
  }
})

export default ShelfPlant