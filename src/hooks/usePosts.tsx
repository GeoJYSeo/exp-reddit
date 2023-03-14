import { collection, deleteDoc, doc, getDocs, query, where, writeBatch } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { RiContactsBookLine } from "react-icons/ri";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { authModalState } from "../atoms/authModalAtom";
import { communityState } from "../atoms/communityAtom";
import { Post, postState, PostVote } from "../atoms/postAtom";
import { auth, firestore, storage } from "../firebase/clientApp";

const usePosts = () => {
  
  const [user] = useAuthState(auth)
  const router = useRouter()
  const [postStateValue, setPostStateValue] = useRecoilState(postState)
  const communityStateValue  = useRecoilValue(communityState)
  const setAuthModalState = useSetRecoilState(authModalState)

  const onVote = async (event: React.MouseEvent<SVGElement, MouseEvent>, post: Post, vote: number, communityId: string) => {

    event.stopPropagation()
  
    if (!user?.uid) {
      setAuthModalState({ open: true, view: "login" })
    }

    // check for a user => if not, open auth modal
    try {

      const { voteStatus } = post
      const existingVote = postStateValue.postVotes.find(vote => vote.postId === post.id)

      const batch = writeBatch(firestore)
      const updatedPost = { ...post }
      const updatedPosts = [...postStateValue.posts]
      let updatedPostVotes = [...postStateValue.postVotes]
      let voteChange = vote

      // New vote
      if (!existingVote) {
        // create a new postVote document
        const postVoteRef = doc(collection(firestore, 'users', `${user?.uid}/postVotes`))
        const newVote: PostVote = {
          id: postVoteRef.id,
          postId: post.id!,
          communityId,
          voteValue: vote,
        }
        
        batch.set(postVoteRef, newVote)
        
        // add/substract 1 to/from post. voteStatus
        updatedPost.voteStatus = voteStatus + vote
        updatedPostVotes = [...updatedPostVotes, newVote]
        
      } else {

        const postVoteRef = doc(firestore, 'users', `${user?.uid}/postVotes/${existingVote.id}`)

        // Removing their vote (up => neutral OR down => neutral)
        if (existingVote.voteValue === vote) {
          // add/substract 1 to/from post. voteStatus
          updatedPost.voteStatus = voteStatus - vote
          updatedPostVotes = updatedPostVotes.filter(vote => vote.id !== existingVote.id)
          
          // deleting the postVote document
          batch.delete(postVoteRef)

          voteChange *= -1
        } else {
          // add/substract 2 to/from post. voteStatus
          updatedPost.voteStatus = voteStatus + 2 * vote

          const voteIdx = postStateValue.postVotes.findIndex(vote => vote.id === existingVote.id)
          updatedPostVotes[voteIdx] = {
            ...existingVote,
            voteValue: vote
          }

          // updating the existing postVote document
          batch.update(postVoteRef, {
            voteValue: vote,
          })

          voteChange = 2 * vote
        }
      }

      // update our post document
      const postRef = doc(firestore, 'posts', post.id)
      batch.update(postRef, { voteStatus: voteStatus + voteChange })

      await batch.commit()

      // update state with updated values
      const postIdx = postStateValue.posts.findIndex(item => item.id === post.id)
      updatedPosts[postIdx] = updatedPost

      setPostStateValue(prev => ({
        ...prev,
        posts: updatedPosts,
        postVotes: updatedPostVotes,
      }))

      if (postStateValue.selectedPost) {
        setPostStateValue(prev => ({
          ...prev,
          selectedPost: updatedPost,
        }))
      }

    } catch (e) {
      console.log('onVote error', e)
    }
  }

  const onSelectPost = async (post: Post) => {
    setPostStateValue(prev => ({
      ...prev,
      selectedPost: post,
    }))
    router.push(`/r/${post.communityId}/comments/${post.id}`)
  }
  
  const onDeletePost = async (post: Post): Promise<boolean> => {
    
    try {

      // check if image, delete if exist
      if (post.imageURL) {
        const imageRef = ref(storage, `posts/${post.id}/image`)
        await deleteObject(imageRef)
      }

      // delete post document from firebase
      const postDocRef = doc(firestore, 'posts', post.id)
      await deleteDoc(postDocRef)

      // update recoil state
      setPostStateValue(prev => ({
        ...prev,
        posts: prev.posts.filter(item => item.id !== post.id)
      }))

      return true
    } catch (e) {
      return false
    }
  }

  const getCommunityPostVotes = useCallback(async (communityId: string) => {
    try {
      const postVotesQuery = query(collection(firestore, 'users', `${user?.uid}/postVotes`), where('commumityId', "==", communityId))
      
      const postVoteDocs = await getDocs(postVotesQuery)
      const postVotes = postVoteDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      
      setPostStateValue(prev => ({
        ...prev,
        postVotes: postVotes as PostVote[]
      }))
    } catch (e) {
      console.log("getPostStateValue error", e)
    }
  }, [setPostStateValue, user?.uid])

  useEffect(() => {
    if (!user || !communityStateValue.currentCommunity?.id) return
    getCommunityPostVotes(communityStateValue.currentCommunity.id)
  }, [communityStateValue.currentCommunity, getCommunityPostVotes, user])

  useEffect(() => {
    if(!user) {
      setPostStateValue(prev => ({
        ...prev,
        postVotes: [],
      }))
    }
  }, [setPostStateValue, user])

  return {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost
  }
}
export default usePosts;
