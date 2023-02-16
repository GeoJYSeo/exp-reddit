import { Button, Flex } from "@chakra-ui/react"
import { signOut } from "firebase/auth";
import AythModal from "../../modal/auth/AuthModal"
import AuthButtons from "./AuthButtons"
import { auth } from "../../../firebase/clientApp"

type RightContentProps = {
  user: any
};

const RightContent:React.FC<RightContentProps> = ({ user }) => {
  
  return (
    <>
      <AythModal />
      <Flex justify="center" align="center">
        {user ? (
          <Button onClick={() => signOut(auth)}>Logout</Button>
        ) : (
          <AuthButtons />
        )}
      </Flex>
    </>
  )
}
export default RightContent;