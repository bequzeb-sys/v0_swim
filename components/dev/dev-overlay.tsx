"use client"

import dynamic from "next/dynamic"

const FakeAuthDebug = dynamic(
  () => import("./fake-auth-debug").then((m) => m.FakeAuthDebug),
  {
    ssr: false,
    loading: () => null,
  }
)

export default function DevOverlay() {
  return <FakeAuthDebug />
}
