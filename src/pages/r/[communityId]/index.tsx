import { Community, communityState } from "@/src/atoms/communityAtom"
import { doc, getDoc } from "firebase/firestore"
import { GetServerSidePropsContext } from "next"
import { firestore } from "../../../firebase/clientApp"
import safeJsonStringify from "safe-json-stringify"
import NotFound from "@/src/components/community/NotFound"
import Header from "@/src/components/community/Header"
import PageContent from "@/src/components/layout/PageContent"
import CreatePostLink from "@/src/components/community/CreatePostLink"
import Posts from "@/src/components/post/Posts"
import { useEffect } from "react"
import { useSetRecoilState } from "recoil"
import About from "@/src/components/community/About"

type CommunityPageProps = {
  communityData: Community
}

const CommunityPage:React.FC<CommunityPageProps> = ({ communityData }) => {

  const setCommunityStateValue = useSetRecoilState(communityState)

  useEffect(() => {
    setCommunityStateValue(prev => ({
      ...prev,
      currentCommunity: communityData
    }))
  }, [communityData, setCommunityStateValue])
  
  if (!communityData) {
    return (
      <NotFound />
    )
  }

  return (
    <>
      <Header communityData={communityData} />
      <PageContent>
        <>
          <CreatePostLink />
          <Posts communityData={communityData} />
        </>
        <>
          <About communityData={communityData} />
        </>
      </PageContent>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  
  // get community data and apss it ro client
  try {
    const communityDocRef = doc(firestore, "communities", context.query.communityId as string)
    const communityDoc = await getDoc(communityDocRef)

    return {
      props: {
        communityData: communityDoc.exists() ?
          JSON.parse(safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() }))
          :
          ""
      }
    }
  } catch (e) {
    console.log("getServerSideProps error", e)
  }
}

export default CommunityPage
