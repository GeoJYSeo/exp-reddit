import { Flex } from "@chakra-ui/react";
import AythModal from "../../auth/AythModal";
import AuthButtons from "./AuthButtons";

type RightContentProps = {
  // user: any
};

const RightContent:React.FC<RightContentProps> = () => {
  
  return (
    <>
      <AythModal />
      <Flex justify="center" align="center">
        <AuthButtons />
      </Flex>
    </>
  )
}
export default RightContent;