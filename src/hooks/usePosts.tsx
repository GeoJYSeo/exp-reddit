import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useRecoilState } from "recoil";
import { Post, postState } from "../atoms/postAtom";
import { firestore, storage } from "../firebase/clientApp";

const usePosts = () => {
  
  const [postStateValue, setPostStateValue] = useRecoilState(postState)

  const onVote = async () => {}

  const onSelectPost = async () => {}
  
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
  
  return {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost
  }
}
export default usePosts;