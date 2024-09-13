import { LLM } from "@/types"

const MISTRAL_PLATORM_LINK = "https://docs.mistral.ai/"

// Mistral Models (UPDATED 12/21/23) -----------------------------

// Mistral 7B (UPDATED 12/21/23)
const MISTRAL_7B: LLM = {
  modelId: "mistral-tiny",
  modelName: "Mistral Tiny",
  provider: "mistral",
  hostedId: "mistral-tiny",
  platformLink: MISTRAL_PLATORM_LINK,
  imageInput: false
}

// Mixtral (UPDATED 12/21/23)
const MIXTRAL: LLM = {
  modelId: "mistral-small",
  modelName: "Mistral Small",
  provider: "mistral",
  hostedId: "mistral-small",
  platformLink: MISTRAL_PLATORM_LINK,
  imageInput: false
}

// Mistral Medium (UPDATED 12/21/23)
const MISTRAL_MEDIUM: LLM = {
  modelId: "mistral-medium",
  modelName: "Mistral Medium",
  provider: "mistral",
  hostedId: "mistral-medium",
  platformLink: MISTRAL_PLATORM_LINK,
  imageInput: false
}

// Mistral Large (UPDATED 03/05/24)
const MISTRAL_LARGE: LLM = {
  modelId: "mistral-large-2402",
  modelName: "Mistral Large",
  provider: "mistral",
  hostedId: "mistral-large-2402",
  platformLink: MISTRAL_PLATORM_LINK,
  imageInput: false
}

const OPEN_MISTRAL_NEMO: LLM = {
  modelId: "open-mistral-nemo",
  modelName: "Open Mistral Nemo",
  provider: "mistral",
  hostedId: "open-mistral-nemo",
  platformLink: MISTRAL_PLATORM_LINK,
  imageInput: false
}

const CODESTRAL_MAMBA_2407: LLM = {
  modelId: "codestral-mamba-2407",
  modelName: "CodeStral Mamba 2407",
  provider: "mistral",
  hostedId: "codestral-mamba-2407",
  platformLink: MISTRAL_PLATORM_LINK,
  imageInput: false
}

const CODESTRAL_2405: LLM = {
  modelId: "codestral-2405",
  modelName: "CodeStral 2405",
  provider: "mistral",
  hostedId: "codestral-2405",
  platformLink: MISTRAL_PLATORM_LINK,
  imageInput: false
}

const MISTRAL_LARGE_2407: LLM = {
  modelId: "mistral-large-2407",
  modelName: "Mistral Large 2407",
  provider: "mistral",
  hostedId: "mistral-large-2407",
  platformLink: MISTRAL_PLATORM_LINK,
  imageInput: false
}

export const MISTRAL_LLM_LIST: LLM[] = [
  MISTRAL_7B,
  MIXTRAL,
  MISTRAL_MEDIUM,
  MISTRAL_LARGE,
  OPEN_MISTRAL_NEMO,
  CODESTRAL_MAMBA_2407,
  CODESTRAL_2405,
  MISTRAL_LARGE_2407
]
