import { LLM } from "@/types"

const GOOGLE_PLATORM_LINK = "https://ai.google.dev/"

// Google Models (UPDATED 12/22/23) -----------------------------

// Gemini Pro (UPDATED 12/22/23)
const GEMINI_PRO: LLM = {
  modelId: "gemini-pro",
  modelName: "Gemini Pro",
  provider: "google",
  hostedId: "gemini-pro",
  platformLink: GOOGLE_PLATORM_LINK,
  imageInput: false
}

const GEMINI_1_5_PRO_EXP0801: LLM = {
  modelId: "gemini-1.5-pro-exp-0801",
  modelName: "Gemini 1.5 Pro Exp 0801",
  provider: "google",
  hostedId: "gemini-1.5-pro-exp-0801",
  platformLink: GOOGLE_PLATORM_LINK,
  imageInput: true
}

const GEMINI_1_5_FLASH: LLM = {
  modelId: "gemini-1.5-flash",
  modelName: "Gemini 1.5 Flash",
  provider: "google",
  hostedId: "gemini-1.5-flash",
  platformLink: GOOGLE_PLATORM_LINK,
  imageInput: true
}

export const GOOGLE_LLM_LIST: LLM[] = [
  GEMINI_PRO,
  GEMINI_1_5_PRO_EXP0801,
  GEMINI_1_5_FLASH
]
