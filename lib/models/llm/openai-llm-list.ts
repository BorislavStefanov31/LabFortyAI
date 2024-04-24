import { LLM } from "@/types"

const OPENAI_PLATORM_LINK = "https://platform.openai.com/docs/overview"

// OpenAI Models (UPDATED 1/25/24) -----------------------------

// GPT-4 Turbo (UPDATED 1/25/24)
const GPT4Turbo: LLM = {
  modelId: "gpt-4-turbo-preview",
  modelName: "GPT-4 Turbo",
  provider: "openai",
  hostedId: "gpt-4-turbo-preview",
  platformLink: OPENAI_PLATORM_LINK,
  imageInput: false
}

// GPT-4 Vision (UPDATED 12/18/23)
const GPT4Vision: LLM = {
  modelId: "gpt-4-vision-preview",
  modelName: "GPT-4 Vision",
  provider: "openai",
  hostedId: "gpt-4-vision-preview",
  platformLink: OPENAI_PLATORM_LINK,
  imageInput: true
}

const GPT4TurboPLus: LLM = {
  modelId: "gpt-4-turbo",
  modelName: "GPT-4 Turbo - upgraded",
  provider: "openai",
  hostedId: "gpt-4-turbo	",
  platformLink: OPENAI_PLATORM_LINK,
  imageInput: true
}

export const OPENAI_LLM_LIST: LLM[] = [GPT4Turbo, GPT4TurboPLus, GPT4Vision]
