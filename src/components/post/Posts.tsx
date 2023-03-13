import { Community } from "@/src/atoms/communityAtom"
import { Post } from "@/src/atoms/postAtom"
import { auth, firestore } from "@/src/firebase/clientApp"
import usePosts from "@/src/hooks/usePosts"
import { Stack } from "@chakra-ui/react"
import { collection, getDocs, orderBy, query, where } from "firebase/firestore"
import React, { useCallback, useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import PostItem from "./PostItem"
import PostLoader from "./PostLoader"

type postsProps = {
  communityData: Community
}

const Posts:React.FC<postsProps> = ({ communityData }) => {
  
  const [user] = useAuthState(auth)
  const [loading, setLoading] = useState(false)
  const {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost
  } = usePosts()

  const getPosts = useCallback(async () => {
    setLoading(true)

    try {
      // get posts for this community
      const postsQuery = query(
        collection(firestore, "posts"),
        where("communityId", "==", communityData.id),
        orderBy("createdAt", "desc")  
      )
      const postDocs = await getDocs(postsQuery)
      
      // Store in post state
      const posts = postDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setPostStateValue(prev => ({
        ...prev,
        posts: posts as Post[]
      }))
      
    } catch (e: any) {
      console.log("getPosts error", e.message)
    }

    setLoading(false)
  }, [communityData.id, setPostStateValue])

  useEffect(() => {
    getPosts()
  }, [getPosts])

  return (
    <>
      {loading ? (
        <PostLoader />
      ) : (
        <Stack>
          {postStateValue.posts.map(item => (
            <PostItem
              key={item.id}
              post={item}
              userIsCreator={user?.uid === item.creatorId}
              userVoteValue={postStateValue.postVotes.find(vote => vote.postId === item.id)?.voteValue}
              onVote={onVote}
              onSelectPost={onSelectPost}
              onDeletePost={onDeletePost}
            />
          ))}
        </Stack>
      )}
    </>
  )
}
export default Posts;
