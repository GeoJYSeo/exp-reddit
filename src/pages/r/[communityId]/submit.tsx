import PageContent from "@/src/components/layout/PageContent"
import NewPostForm from "@/src/components/post/NewPostForm"
import { auth } from "@/src/firebase/clientApp"
import { Box, Text } from "@chakra-ui/react"
import { useAuthState } from "react-firebase-hooks/auth"

const SubmitPostPage:React.FC = () => {

  const [user] = useAuthState(auth)

  return (
    <>
      <PageContent>
        <>
          <Box p="14px 0px" borderBottom="1px solid" borderColor="white">
            <Text>Create a post</Text>
          </Box>
          {user && <NewPostForm user={user} />}
        </>
        <>
          {/* About */}
        </>
      </PageContent>
    </>
  )
}
export default SubmitPostPage