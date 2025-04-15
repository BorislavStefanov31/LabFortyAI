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

// // GPT-4 Vision (UPDATED 12/18/23)
// const GPT4Vision: LLM = {
//   modelId: "gpt-4-vision-preview",
//   modelName: "GPT-4 Vision",
//   provider: "openai",
//   hostedId: "gpt-4-vision-preview",
//   platformLink: OPENAI_PLATORM_LINK,
//   imageInput: true
// }

const GPT4OLatest: LLM = {
  modelId: "chatgpt-4o-latest",
  modelName: "GPT-4o",
  provider: "openai",
  hostedId: "chatgpt-4o-latest",
  platformLink: OPENAI_PLATORM_LINK,
  imageInput: true
}

const GPT4O: LLM = {
  modelId: "gpt-4o",
  modelName: "GPT-4o",
  provider: "openai",
  hostedId: "gpt-4o",
  platformLink: OPENAI_PLATORM_LINK,
  imageInput: true
}

const GPT4oMini: LLM = {
  modelId: "gpt-4o-mini",
  modelName: "GPT-4o Mini",
  provider: "openai",
  hostedId: "gpt-4o-mini",
  platformLink: OPENAI_PLATORM_LINK,
  imageInput: true
}

const o1: LLM = {
  modelId: "o1",
  modelName: "o1",
  provider: "openai",
  hostedId: "o1",
  platformLink: OPENAI_PLATORM_LINK,
  imageInput: false
}

const o1Preview: LLM = {
  modelId: "o1-preview",
  modelName: "o1-preview",
  provider: "openai",
  hostedId: "o1-preview",
  platformLink: OPENAI_PLATORM_LINK,
  imageInput: false
}

const o1Mini: LLM = {
  modelId: "o1-mini",
  modelName: "o1-mini",
  provider: "openai",
  hostedId: "o1-mini",
  platformLink: OPENAI_PLATORM_LINK,
  imageInput: false
}

const o3Mini: LLM = {
  modelId: "o3-mini",
  modelName: "o3-mini",
  provider: "openai",
  hostedId: "o3-mini",
  platformLink: OPENAI_PLATORM_LINK,
  imageInput: false
}

const GPT41Preview: LLM = {
  modelId: "gpt-4.1",
  modelName: "GPT 4.1",
  provider: "openai",
  hostedId: "gpt-4.1",
  platformLink: OPENAI_PLATORM_LINK,
  imageInput: true
}

const GPT41PreviewNano: LLM = {
  modelId: "gpt-4.1-nano",
  modelName: "GPT 4.1 nano",
  provider: "openai",
  hostedId: "gpt-4.1-nano",
  platformLink: OPENAI_PLATORM_LINK,
  imageInput: true
}

const GPT41PreviewMini: LLM = {
  modelId: "gpt-4.1-mini",
  modelName: "GPT 4.1 mini",
  provider: "openai",
  hostedId: "gpt-4.1-mini",
  platformLink: OPENAI_PLATORM_LINK,
  imageInput: true
}

const GPT45Preview: LLM = {
  modelId: "gpt-4.5-preview",
  modelName: "gpt-4.5-preview",
  provider: "openai",
  hostedId: "gpt-4.5-preview",
  platformLink: OPENAI_PLATORM_LINK,
  imageInput: false
}

const GPT4SearchPreview: LLM = {
  modelId: "gpt-4o-search-preview",
  modelName: "GPT-4o (Web Search)",
  provider: "openai",
  hostedId: "gpt-4o-search-preview",
  platformLink: OPENAI_PLATORM_LINK,
  imageInput: false
}

export const OPENAI_LLM_LIST: LLM[] = [
  GPT4O,
  GPT4Turbo,
  GPT4SearchPreview,
  GPT4oMini,
  o1,
  o1Preview,
  o1Mini,
  o3Mini,
  GPT41PreviewNano,
  GPT41PreviewMini,
  GPT41Preview,
  GPT45Preview,
  GPT4OLatest
]
