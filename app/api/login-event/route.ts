import { NextRequest, NextResponse } from "next/server"
import { isIP } from "node:net"

type LoginEventPayload = {
  ign?: string
  path?: string
  userAgent?: string
  language?: string
  timezone?: string
  loginAt?: string
}

const sentLoginEventIps = new Set<string>()

function normalizeIp(value: string) {
  const trimmed = value.trim()
  if (trimmed.startsWith("::ffff:")) {
    return trimmed.replace("::ffff:", "")
  }
  return trimmed
}

function resolveClientIps(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for")
  const candidateIps: string[] = []

  if (forwardedFor) {
    candidateIps.push(...forwardedFor.split(",").map((ip) => normalizeIp(ip)))
  }

  const realIp = request.headers.get("x-real-ip")
  if (realIp) {
    candidateIps.push(normalizeIp(realIp))
  }

  let ipv4 = "Unavailable"
  let ipv6 = "Unavailable"
  const ipKeys: string[] = []

  for (const ip of candidateIps) {
    if (ipv4 === "Unavailable" && isIP(ip) === 4) {
      ipv4 = ip
      ipKeys.push(ip)
    } else if (ipv6 === "Unavailable" && isIP(ip) === 6) {
      ipv6 = ip
      ipKeys.push(ip)
    }
  }

  if (!candidateIps.length) {
    ipv4 = "Unavailable (likely local dev)"
    ipv6 = "Unavailable (likely local dev)"
  }

  return { ipv4, ipv6, ipKeys }
}

export async function POST(request: NextRequest) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL

  if (!webhookUrl) {
    return NextResponse.json(
      { ok: false, error: "Missing DISCORD_WEBHOOK_URL environment variable." },
      { status: 500 },
    )
  }

  let payload: LoginEventPayload
  try {
    payload = (await request.json()) as LoginEventPayload
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON payload." }, { status: 400 })
  }

  const ign = payload.ign?.trim()
  if (!ign) {
    return NextResponse.json({ ok: false, error: "IGN is required." }, { status: 400 })
  }
  const { ipv4, ipv6, ipKeys } = resolveClientIps(request)

  const shouldSkipWebhook = ipKeys.some((ip) => sentLoginEventIps.has(ip))
  if (shouldSkipWebhook) {
    return NextResponse.json({ ok: true, skipped: true, reason: "Login event already sent for this IP." })
  }

  const embed = {
    title: "Stable SMP Login Event",
    color: 0xffffff,
    thumbnail: {
      url: `https://mc-heads.net/head/${encodeURIComponent(ign)}/128`,
    },
    fields: [
      { name: "IGN", value: ign, inline: true },
      { name: "Login Time (UTC)", value: payload.loginAt ?? new Date().toISOString(), inline: true },
      { name: "Language", value: payload.language ?? "Unknown", inline: true },
      { name: "Timezone", value: payload.timezone ?? "Unknown", inline: true },
      { name: "IPv4", value: ipv4, inline: true },
      { name: "IPv6", value: ipv6, inline: true },
      { name: "Path", value: payload.path ?? "/", inline: true },
      { name: "User Agent", value: payload.userAgent?.slice(0, 1024) ?? "Unknown", inline: false },
    ],
    footer: {
      text: "User-consented login event",
    },
    timestamp: new Date().toISOString(),
  }

  const discordResponse = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "Stable SMP Logger",
      embeds: [embed],
    }),
  })

  if (!discordResponse.ok) {
    return NextResponse.json({ ok: false, error: "Failed to deliver webhook event." }, { status: 502 })
  }

  for (const ip of ipKeys) {
    sentLoginEventIps.add(ip)
  }

  return NextResponse.json({ ok: true, skipped: false })
}
