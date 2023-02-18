import { authModalState } from "@/src/atoms/authModalAtom"
import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react"
import { useAuthState } from "react-firebase-hooks/auth"
import { useRecoilState } from "recoil"
import AuthInputs from "./AuthInputs"
import OAuthButtons from "./OAuthButtons"
import { auth } from "../../../firebase/clientApp"
import { useCallback, useEffect } from "react"
import ResetPassword from "./ResetPassword"

const AythModal:React.FC = () => {

  const [modalState, setModalState] = useRecoilState(authModalState)
  const [user, loading, error] = useAuthState(auth)

  const handleClose = useCallback(() => {
    setModalState((prev) => ({
      ...prev,
      open: false,
    }))
  }, [setModalState])

  useEffect(() => {
    if (user) handleClose()
  }, [handleClose, user])

  return (
    <>
      <Modal isOpen={modalState.open} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">
            {modalState.view === "login" && "Login"}
            {modalState.view === "signup" && "Sign Up"}
            {modalState.view === "resetPassword" && "Reset Password"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            pb={6}
          >
            <Flex
              direction="column"
              align="center"
              justify="center"
              width="70%"
            >
              {modalState.view === "login" || modalState.view === "signup" ? (
                <>
                  <OAuthButtons />
                  <Text color="gray.500" fontWeight={700}>OR</Text>
                  <AuthInputs />
                </>
              ) : (
                <ResetPassword />
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
export default AythModal;
