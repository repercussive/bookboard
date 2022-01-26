import { useState } from 'react'
import { styled } from '@/styles/stitches.config'
import PlantSvg, { PlantId } from '@/components/page/home/PlantSvg'
import PlantsDialog from '@/components/page/home/PlantsDialog'

const ShelfPlant = ({ flip }: { flip?: boolean }) => {
  const [plantId, setPlantId] = useState<PlantId>('george')
  const [showDialog, setShowDialog] = useState(false)

  return (
    <>
      <PlantsDialog
        isOpen={showDialog}
        onOpenChange={setShowDialog}
        initiallySelectedPlant={plantId}
        onSaveSelection={(id) => setPlantId(id)}
      />
      <PlantButton aria-label="Change plant" onClick={() => setShowDialog(true)}>
        <PlantSvg plantId={plantId} flip={flip} />
      </PlantButton>
    </>
  )
}

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