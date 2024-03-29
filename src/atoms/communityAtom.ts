import { Timestamp } from "firebase/firestore"
import { atom } from "recoil"
import { v4 } from "uuid"

export interface Community {
  id: string
  creatorId: string
  numberOfMembers: number
  privacyType: "public" | "restricted" | "private"
  createdAt?: Timestamp
  imageURL?: string
}

export interface CommunitySnippet {
  communityId: string
  isModerator?: boolean
  imageURL?: string
}

interface CommunityState {
  mySnippets: CommunitySnippet[]
  currentCommunity?: Community
  snippetsFetched: boolean
}

const defalutCommunityState: CommunityState = {
  mySnippets: [],
  snippetsFetched: false,
}

export const communityState = atom<CommunityState>({
  key: `communitiesState${v4()}`,
  default: defalutCommunityState,
})
