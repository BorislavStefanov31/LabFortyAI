"use client"

import { ChatHelp } from "@/components/chat/chat-help"
import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { ChatInput } from "@/components/chat/chat-input"
import { ChatSettings } from "@/components/chat/chat-settings"
import { ChatUI } from "@/components/chat/chat-ui"
import { QuickSettings } from "@/components/chat/quick-settings"
import { Brand } from "@/components/ui/brand"
import { ChatbotUIContext } from "@/context/context"
import useHotkey from "@/lib/hooks/use-hotkey"
import { useTheme } from "next-themes"
import { supabase } from "@/lib/supabase/browser-client"
import { useContext } from "react"
import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import axios from "axios"
import Image from "next/image"
import { getProfileByUserId } from "@/db/profile"
import labFortyLogo from "./LabForty_Logo_White.svg"

export default function ChatPage() {
  useHotkey("o", () => handleNewChat())
  useHotkey("l", () => {
    handleFocusChatInput()
  })

  const { chatMessages, chatSettings } = useContext(ChatbotUIContext)

  const [defaultModel, setDefaultModel] = useState<string | null>(null)

  useEffect(() => {
    if (!defaultModel && chatSettings?.model) {
      setDefaultModel(chatSettings.model)
    }
  }, [chatSettings, defaultModel])

  const fetchStartingData: any = async () => {
    const session = (await supabase.auth.getSession()).data.session

    if (session) {
      const user = session.user

      const profile = await getProfileByUserId(user.id)

      return profile
    }
  }

  const { handleNewChat, handleFocusChatInput } = useChatHandler()

  const { theme } = useTheme()

  const searchParams = useSearchParams()
  const tabValue = searchParams.get("tab") || "chats"

  const [prompt, setPrompt] = useState("")
  const [imageSrc, setImageSrc] = useState("")
  const [newPrompt, setNewPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [userProfile, setUserProfile]: any = useState(null)

  const [isModalOpen, setIsModalOpen] = useState(false)

  // Function to handle image generation and other existing code...

  // Function to toggle modal visibility
  const toggleModal = () => setIsModalOpen(!isModalOpen)

  useEffect(() => {
    const fetchData = async () => {
      const profileData = await fetchStartingData()
      setUserProfile(profileData)
    }

    fetchData().catch(console.error)
  }, [])

  const generateImage = async () => {
    setIsLoading(true) // Start loading
    const data = {
      model: "dall-e-3",
      prompt: prompt,
      size: "1024x1024",
      n: 1 // Number of images to generate
    }

    const config = {
      headers: {
        Authorization: `Bearer ${userProfile?.openai_api_key}`,
        "Content-Type": "application/json"
      }
    }

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/images/generations",
        data,
        config
      )
      // Assuming the API returns the image URL in the response; adjust as needed
      const generatedImageUrl = response.data.data[0].url
      setImageSrc(generatedImageUrl)
    } catch (error) {
      console.error("Error generating image:", error)
    } finally {
      setIsLoading(false) // End loading
    }
  }

  const handleSubmitNewPrompt = () => {
    const combinedData = {
      newPrompt: newPrompt,
      imageReference: imageSrc
    }

    // Here you would typically send combinedData to your server or API for processing
    setNewPrompt("")
  }

  const ImageModal = ({ src, onClose }: { src: any; onClose: any }) => (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000 // Ensure it's above other content
      }}
      onClick={onClose} // Close modal when background is clicked
    >
      <img
        src={src}
        style={{
          maxHeight: "90vh",
          maxWidth: "90vw",
          borderRadius: "8px"
        }}
        onClick={e => e.stopPropagation()} // Prevent click inside the image from closing modal
      />
    </div>
  )

  // Updated return statement to include modal logic
  if (imageSrc && isModalOpen) {
    // Display the modal if an image is generated and modal is open
    return <ImageModal src={imageSrc} onClose={toggleModal} />
  }

  if (tabValue === "Image Generation") {
    return (
      <div
        className="chat-page-container"
        style={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // Center align the content
          justifyContent: "flex-start", // Center vertically in the viewport
          height: "100vh",
          gap: "20px" // Add space between elements
        }}
      >
        {tabValue === "Image Generation" && (
          <>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Enter a prompt for the image"
              rows={3}
              style={{
                width: "100%",
                maxWidth: "600px", // Limit max width for larger screens
                lineHeight: "1.5",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}
            />
            <button
              onClick={generateImage}
              disabled={isLoading || !!imageSrc}
              style={{
                padding: "10px 20px",
                cursor: isLoading ? "not-allowed" : "pointer",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                transition: "background-color 0.3s, transform 0.2s"
              }}
            >
              {isLoading ? "Generating..." : "Generate Image"}
            </button>
            {imageSrc && (
              <Image
                onClick={toggleModal}
                src={imageSrc}
                alt="Generated"
                style={{
                  maxWidth: "1024px", // Ensure it's responsive
                  maxHeight: "1024px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  cursor: "zoom-in" // Changes cursor to magnifying glass on hover
                }}
                height={512}
                width={512}
              />
            )}
          </>
        )}
      </div>
    )
  }

  return (
    <>
      {chatMessages.length === 0 ? (
        <div className="relative flex h-full flex-col items-center justify-center">
          <div className="top-50% left-50% -translate-x-50% -translate-y-50% absolute mb-20">
            <Image
              src={labFortyLogo}
              width={200}
              height={200}
              alt="LabForty-Logo"
            />
          </div>
          <div className="absolute left-2 top-2">
            <QuickSettings />
          </div>

          <div className="absolute right-2 top-2">
            <ChatSettings setDefaultModel={setDefaultModel} />
          </div>

          <div className="flex grow flex-col items-center justify-center" />

          <div className="w-full min-w-[300px] items-end px-2 pb-3 pt-0 sm:w-[600px] sm:pb-8 sm:pt-5 md:w-[700px] lg:w-[700px] xl:w-[800px]">
            <ChatInput defaultModel={defaultModel} />
          </div>

          <div className="absolute bottom-2 right-2 hidden md:block lg:bottom-4 lg:right-4">
            <ChatHelp />
          </div>
        </div>
      ) : (
        <ChatUI setDefaultModel={setDefaultModel} defaultModel={defaultModel} />
      )}
    </>
  )
}
