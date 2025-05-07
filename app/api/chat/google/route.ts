import { GoogleGenAI } from "@google/genai"
import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
import { ChatSettings } from "@/types"

export const runtime = "edge"

export async function POST(request: Request) {
  const json = await request.json()
  const { chatSettings, messages } = json as {
    chatSettings: ChatSettings
    messages: any[]
  }

  try {
    const profile = await getServerProfile()

    checkApiKey(profile.google_gemini_api_key, "Google")

    const ai = new GoogleGenAI({ apiKey: profile.google_gemini_api_key || "" })

    const lastMessage = messages.pop()

    let formattedHistory = []
    if (messages.length > 0) {
      if (messages[0].role !== "user") {
        formattedHistory = messages.slice(1)
      } else {
        formattedHistory = messages
      }
    }

    const chat = ai.chats.create({
      model: chatSettings.model,
      history: formattedHistory.map(msg => {
        let messageText = ""
        if (msg.content) {
          messageText = msg.content
        } else if (msg.parts && msg.parts.length > 0) {
          messageText =
            typeof msg.parts[0] === "string"
              ? msg.parts[0]
              : msg.parts[0]?.text || ""
        }

        let role = msg.role
        if (role === "assistant") {
          role = "model"
        }

        return {
          role: role,
          parts: [{ text: messageText }]
        }
      })
    })

    let lastMessageText = ""
    if (lastMessage.content) {
      lastMessageText = lastMessage.content
    } else if (lastMessage.parts && lastMessage.parts.length > 0) {
      lastMessageText =
        typeof lastMessage.parts[0] === "string"
          ? lastMessage.parts[0]
          : lastMessage.parts[0]?.text || ""
    }

    const stream = await chat.sendMessageStream({
      message: lastMessageText
    })

    const encoder = new TextEncoder()
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          controller.enqueue(encoder.encode(chunk.text))
        }
        controller.close()
      }
    })

    return new Response(readableStream, {
      headers: { "Content-Type": "text/plain" }
    })
  } catch (error: any) {
    console.error("Error details:", error)
    let errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500

    if (errorMessage.toLowerCase().includes("api key not found")) {
      errorMessage =
        "Google Gemini API Key not found. Please set it in your profile settings."
    } else if (errorMessage.toLowerCase().includes("api key not valid")) {
      errorMessage =
        "Google Gemini API Key is incorrect. Please fix it in your profile settings."
    }

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}
