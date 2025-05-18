import { getMessageImageFromStorage } from "@/db/storage/message-images-server"
import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
import { supabase } from "@/lib/supabase/browser-client"
import { ChatSettings } from "@/types"
import { OpenAIStream, StreamingTextResponse } from "ai"
import { ServerRuntime } from "next"
import OpenAI from "openai"
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs"

function getLastImageFromMessage(messages: any[]) {
  if (!messages || messages.length === 0) {
    return null
  }

  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i]

    if (Array.isArray(message.content)) {
      const imageItems = message.content.filter(
        (item: { type: string }) => item.type === "image_url"
      )
      if (imageItems.length > 0) {
        return imageItems[0].image_url.url
      }
    }

    if (typeof message.content === "string" && message.role === "assistant") {
      try {
        const parsedContent = JSON.parse(message.content)
        if (parsedContent.imagePath) {
          return parsedContent.imagePath
        }
      } catch (e) {}
    }
  }

  return null
}

function getLastMessageText(messages: any) {
  if (!messages || messages.length === 0) {
    return ""
  }

  const lastMessage = messages[messages.length - 1]

  if (Array.isArray(lastMessage.content)) {
    const textItems = lastMessage.content.filter(
      (item: { type: string }) => item.type === "text"
    )
    return textItems.map((item: { text: any }) => item.text).join(" ")
  }

  if (typeof lastMessage.content === "string") {
    return lastMessage.content
  }

  return ""
}

export const runtime: ServerRuntime = "edge"

export async function POST(request: Request) {
  const json = await request.json()
  let { chatSettings, messages } = json as {
    chatSettings: ChatSettings
    messages: any[]
  }

  try {
    const profile = await getServerProfile()

    checkApiKey(profile.openai_api_key, "OpenAI")

    const openai = new OpenAI({
      apiKey: profile.openai_api_key || "",
      organization: profile.openai_organization_id
    })

    if (chatSettings.model === "gpt-image-1") {
      const userMessages = messages.filter(msg => msg.role === "user")
      let combinedPrompt = ""

      for (const message of userMessages) {
        if (Array.isArray(message.content)) {
          const textContent = message.content
            .filter((item: { type: string }) => item.type === "text")
            .map((item: { text: any }) => item.text)
            .join(" ")
          combinedPrompt += textContent + " "
        } else {
          combinedPrompt += message.content + " "
        }
      }

      combinedPrompt = combinedPrompt.trim()

      const hasImages = messages.length > 2

      let imageResponse

      if (hasImages) {
        const imageDataUrl = getLastImageFromMessage(messages)

        const lastMessageText = getLastMessageText(messages)

        if (!imageDataUrl) {
          throw new Error("No valid image found in message")
        }

        let imageBlob

        if (
          typeof imageDataUrl === "string" &&
          imageDataUrl.startsWith("ai_generated_images/")
        ) {
          const publicUrlData = await getMessageImageFromStorage(imageDataUrl)

          if (!publicUrlData) {
            throw new Error("Failed to get public URL for image")
          }

          const imageResponse = await fetch(publicUrlData)
          imageBlob = await imageResponse.blob()
        } else {
          const imageResponse = await fetch(imageDataUrl)
          imageBlob = await imageResponse.blob()
        }

        const formData = new FormData()
        formData.append("image", imageBlob, "image.png")
        formData.append("prompt", lastMessageText)
        formData.append("model", "gpt-image-1")
        formData.append("n", "1")

        const openaiResponse = await fetch(
          "https://api.openai.com/v1/images/edits",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${profile.openai_api_key}`
            },
            body: formData
          }
        )

        const imageResponseData = await openaiResponse.json()

        if (!openaiResponse.ok) {
          console.error("OpenAI API error:", imageResponseData)
          throw new Error(
            `OpenAI API error: ${imageResponseData.error?.message || "Unknown error"}`
          )
        }

        imageResponse = imageResponseData
      } else {
        imageResponse = await openai.images.generate({
          model: "gpt-image-1",
          prompt: combinedPrompt,
          n: 1
        })
      }

      const imageData = imageResponse.data[0]?.b64_json

      if (imageData) {
        const fileName = `ai_generated_images/generated-image-${Date.now()}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("message_images")
          .upload(fileName, Buffer.from(imageData, "base64"), {
            contentType: "image/png"
          })

        if (uploadError) {
          throw new Error("Failed to upload image to Supabase storage")
        }

        const { data: publicUrlData } = supabase.storage
          .from("message_images")
          .getPublicUrl(uploadData.path)

        const imageUrl = publicUrlData.publicUrl

        return new Response(
          JSON.stringify({
            content: imageUrl,
            imagePath: uploadData.path
          })
        )
      }
    }

    const isStreaming = chatSettings.model !== "o3-mini"

    if (chatSettings.model === "gpt-4o-search-preview") {
      messages = messages.map(message => {
        if (Array.isArray(message.content)) {
          const textContents = message.content
            .filter((item: { type: string }) => item.type === "text")
            .map((item: { text: any }) => item.text)

          return {
            ...message,
            content: textContents.join(" ")
          }
        }
        return message
      })
    }

    // Add the specific message to the messages array
    if (!isStreaming || chatSettings.model === "o1") {
      messages.push({
        role: "user",
        content:
          "If there (don't add code if there is no need) is a code give me it like this: \n\n```THE_PROGRAMMING_LANGUAGE_HERE\nsquares = [x**2 for x in range(10)]\n```"
      })
    }

    const requestOptions = {
      model: chatSettings.model as ChatCompletionCreateParamsBase["model"],
      messages: messages as ChatCompletionCreateParamsBase["messages"],
      stream: isStreaming || chatSettings.model === "o3-mini"
    } as any

    if (chatSettings.model !== "gpt-4o-search-preview") {
      requestOptions.temperature =
        chatSettings.model === "o1" ||
        chatSettings.model === "o1-preview" ||
        chatSettings.model === "o1-mini" ||
        chatSettings.model === "o3-mini" ||
        chatSettings.model === "o3" ||
        chatSettings.model === "o4-mini"
          ? 1
          : chatSettings.temperature
    }

    if (chatSettings.model === "gpt-4.5-preview") {
      requestOptions.max_completion_tokens = 1000
    } else if (
      chatSettings.model === "gpt-4-vision-preview" ||
      chatSettings.model === "chatgpt-4o-latest" ||
      chatSettings.model === "gpt-4o" ||
      chatSettings.model === "o1" ||
      chatSettings.model === "o1-preview" ||
      chatSettings.model === "o1-mini" ||
      chatSettings.model === "o3-mini" ||
      chatSettings.model === "gpt-4o-search-preview"
    ) {
      requestOptions.max_completion_tokens =
        chatSettings.model === "o1" || chatSettings.model === "o3-mini"
          ? 4096
          : 16384
    }

    const response = await openai.chat.completions.create(requestOptions)

    if (isStreaming || chatSettings.model === "o3-mini") {
      const stream = OpenAIStream(response as any)
      return new StreamingTextResponse(stream)
    } else {
      const messageContent =
        response.choices[0]?.message?.content ||
        "Some error happened DM Borislav Stefanov"
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode(messageContent))
          controller.close()
        }
      })
      return new StreamingTextResponse(stream)
    }
  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500

    if (errorMessage.toLowerCase().includes("api key not found")) {
      errorMessage =
        "OpenAI API Key not found. Please set it in your profile settings."
    } else if (errorMessage.toLowerCase().includes("incorrect api key")) {
      errorMessage =
        "OpenAI API Key is incorrect. Please fix it in your profile settings."
    }

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}
