import { Timestamp } from 'firebase/firestore';
import { atom } from "recoil"
import { v4 } from 'uuid';

export type Post = {
  communityId: string
  creatorId: string
  creatorDisplayName: string
  title: string
  body: string
  numberOdComments: number
  voteStatus: number
  imageURL?: string
  communityImageURL?: string
  createdAt: Timestamp
}

interface PostState {
  selectedPost: Post | null
  posts: Post[]
  // postVotes
}

const defaultPostState: PostState = {
  selectedPost: null,
  posts: []
}

export const postState = atom<PostState>({
  key: `postState${v4}`,
  default: defaultPostState,
})
