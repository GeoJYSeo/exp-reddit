import { Flex, Image } from "@chakra-ui/react"
import React from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import RightContent from "./RightContent/RightContent"
import SearchInput from "./SearchInput"
import { auth } from "../../firebase/clientApp"
import Directory from "./directory/Directory"
import useDirectory from "@/src/hooks/useDirectory"
import { defaultMenuItem } from "@/src/atoms/directoryMenuAtom"

const Navbar = () => {

  const [user, loading, error] = useAuthState(auth)
  const { onSelectMenuItem } = useDirectory()

  return (
    <Flex bg="white" height="44px" padding="6px 12px" justify={{ md: "space-between" }}>
      <Flex 
        align="center"
        width={{ base: "40px", md: "auto" }}
        mr={{ base: 0, md: 2 }}
        cursor="pointer"
        onClick={() => onSelectMenuItem(defaultMenuItem)}
      >
        <Image src="/images/redditFace.svg" height="30px" alt="" />
        <Image src="/images/redditText.svg" height="46px" alt="" display={{ base: "none", md: "unset" }} />
      </Flex>
      {user && <Directory />}
      <SearchInput user={user} />
      <RightContent user={user} />
    </Flex>
  )
}

export default Navbar
