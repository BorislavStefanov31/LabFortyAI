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
import { getProfileByUserId } from "@/db/profile"

export default function ChatPage() {
  useHotkey("o", () => handleNewChat())
  useHotkey("l", () => {
    handleFocusChatInput()
  })

  const { chatMessages } = useContext(ChatbotUIContext)

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
  console.log("🚀 ~ ChatPage ~ userProfile:", userProfile)

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

    console.log(combinedData)
    // Here you would typically send combinedData to your server or API for processing
    setNewPrompt("")
  }

  console.log("🚀 ~ ChatPage ~ tabValue:", tabValue)

  if (tabValue === "Image Creation") {
    return (
      <div
        className="chat-page-container"
        style={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // Center align the content
          justifyContent: "center", // Center vertically in the viewport
          height: "100vh",
          gap: "20px" // Add space between elements
        }}
      >
        {tabValue === "Image Creation" && (
          <>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Enter a prompt for the image"
              rows={3}
              style={{
                resize: "none",
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
              <img
                src={imageSrc}
                alt="Generated"
                style={{
                  maxWidth: "1024px", // Ensure it's responsive
                  maxHeight: "1024px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
                }}
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
          <div className="absolute left-2 top-2">
            <QuickSettings />
          </div>

          <div className="absolute right-2 top-2">
            <ChatSettings />
          </div>

          <div className="flex grow flex-col items-center justify-center" />

          <div className="w-full min-w-[300px] items-end px-2 pb-3 pt-0 sm:w-[600px] sm:pb-8 sm:pt-5 md:w-[700px] lg:w-[700px] xl:w-[800px]">
            <ChatInput />
          </div>

          <div className="absolute bottom-2 right-2 hidden md:block lg:bottom-4 lg:right-4">
            <ChatHelp />
          </div>
        </div>
      ) : (
        <ChatUI />
      )}
    </>
  )
}
