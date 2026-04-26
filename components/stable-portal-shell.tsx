"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, ShieldCheck } from "lucide-react"
import { FormEvent, ReactNode, useState } from "react"

const IGN_STORAGE_KEY = "stable-smp-ign"

type StablePortalShellProps = {
  pageTitle: string
  pageDescription: string
  children: ReactNode
}

export function StablePortalShell({
  pageTitle,
  pageDescription,
  children,
}: StablePortalShellProps) {
  const pathname = usePathname()
  const initialIgn = typeof window === "undefined" ? "" : window.localStorage.getItem(IGN_STORAGE_KEY) ?? ""
  const [ignInput, setIgnInput] = useState("")
  const [playerIgn, setPlayerIgn] = useState(initialIgn)
  const [shareLoginEvent, setShareLoginEvent] = useState(false)
  const [isValidatingIgn, setIsValidatingIgn] = useState(false)
  const [ignError, setIgnError] = useState("")

  async function validateIgn(ign: string) {
    const response = await fetch("/api/validate-ign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ign }),
    })
    const result = (await response.json()) as { valid?: boolean; reason?: string }

    if (!response.ok) {
      return {
        valid: false,
        reason: "Unable to validate IGN right now. Please try again.",
      }
    }

    return {
      valid: Boolean(result.valid),
      reason: result.reason ?? "",
    }
  }

  async function onLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalizedIgn = ignInput.trim()
    if (!normalizedIgn) return
    setIgnError("")
    setIsValidatingIgn(true)

    const validation = await validateIgn(normalizedIgn)
    setIsValidatingIgn(false)

    if (!validation.valid) {
      setIgnError(validation.reason || "Invalid IGN.")
      return
    }

    window.localStorage.setItem(IGN_STORAGE_KEY, normalizedIgn)
    setPlayerIgn(normalizedIgn)
    setIgnInput("")

    if (shareLoginEvent) {
      try {
        await fetch("/api/login-event", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ign: normalizedIgn,
            path: pathname,
            userAgent: navigator.userAgent,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? "Unknown",
            loginAt: new Date().toISOString(),
          }),
        })
      } catch {
        // Login should still proceed even if webhook delivery fails.
      }
    }
  }

  function onLogout() {
    window.localStorage.removeItem(IGN_STORAGE_KEY)
    setPlayerIgn("")
  }

  if (!playerIgn) {
    return (
      <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-zinc-950 px-4 py-10 text-zinc-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_45%)]" />
        <section className="relative z-10 w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-2xl">
          <div className="mb-6 flex items-center gap-3">
            <Image src="/logo.webp" alt="Stable SMP logo" width={52} height={52} className="rounded-lg" priority />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Stable SMP</p>
              <h1 className="text-xl font-semibold">Player Login</h1>
            </div>
          </div>

          <p className="mb-4 text-sm text-zinc-300">
            Enter your Minecraft IGN to access the Stable SMP info server website.
          </p>

          <form onSubmit={onLogin} className="space-y-3">
            <label className="block text-sm text-zinc-300" htmlFor="ign">
              Minecraft IGN
            </label>
            <input
              id="ign"
              value={ignInput}
              onChange={(event) => {
                setIgnInput(event.target.value)
                if (ignError) setIgnError("")
              }}
              placeholder="Example: Steve"
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none ring-0 transition focus:border-white"
            />
            {ignError ? <p className="text-xs text-red-300">{ignError}</p> : null}
            <label className="flex items-start gap-2 rounded-md border border-zinc-800 bg-zinc-950 p-2 text-xs text-zinc-300">
              <input
                type="checkbox"
                checked={shareLoginEvent}
                onChange={(event) => setShareLoginEvent(event.target.checked)}
                className="mt-0.5 h-4 w-4 accent-white"
              />
              <span>I agree to share a login event (IGN + basic device details) to the Stable SMP Discord logs.</span>
            </label>
            <button
              type="submit"
              className="w-full rounded-md bg-white px-3 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!shareLoginEvent || isValidatingIgn}
            >
              {isValidatingIgn ? "Verifying IGN..." : "Access Stable SMP"}
            </button>
          </form>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-svh bg-zinc-950 px-4 py-6 text-zinc-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Image src="/logo.webp" alt="Stable SMP logo" width={54} height={54} className="rounded-lg" priority />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Stable SMP</p>
                <h1 className="text-lg font-semibold">{pageTitle}</h1>
                <p className="text-sm text-zinc-400">{pageDescription}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <nav className="flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-950 p-1 text-sm">
                <Link
                  href="/"
                  className={`rounded-md px-3 py-1.5 transition ${
                    pathname === "/" ? "bg-white text-zinc-950" : "text-zinc-300 hover:bg-zinc-900"
                  }`}
                >
                  Info
                </Link>
                <Link
                  href="/market"
                  className={`rounded-md px-3 py-1.5 transition ${
                    pathname === "/market" ? "bg-white text-zinc-950" : "text-zinc-300 hover:bg-zinc-900"
                  }`}
                >
                  Market
                </Link>
              </nav>

              <div className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1.5">
                <Image
                  src={`https://mc-heads.net/head/${encodeURIComponent(playerIgn)}/64`}
                  alt={`${playerIgn} player head`}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded border border-zinc-700 bg-zinc-800"
                />
                <div>
                  <p className="text-xs text-zinc-400">Logged in as</p>
                  <p className="text-sm font-medium">{playerIgn}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm transition hover:bg-zinc-900"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </header>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:p-5">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs text-zinc-100">
            <ShieldCheck size={14} />
            Stable SMP Community Portal
          </div>
          {children}
        </section>
      </div>
    </main>
  )
}
