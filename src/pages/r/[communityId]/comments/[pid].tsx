import { Post } from "@/src/atoms/postAtom"
import PageContent from "@/src/components/layout/PageContent"
import PostItem from "@/src/components/post/PostItem"
import { auth, firestore } from "@/src/firebase/clientApp"
import usePosts from "@/src/hooks/usePosts"
import { doc, getDoc } from "firebase/firestore"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useAuthState } from "react-firebase-hooks/auth"

const PostPage: React.FC = () => {
  
  const [user] = useAuthState(auth)
  const { postStateValue, setPostStateValue, onDeletePost, onVote, onSelectPost } = usePosts()
  
  const router = useRouter()
  const fetchPost = async (postId: string) => {
    try {
      const postDocRef = doc(firestore, "posts", postId)
      const postDoc = await getDoc(postDocRef)
      setPostStateValue(prev => ({
        ...prev,
        selectedPost: { id: postDoc.id, ...postDoc.data() } as Post,
      }))
    } catch (e) {
      console.log("fetchPost error", e)
    }
  }

  useEffect(() => {
    const { pid } = router.query

    if (pid && !postStateValue.selectedPost) {
      fetchPost(pid as string)
    }
  }, [postStateValue.selectedPost, router.query])

  return (
    <PageContent>
      <>
        {postStateValue.selectedPost && (
          <PostItem
            post={postStateValue.selectedPost}
            onVote={onVote}
            onDeletePost={onDeletePost}
            userVoteValue={
              postStateValue.postVotes.find(item => item.postId === postStateValue.selectedPost?.id)?.voteValue
            }
            userIsCreator={user?.uid === postStateValue.selectedPost?.creatorId}
          />
        )}
        {/* SelectedPost */}
        {/* Comments */}
      </>
      <>
        {/* About */}
      </>
    </PageContent>
  )
}
export default PostPage
