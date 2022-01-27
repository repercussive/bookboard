import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { styled } from '@/styles/stitches.config'
import PlantSvg, { PlantId } from '@/components/page/home/PlantSvg'
import Dialog from '@/components/modular/Dialog'
import SimpleButton from '@/components/modular/SimpleButton'
import Spacer from '@/components/modular/Spacer'

interface Props {
  isOpen: boolean,
  onOpenChange: (open: boolean) => void,
  initiallySelectedPlant: PlantId,
  onSaveSelection: (plantId: PlantId) => void
}

const PlantsDialogContext = createContext<{
  selectedPlant: PlantId,
  setSelectedPlant: Dispatch<SetStateAction<PlantId>>
  onSaveSelection: (plantId: PlantId) => void
}>(null!)

const PlantsDialog = ({ isOpen, onOpenChange, initiallySelectedPlant, onSaveSelection }: Props) => {
  const [selectedPlant, setSelectedPlant] = useState(initiallySelectedPlant)

  useEffect(() => {
    if (isOpen) {
      setSelectedPlant(initiallySelectedPlant)
    }
  }, [isOpen])

  if (!isOpen) return null

  function saveSelection() {
    onSaveSelection(selectedPlant)
    onOpenChange(false)
  }

  return (
    <PlantsDialogContext.Provider value={{ selectedPlant, setSelectedPlant, onSaveSelection }}>
      <Dialog
        title={'Pick a plant'}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <Spacer mb="$1" />
        <PlantsGrid>
          <SelectPlantButton plantId="george" />
          <SelectPlantButton plantId="frank" />
          <SelectPlantButton plantId="anita" />
          <SelectPlantButton plantId="wes" />
          <SelectPlantButton plantId="zoe" />
          <SelectPlantButton plantId="leah" />
          <SelectPlantButton plantId="oliver" />
          <SelectPlantButton plantId="roman" />
        </PlantsGrid>
        <Spacer mb="$5" />
        <SimpleButton onClick={saveSelection}>
          Save
        </SimpleButton>
      </Dialog>
    </PlantsDialogContext.Provider>
  )
}

const SelectPlantButton = ({ plantId }: { plantId: PlantId }) => {
  const { selectedPlant, setSelectedPlant } = useContext(PlantsDialogContext)

  return (
    <button
      onClick={() => setSelectedPlant(plantId)}
      aria-label="Plant"
      data-selected={selectedPlant === plantId}
    >
      <PlantSvg plantId={plantId} />
    </button>
  )
}

const PlantsGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  rowGap: '1rem',
  '& button': {
    display: 'grid',
    placeItems: 'center',
    bg: 'none',
    cursor: 'default',
    '& svg': {
      opacity: 0.25,
      cursor: 'pointer'
    },
    '&[data-selected=true]': {
      '& svg': {
        opacity: 1
      }
    }
  }
})

export default PlantsDialog