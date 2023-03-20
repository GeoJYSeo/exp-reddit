import { Alert, AlertIcon, Flex, Icon, Text } from "@chakra-ui/react";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { BiPoll } from "react-icons/bi";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import TabItem from "./TabItem";
import { useState } from "react";
import TextInputs from "./postForm/TextInputs";
import ImageUpload from "./postForm/ImageUpload";
import { User } from "firebase/auth";
import { useRouter } from "next/router";
import { addDoc, collection, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
import { firestore, storage } from "@/src/firebase/clientApp";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import useSelectFile from "@/src/hooks/useSelectFile";

type NewPostFormProps = {
  user: User
  communityImageURL?: string
};

const formTabs: TabItemType[] = [
  {
    title: "Post",
    icon: IoDocumentText
  },
  {
    title: "Image & Video",
    icon: IoImageOutline
  },
  {
    title: "Link",
    icon: BsLink45Deg
  },
  {
    title: "Poll",
    icon: BiPoll
  },
  {
    title: "Talk",
    icon: BsMic
  },
]

export type TabItemType = {
  title: string
  icon: typeof Icon.arguments
}

const NewPostForm:React.FC<NewPostFormProps> = ({ user, communityImageURL }) => {

  const router = useRouter()

  const [selectedTab, setSelectedTab] = useState(formTabs[0].title)
  const [textInputs, setTextInputs] = useState({
    title: "",
    body: "",
  })
  const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const handleCreatePost = async () => {

    const { communityId } = router.query
    // create new post object => type Post
    setLoading(true)
    try {
      // store the post in db
      const postDocRef = await addDoc(collection(firestore, "posts"), {
        communityId: communityId as string,
        communityImageURL: communityImageURL ?? "",
        creatorId: user.uid,
        creatorDisplayName: user.email!.split("@")[0],
        title: textInputs.title,
        body: textInputs.body,
        numberOfComments: 0,
        voteStatus: 0,
        createdAt: serverTimestamp() as Timestamp,
      })
      
      // check for selectedFile
      if (selectedFile) {
        // store in storeage => getDownloadURL (return imageURL)
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`)
        await uploadString(imageRef, selectedFile, 'data_url')
        const downloadURL = await getDownloadURL(imageRef)

        // update post doc by adding imageURL
        await updateDoc(postDocRef, {
          imageURL: downloadURL,
        })
      }
      // redirect the user back to the communityPage using the router
      router.back()
    } catch (e: any) {
      console.log("handleCreatePost error", e.message)
      setError(true)
    }
    setLoading(false)
  }

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { target: { name, value }} = e
    setTextInputs(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  return (
    <Flex direction="column" bg="white" borderRadius={4}>
      <Flex width="100%">
        {formTabs.map(item => (
          <TabItem
            key={item.title}
            item={item}
            selected={item.title === selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ))}
      </Flex>
      <Flex p={4}>
        {selectedTab === "Post" && (
          <TextInputs
            textInputs={textInputs}
            onChange={onTextChange}
            handleCreatePost={handleCreatePost}
            loading={loading}
          />
        )}
        {selectedTab === "Image & Video" && (
          <ImageUpload
            selectedFile={selectedFile}
            onSelectImage={onSelectFile}
            setSelectedTab={setSelectedTab}
            setSelectedFile={setSelectedFile}
          />
        )}
      </Flex>
      {error && (
        <Alert status="error">
          <AlertIcon />
          <Text mr={2}>Error creating post</Text>
        </Alert>
      )}
    </Flex>
  )
}
export default NewPostForm;