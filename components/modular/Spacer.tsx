import { SpaceValue } from '@/styles/stitches.config'
import Box from '@/components/modular/Box'

type MarginValues = {
  m?: SpaceValue,
  mt?: SpaceValue,
  mr?: SpaceValue,
  mb?: SpaceValue,
  ml?: SpaceValue,
  mx?: SpaceValue,
  my?: SpaceValue
}

interface Props extends MarginValues {
  'bp1'?: MarginValues,
  'bp2'?: MarginValues
}

const Spacer = (props: Props) => {
  return <Box css={{ ...props, '@bp1': props.bp1, '@bp2': props.bp2 }} />
}

export default Spacer