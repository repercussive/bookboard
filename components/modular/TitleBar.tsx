import { styled } from '@/styles/stitches.config'

const TitleBar = () => {
  return (
    <Wrapper>
      <h1>bookboard</h1>
    </Wrapper>
  )
}

const Wrapper = styled('div', {
  mt: '$1',
  mb: '$4',
  '@bp1': {
    mt: '$3',
    mb: '$6'
  },
  '@bp2': {
    mt: '$6',
    mb: '$8'
  }
})

export default TitleBar