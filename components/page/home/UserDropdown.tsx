import { observer } from 'mobx-react-lite'
import { container } from 'tsyringe'
import { styled } from '@/styles/stitches.config'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import AuthHandler from '@/lib/logic/app/AuthHandler'
import Dropdown from '@/components/modular/Dropdown'
import Icon from '@/components/modular/Icon'
import Flex from '@/components/modular/Flex'
import UserCircleIcon from '@/components/icons/UserCircleIcon'

const UserDropdown = observer(() => {
  const { isAuthenticated, signIn, signOut, auth } = container.resolve(AuthHandler)

  return (
    <Dropdown
      align="end"
      alignOffset={12}
      triggerElement={<DropdownTrigger />}
    >
      {isAuthenticated && <>
        <DisplayName>{auth.currentUser?.displayName}</DisplayName>
        <Dropdown.Divider />
      </>}
      <Dropdown.Item onClick={isAuthenticated ? signOut : signIn}>
        Sign {isAuthenticated ? 'out' : 'in'}
      </Dropdown.Item>
    </Dropdown>
  )
})

const DropdownTrigger = () => {
  return (
    <DropdownButton aria-label="User options">
      <Flex as="span" center>
        <Icon icon={UserCircleIcon} />
      </Flex>
    </DropdownButton>
  )
}

const DisplayName = styled('span', {
  display: 'block',
  mx: '$2',
  py: '$1',
  fontSize: '0.85em',
})

const DropdownButton = styled(DropdownMenu.Trigger, {
  bg: 'none',
  fontSize: '1.2em',
  padding: '$3'
})

export default UserDropdown