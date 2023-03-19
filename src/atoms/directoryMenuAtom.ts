import { TiHome } from "react-icons/ti"
import { IconType } from "react-icons"
import { atom } from "recoil"
import { v4 } from "uuid"

export type DirectMenuitem = {
  displayText: string
  link: string
  icon: IconType
  iconColor: string
  imageURL?: string
}

interface DirectoryMenuState {
  isOpen: boolean
  selectedMenuItem: DirectMenuitem
}

export const defaultMenuItem: DirectMenuitem = {
  displayText: "HOME",
  link: "/",
  icon: TiHome,
  iconColor: "black",
}

export const defaultMenuState: DirectoryMenuState = {
  isOpen: false,
  selectedMenuItem: defaultMenuItem
}

export const directoryMenuState = atom<DirectoryMenuState>({
  key: `directoryMenuState${v4()}`,
  default: defaultMenuState
})
