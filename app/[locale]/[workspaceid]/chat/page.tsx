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
import { useContext } from "react"
import { usePathname } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import axios from "axios"
import { getServerProfile } from "@/lib/server/server-chat-helpers"

export default function ChatPage() {
  useHotkey("o", () => handleNewChat())
  useHotkey("l", () => {
    handleFocusChatInput()
  })

  const { chatMessages } = useContext(ChatbotUIContext)

  const { handleNewChat, handleFocusChatInput } = useChatHandler()

  const { theme } = useTheme()

  const searchParams = useSearchParams()
  const tabValue = searchParams.get("tab") || "chats"

  const [prompt, setPrompt] = useState("")
  const [imageSrc, setImageSrc] = useState("")
  const [newPrompt, setNewPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)

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
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
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
          height: "100vh"
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
                marginBottom: "20px",
                width: "100%",
                lineHeight: "1.5"
              }}
            />
            <button
              onClick={generateImage}
              disabled={isLoading}
              style={{
                padding: "10px 20px",
                cursor: isLoading ? "not-allowed" : "pointer",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                transition: "background-color 0.3s"
              }}
            >
              {isLoading ? "Generating..." : "Generate Image"}
            </button>
            {imageSrc && (
              <>
                <img
                  src={imageSrc}
                  alt="Generated"
                  style={{
                    width: "1024px",
                    height: "1024px",
                    marginBottom: "20px"
                  }}
                />
                <textarea
                  value={newPrompt}
                  onChange={e => setNewPrompt(e.target.value)}
                  placeholder="Enter new prompt based on the image"
                  rows={2}
                  style={{
                    width: "100%",
                    resize: "none",
                    marginBottom: "10px"
                  }}
                />
                <button
                  onClick={handleSubmitNewPrompt}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                >
                  Submit New Prompts
                </button>
              </>
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
