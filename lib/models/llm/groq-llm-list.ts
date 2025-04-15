import { LLM } from "@/types"

const GROQ_PLATORM_LINK = "https://groq.com/"

const LLaMA31_8B: LLM = {
  modelId: "llama-3.1-8b-instant",
  modelName: "LLaMA31-8b-chat",
  provider: "groq",
  hostedId: "llama-3.1-8b-instant",
  platformLink: GROQ_PLATORM_LINK,
  imageInput: false
}

export const GROQ_LLM_LIST: LLM[] = [LLaMA31_8B]
