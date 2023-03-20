import { Stack } from "@chakra-ui/react"
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore"
import { NextPage } from "next"
import { useCallback, useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { useRecoilValue } from "recoil"
import { communityState } from "../atoms/communityAtom"
import { Post, PostVote } from "../atoms/postAtom"
import CreatePostLink from "../components/community/CreatePostLink"
import PageContent from "../components/layout/PageContent"
import PostItem from "../components/post/PostItem"
import PostLoader from "../components/post/PostLoader"
import { auth, firestore } from "../firebase/clientApp"
import useCommunityData from "../hooks/useCommunityData"
import usePosts from "../hooks/usePosts"

const Home: NextPage = () => {

  const [user, loadingUser] = useAuthState(auth)
  const [loading, setLoading] = useState(false)
  const { postStateValue, setPostStateValue, onSelectPost, onDeletePost, onVote } = usePosts()
  const { communityStateValue } = useCommunityData()

  const buildNoUserHomeFeed = useCallback(async () => {

    setLoading(true)
    try {
      const postQuery = query(collection(firestore, "posts"), orderBy("voteStatus", "desc"), limit(10))

      const postDocs = await getDocs(postQuery)
      const posts = postDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setPostStateValue(prev => ({
        ...prev,
        posts: posts as Post[]
      }))

    } catch (e) {
      console.log("buildNoUserHomeFeed error", e)
    }
    setLoading(false)
  }, [setPostStateValue])

  const buildUserHomeFeed = useCallback(async () => {
    setLoading(true)
    
    try {
      if (communityStateValue.mySnippets.length) {
        // get posts from users' communities
        const myCommutyIds = communityStateValue.mySnippets.map(snippet => snippet.communityId)

        const postQuery = query(collection(firestore, "posts"), where("communityId", "in", myCommutyIds), limit(10))

        const postDocs = await getDocs(postQuery)
        const posts = postDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setPostStateValue(prev => ({
          ...prev,
          posts: posts as Post[]
        }))
      } else {
        buildNoUserHomeFeed()
      }
    } catch (e) {
      console.log('buildingUserHomeFeed error', e)      
    }

    setLoading(false)
  }, [buildNoUserHomeFeed, communityStateValue.mySnippets, setPostStateValue])

  const getUserPostVotes = useCallback(async () => {
    try {
      const postIds = postStateValue.posts.map(post => post.id)
      const postVotesQuery = query(collection(firestore, `users/${user?.uid}/postVotes`), where("postId", "in", postIds))
      const postVotesDocs = await getDocs(postVotesQuery)
      const postVotes = postVotesDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }))

      setPostStateValue(prev => ({
        ...prev,
        postVotes: postVotes as PostVote[],
      }))
    } catch (e) {
      console.log("getUsetPostVotes error", e)
    }
  }, [postStateValue.posts, setPostStateValue, user?.uid])
  
  useEffect(() => {
    if (communityStateValue.snippetsFetched) buildUserHomeFeed()
  }, [buildUserHomeFeed, communityStateValue.snippetsFetched])

  useEffect(() => {
    if (!user && !loadingUser) buildNoUserHomeFeed()
  }, [user, loadingUser, buildNoUserHomeFeed])

  useEffect(() => {
    if (user && postStateValue.posts.length) getUserPostVotes()
    return () => {
      setPostStateValue(prev => ({
        ...prev,
        postVotes: [],
      }))
    }
  }, [user, postStateValue.posts, getUserPostVotes, setPostStateValue])
  
  return (
    <PageContent>
      <>
      <CreatePostLink />
      {loading ? (
        <PostLoader />
      ) : (
        <Stack>
          {postStateValue.posts.map(post => (
            <PostItem
              key={post.id}
              post={post}
              onSelectPost={onSelectPost}
              onDeletePost={onDeletePost}
              onVote={onVote}
              userVoteValue={postStateValue.postVotes.find(item => item.postId === post.id)?.voteValue}
              userIsCreator={user?.uid === post.creatorId}
              homePage
            />
          ))}
        </Stack>
      )}
      </>
      <>
        {/* Recommendations */}
      </>
    </PageContent>
  )
}
export default Home
