import { Community } from "@/src/atoms/CommunityAtom"
import { doc, getDoc } from "firebase/firestore"
import { GetServerSidePropsContext } from "next"
import { firestore } from "../../../firebase/clientApp"
import safeJsonStringify from "safe-json-stringify"
import NotFound from "@/src/components/community/NotFound"
import Header from "@/src/components/community/Header"

type CommunityPageProps = {
  communityData: Community
}

const CommunityPage:React.FC<CommunityPageProps> = ({ communityData }) => {

  if (!communityData) {
    return (
      <NotFound />
    )
  }
  
  return (
    <>
      <Header communityData={communityData} />
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
