import About from "@/src/components/community/About"
import PageContent from "@/src/components/layout/PageContent"
import NewPostForm from "@/src/components/post/NewPostForm"
import { auth } from "@/src/firebase/clientApp"
import useCommunityData from "@/src/hooks/useCommunityData"
import { Box, Text } from "@chakra-ui/react"
import { useAuthState } from "react-firebase-hooks/auth"
import { useRecoilValue } from "recoil"

const SubmitPostPage:React.FC = () => {

  const [user] = useAuthState(auth)
  const { communityStateValue } = useCommunityData()

  return (
    <>
      <PageContent>
        <>
          <Box p="14px 0px" borderBottom="1px solid" borderColor="white">
            <Text>Create a post</Text>
          </Box>
          {user && <NewPostForm user={user} communityImageURL={communityStateValue.currentCommunity?.imageURL} />}
        </>
        <>
          {communityStateValue.currentCommunity && (
            <About communityData={communityStateValue.currentCommunity} />
          )}
        </>
      </PageContent>
    </>
  )
}
export default SubmitPostPage
