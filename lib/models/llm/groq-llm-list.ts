import { LLM } from "@/types"

const GROQ_PLATORM_LINK = "https://groq.com/"

const MIXTRAL_8X7B: LLM = {
  modelId: "mixtral-8x7b-32768",
  modelName: "Mixtral-8x7b-Instruct-v0.1",
  provider: "groq",
  hostedId: "mixtral-8x7b-32768",
  platformLink: GROQ_PLATORM_LINK,
  imageInput: false
}

const LLaMA31_405B: LLM = {
  modelId: "llama-3.1-405b-reasoning",
  modelName: "LLaMA31-405b-chat",
  provider: "groq",
  hostedId: "llama-3.1-405b-reasoning",
  platformLink: GROQ_PLATORM_LINK,
  imageInput: false
}

const LLaMA31_70B: LLM = {
  modelId: "llama-3.1-70b-versatile",
  modelName: "LLaMA31-70b-chat",
  provider: "groq",
  hostedId: "llama-3.1-70b-versatile",
  platformLink: GROQ_PLATORM_LINK,
  imageInput: false
}

const LLaMA31_8B: LLM = {
  modelId: "llama-3.1-8b-instant",
  modelName: "LLaMA31-8b-chat",
  provider: "groq",
  hostedId: "llama-3.1-8b-instant",
  platformLink: GROQ_PLATORM_LINK,
  imageInput: false
}

const LLaMA3_70B_TOOL: LLM = {
  modelId: "llama3-groq-70b-8192-tool-use-preview",
  modelName: "LLaMA3-Groq-70b-Tool-Use",
  provider: "groq",
  hostedId: "llama3-groq-70b-8192-tool-use-preview",
  platformLink: GROQ_PLATORM_LINK,
  imageInput: false
}

const LLaMA3_8B_TOOL: LLM = {
  modelId: "llama3-groq-8b-8192-tool-use-preview",
  modelName: "LLaMA3-Groq-70b-Tool-Use",
  provider: "groq",
  hostedId: "llama3-groq-8b-8192-tool-use-preview",
  platformLink: GROQ_PLATORM_LINK,
  imageInput: false
}

export const GROQ_LLM_LIST: LLM[] = [
  LLaMA31_405B,
  LLaMA3_8B_TOOL,
  LLaMA3_70B_TOOL,
  LLaMA31_8B,
  LLaMA31_70B,
  MIXTRAL_8X7B
]
