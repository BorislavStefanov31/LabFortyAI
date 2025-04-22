import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
import { ChatSettings } from "@/types"
import { OpenAIStream, StreamingTextResponse } from "ai"
import { ServerRuntime } from "next"
import OpenAI from "openai"
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs"

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
