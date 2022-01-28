import { PlantId } from '@/lib/logic/app/UserDataHandler'
import Anita from '@/components/plants/Anita'
import Frank from '@/components/plants/Frank'
import George from '@/components/plants/George'
import Leah from '@/components/plants/Leah'
import Oliver from '@/components/plants/Oliver'
import Roman from '@/components/plants/Roman'
import Wes from '@/components/plants/Wes'
import Zoe from '@/components/plants/Zoe'

const plantsData: Record<PlantId, { component: () => JSX.Element }> = {
  george: { component: George },
  frank: { component: Frank },
  zoe: { component: Zoe },
  anita: { component: Anita },
  wes: { component: Wes },
  leah: { component: Leah },
  oliver: { component: Oliver },
  roman: { component: Roman },
}

const PlantSvg = ({ plantId, flip }: { plantId: PlantId, flip?: boolean }) => {
  const PlantComponent = plantsData[plantId].component

  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 30 30"
      width="3rem"
      style={{
        transform: flip ? 'scaleX(-1)' : undefined,
        minWidth: '2.35rem',
      }}
    >
      <PlantComponent />
    </svg>
  )
}

export default PlantSvg