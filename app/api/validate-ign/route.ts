import { NextRequest, NextResponse } from "next/server"

type ValidateIgnPayload = {
  ign?: string
}

const IGN_REGEX = /^[A-Za-z0-9_]{3,16}$/

export async function POST(request: NextRequest) {
  let payload: ValidateIgnPayload
  try {
    payload = (await request.json()) as ValidateIgnPayload
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON payload." }, { status: 400 })
  }

  const ign = payload.ign?.trim() ?? ""
  if (!IGN_REGEX.test(ign)) {
    return NextResponse.json({
      ok: true,
      valid: false,
      reason: "Minecraft IGN must be 3-16 characters and use only letters, numbers, or underscores.",
    })
  }

  try {
    const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${encodeURIComponent(ign)}`, {
      method: "GET",
      cache: "no-store",
    })

    if (response.status === 200) {
      return NextResponse.json({ ok: true, valid: true })
    }

    if (response.status === 204 || response.status === 404) {
      return NextResponse.json({
        ok: true,
        valid: false,
        reason: "This IGN was not found in Mojang account records.",
      })
    }

    return NextResponse.json({
      ok: true,
      valid: false,
      reason: "Unable to verify IGN right now. Please try again.",
    })
  } catch {
    return NextResponse.json({
      ok: true,
      valid: false,
      reason: "Network error while verifying IGN. Please try again.",
    })
  }
}
