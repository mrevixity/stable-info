import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { StablePortalShell } from "@/components/stable-portal-shell"

const rules = [
  "No spamming or flooding chat.",
  "No harassment or toxicity.",
  "Do not make threats or encourage self harm.",
  "No advertising or promoting.",
  "No hate speech or discrimination.",
  "Do not use slurs, regardless of your own identity.",
  "No impersonation of staff or other members.",
  "Keep chat in English. Our moderators only speak english.",
  "No sharing private information (doxing), including your own or others.",
  "Keep in game content appropriate, including skins, builds, names, and text.",
  "Do not attempt to damage server infrastructure/performance.",
  "No IRL Trading. Do not exchange in game items for real money.",
  "No punishment evasion. Do not use alt accounts to evade bans or mutes.",
  "Use common sense. Do not use loopholes to bypass rules.",
  "No cheating, hacking, or modified clients that provide unfair advantages.",
]

const disallowedMods = [
  "Freecam",
  "Minimap",
  "Health Indicators",
  "Baritone",
  "Villager Reroller",
  "Villager Trading Plus",
  "Multi Key Bindings / Macros",
  "ClickCrystals",
  "Cut Through / Attack Through Grass",
  "Consumable Optimizer",
  "Hotbar Optimizer",
  "Auto Totem",
]

export default function Page() {
  return (
    <StablePortalShell
      pageTitle="Server Info"
      pageDescription="Everything players need for Stable SMP."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 lg:col-span-2">
          <h2 className="text-xl font-semibold">Connection Details</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-3">
              <p className="text-xs text-zinc-400">IP</p>
              <p className="font-semibold text-white">stablesmp.xyz</p>
            </div>
            <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-3">
              <p className="text-xs text-zinc-400">Port</p>
              <p className="font-semibold text-white">19132</p>
            </div>
            <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-3">
              <p className="text-xs text-zinc-400">Store</p>
              <Link
                href="https://store.stablesmp.xyz/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-white hover:text-zinc-300"
              >
                Open Store
                <ExternalLink size={14} />
              </Link>
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
          <h2 className="text-xl font-semibold">Quick Links</h2>
          <p className="mt-2 text-sm text-zinc-400">Track the economy and see weekly trends.</p>
          <Link
            href="/market"
            className="mt-4 inline-flex rounded-md bg-white px-3 py-2 text-sm font-semibold text-zinc-950 hover:bg-zinc-200"
          >
            Open Market Page
          </Link>
        </article>
      </div>

      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
        <h2 className="text-xl font-semibold">Server Rules</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Staff has final say. Ask if you are unsure whether something is allowed.
        </p>
        <ul className="mt-4 grid list-decimal gap-2 pl-5 text-sm text-zinc-200 sm:grid-cols-2">
          {rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
        <h3 className="text-lg font-semibold text-red-300">Disallowed Mods (Not complete)</h3>
        <ul className="mt-3 grid gap-2 text-sm text-zinc-200 sm:grid-cols-2 lg:grid-cols-3">
          {disallowedMods.map((mod) => (
            <li key={mod} className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2">
              {mod}
            </li>
          ))}
        </ul>
      </div>
    </StablePortalShell>
  )
}
