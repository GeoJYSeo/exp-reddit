import { atom } from "recoil"
import { v4 } from "uuid"

export interface AuthModalState {
  open: boolean
  view: "login" | "signup" | "resetPassword"
}

const defaultModalState: AuthModalState = {
  open: false,
  view: "login",
}

export const authModalState = atom<AuthModalState>({
  key: `authModalState${v4()}`,
  default: defaultModalState,
})
