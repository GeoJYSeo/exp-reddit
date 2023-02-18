import { Flex } from "@chakra-ui/react"
import { User } from "firebase/auth"
import AythModal from "../../modal/auth/AuthModal"
import AuthButtons from "./AuthButtons"
import Icons from "./Icons"
import UserMenu from "./UserMenu"

type RightContentProps = {
  user?: User | null
};

const RightContent:React.FC<RightContentProps> = ({ user }) => {
  
  return (
    <>
      <AythModal />
      <Flex justify="center" align="center">
        {user ? <Icons /> : <AuthButtons />}
        <UserMenu user={user} />
      </Flex>
    </>
  )
}
export default RightContent
