"use client"

import { ChatbotUISVG } from "@/components/icons/chatbotui-svg"
import { IconArrowRight } from "@tabler/icons-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import Image from "next/image"
import labFortyLogo from "./LabForty_Logo_White.svg"
import Head from "next/head"

export default function HomePage() {
  const { theme } = useTheme()

  return (
    <>
      <Head>
        <title>LabForty AI</title>
        <meta
          name="description"
          content="AI ChatBot for all big LLMs made by LabForty"
        />
        <meta property="og:title" content="LabForty AI" />
        <meta
          property="og:description"
          content="AI ChatBot for all big LLMs made by LabForty"
        />
        <meta property="og:image" content="./LabForty_Logo_White.svg" />
        {/* Add more meta tags as needed */}
      </Head>
      <div className="flex size-full flex-col items-center justify-center">
        <div>
          <Image
            src={labFortyLogo}
            width={100}
            height={100}
            alt="LabForty-Logo"
          />
        </div>

        <div className="mt-2 text-4xl font-bold">LabForty AI</div>

        <Link
          className="mt-4 flex w-[200px] items-center justify-center rounded-md bg-blue-500 p-2 font-semibold"
          href="/login"
        >
          Start Chatting
          <IconArrowRight className="ml-1" size={20} />
        </Link>
      </div>
    </>
  )
}
