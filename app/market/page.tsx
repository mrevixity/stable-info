"use client"

import { TrendingDown, TrendingUp } from "lucide-react"
import {
  Apple,
  Arrow,
  BlazeRod,
  Bone,
  Bread,
  Bricks,
  Carrot,
  Coal,
  Cobblestone,
  Diamond,
  Dirt,
  Elytra,
  Emerald,
  EndCrystal,
  EndStone,
  EnderPearl,
  Glass,
  GoldIngot,
  GoldenCarrot,
  Gravel,
  Gunpowder,
  IronIngot,
  LapisLazuli,
  Leather,
  NetherStar,
  Netherrack,
  OakWood,
  Obsidian,
  Potato,
  PrismarineShard,
  QuartzBlock,
  Redstone,
  Sand,
  SeaLantern,
  ShulkerShell,
  Slimeball,
  Steak,
  Stone,
  String,
  SugarCanes,
  TotemOfUndying,
  Wheat,
} from "minecraft-icons-react"
import { ComponentType, SVGProps, useMemo, useState } from "react"
import { StablePortalShell } from "@/components/stable-portal-shell"

type ItemIcon = ComponentType<SVGProps<SVGSVGElement>>

type MarketItem = {
  name: string
  category: "Block" | "Resource" | "Farm" | "Combat"
  currentPrice: number
  weeklyChangePercent: number
  icon: ItemIcon
  lotSize?: string
}

const ITEMS_PER_PAGE = 12

const marketItems: MarketItem[] = [
  { name: "Diamond", category: "Resource", currentPrice: 890, weeklyChangePercent: 12.7, icon: Diamond },
  { name: "Netherite Ingot", category: "Resource", currentPrice: 3520, weeklyChangePercent: 8.3, icon: NetherStar },
  { name: "Gold Ingot", category: "Resource", currentPrice: 540, weeklyChangePercent: -3.1, icon: GoldIngot },
  { name: "Iron Ingot", category: "Resource", currentPrice: 85, weeklyChangePercent: -1.6, icon: IronIngot },
  { name: "Emerald", category: "Resource", currentPrice: 300, weeklyChangePercent: 2.8, icon: Emerald },
  { name: "Coal", category: "Resource", currentPrice: 54, weeklyChangePercent: 5.9, icon: Coal },
  { name: "Redstone Dust", category: "Resource", currentPrice: 67, weeklyChangePercent: 1.5, icon: Redstone },
  { name: "Lapis Lazuli", category: "Resource", currentPrice: 74, weeklyChangePercent: -2.4, icon: LapisLazuli },
  { name: "Quartz Block", category: "Resource", currentPrice: 230, weeklyChangePercent: 7.6, icon: QuartzBlock },
  { name: "Prismarine Shard", category: "Resource", currentPrice: 180, weeklyChangePercent: -4.1, icon: PrismarineShard },
  { name: "Blaze Rod", category: "Resource", currentPrice: 235, weeklyChangePercent: 6.1, icon: BlazeRod },
  { name: "End Crystal", category: "Combat", currentPrice: 1500, weeklyChangePercent: 4.9, icon: EndCrystal, lotSize: "12 crystals" },
  { name: "Ender Pearl", category: "Resource", currentPrice: 142, weeklyChangePercent: 3.8, icon: EnderPearl },
  { name: "Shulker Shell", category: "Resource", currentPrice: 1180, weeklyChangePercent: 9.2, icon: ShulkerShell },
  { name: "Leather", category: "Resource", currentPrice: 52, weeklyChangePercent: -1.3, icon: Leather },
  { name: "String", category: "Resource", currentPrice: 41, weeklyChangePercent: 4.4, icon: String },
  { name: "Bone", category: "Resource", currentPrice: 39, weeklyChangePercent: -0.9, icon: Bone },
  { name: "Obsidian", category: "Block", currentPrice: 170, weeklyChangePercent: -5.4, icon: Obsidian },
  { name: "Oak Log", category: "Block", currentPrice: 25, weeklyChangePercent: 3.4, icon: OakWood },
  { name: "Cobblestone", category: "Block", currentPrice: 12, weeklyChangePercent: 1.7, icon: Cobblestone },
  { name: "Stone", category: "Block", currentPrice: 14, weeklyChangePercent: -2.8, icon: Stone },
  { name: "Dirt", category: "Block", currentPrice: 9, weeklyChangePercent: 0.6, icon: Dirt },
  { name: "Sand", category: "Block", currentPrice: 13, weeklyChangePercent: -3.5, icon: Sand },
  { name: "Gravel", category: "Block", currentPrice: 16, weeklyChangePercent: 2.1, icon: Gravel },
  { name: "Glass", category: "Block", currentPrice: 21, weeklyChangePercent: 1.1, icon: Glass },
  { name: "Bricks", category: "Block", currentPrice: 46, weeklyChangePercent: 6.4, icon: Bricks },
  { name: "Netherrack", category: "Block", currentPrice: 11, weeklyChangePercent: -1.4, icon: Netherrack },
  { name: "End Stone", category: "Block", currentPrice: 95, weeklyChangePercent: 4.7, icon: EndStone },
  { name: "Sea Lantern", category: "Block", currentPrice: 480, weeklyChangePercent: 10.2, icon: SeaLantern },
  { name: "Elytra", category: "Combat", currentPrice: 7800, weeklyChangePercent: 6.9, icon: Elytra },
  { name: "Totem of Undying", category: "Combat", currentPrice: 1380, weeklyChangePercent: 4.2, icon: TotemOfUndying },
  { name: "Gunpowder", category: "Combat", currentPrice: 120, weeklyChangePercent: -7.2, icon: Gunpowder },
  { name: "Arrow", category: "Combat", currentPrice: 36, weeklyChangePercent: 8.4, icon: Arrow },
  { name: "Slimeball", category: "Combat", currentPrice: 117, weeklyChangePercent: -6.2, icon: Slimeball },
  { name: "Nether Star", category: "Combat", currentPrice: 14500, weeklyChangePercent: 15.9, icon: NetherStar },
  { name: "Diamond Bundle", category: "Resource", currentPrice: 2500, weeklyChangePercent: 11.1, icon: Diamond },
  { name: "Emerald Bundle", category: "Resource", currentPrice: 920, weeklyChangePercent: 6.6, icon: Emerald },
  { name: "Gold Reserve", category: "Resource", currentPrice: 1310, weeklyChangePercent: -2.2, icon: GoldIngot },
  { name: "Iron Reserve", category: "Resource", currentPrice: 420, weeklyChangePercent: 2.9, icon: IronIngot },
  { name: "Totem Pack", category: "Combat", currentPrice: 6200, weeklyChangePercent: 7.1, icon: TotemOfUndying },
  { name: "XP Utility Bundle", category: "Combat", currentPrice: 890, weeklyChangePercent: 5.2, icon: BlazeRod },
  { name: "Builder Glass Set", category: "Block", currentPrice: 330, weeklyChangePercent: 1.3, icon: Glass },
  { name: "Builder Brick Set", category: "Block", currentPrice: 460, weeklyChangePercent: 0.4, icon: Bricks },
  { name: "Nether Starter Set", category: "Block", currentPrice: 510, weeklyChangePercent: 9.7, icon: Netherrack },
  { name: "End Raid Set", category: "Combat", currentPrice: 3990, weeklyChangePercent: 12.5, icon: ShulkerShell },
  { name: "Pearl Stack", category: "Combat", currentPrice: 1560, weeklyChangePercent: 3.7, icon: EnderPearl },
  { name: "Mob Farm Output", category: "Resource", currentPrice: 770, weeklyChangePercent: 5.6, icon: Bone },
  { name: "Villager Trade Pack", category: "Resource", currentPrice: 1250, weeklyChangePercent: 4.8, icon: Emerald },
  { name: "Mining Kit", category: "Resource", currentPrice: 680, weeklyChangePercent: -0.7, icon: Coal },
  { name: "Redstone Starter Kit", category: "Resource", currentPrice: 590, weeklyChangePercent: 6.3, icon: Redstone },
  { name: "Quartz Build Kit", category: "Block", currentPrice: 940, weeklyChangePercent: 8.8, icon: QuartzBlock },
  { name: "Ocean Monument Pack", category: "Resource", currentPrice: 2090, weeklyChangePercent: 10.6, icon: PrismarineShard },
  { name: "Mega Beacon Bundle", category: "Resource", currentPrice: 3120, weeklyChangePercent: 13.2, icon: Diamond },
  { name: "Wood Stack", category: "Block", currentPrice: 220, weeklyChangePercent: 2.5, icon: OakWood },
  { name: "Cobble Stack", category: "Block", currentPrice: 98, weeklyChangePercent: -1.8, icon: Cobblestone },
  { name: "Stone Stack", category: "Block", currentPrice: 110, weeklyChangePercent: -1.1, icon: Stone },
  { name: "Sand Stack", category: "Block", currentPrice: 102, weeklyChangePercent: 0.8, icon: Sand },
  { name: "Gravel Stack", category: "Block", currentPrice: 99, weeklyChangePercent: 2.2, icon: Gravel },
  { name: "Farm Feed Pack", category: "Farm", currentPrice: 140, weeklyChangePercent: 3.3, icon: Wheat },
  { name: "Carrot Crate", category: "Farm", currentPrice: 128, weeklyChangePercent: 2.6, icon: Carrot },
  { name: "Potato Crate", category: "Farm", currentPrice: 120, weeklyChangePercent: 1.9, icon: Potato },
  { name: "Golden Carrot", category: "Farm", currentPrice: 44, weeklyChangePercent: 9.8, icon: GoldenCarrot },
  { name: "Bread Bundle", category: "Farm", currentPrice: 76, weeklyChangePercent: 4.5, icon: Bread },
  { name: "Steak Bundle", category: "Farm", currentPrice: 154, weeklyChangePercent: 6.8, icon: Steak },
  { name: "Apple Stack", category: "Farm", currentPrice: 88, weeklyChangePercent: -2.7, icon: Apple },
  { name: "Sugar Cane Bale", category: "Farm", currentPrice: 94, weeklyChangePercent: 5.1, icon: SugarCanes },
  { name: "Leather Trade Set", category: "Farm", currentPrice: 310, weeklyChangePercent: 3.4, icon: Leather },
]

function previousWeekPrice(currentPrice: number, weeklyChangePercent: number) {
  const ratio = 1 + weeklyChangePercent / 100
  return ratio === 0 ? currentPrice : currentPrice / ratio
}

function toIngotValue(value: number) {
  return Number((value / 1500).toFixed(2))
}

export default function MarketPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(marketItems.length / ITEMS_PER_PAGE)

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return marketItems.slice(start, start + ITEMS_PER_PAGE)
  }, [currentPage])

  const startItemNumber = (currentPage - 1) * ITEMS_PER_PAGE + 1
  const endItemNumber = Math.min(currentPage * ITEMS_PER_PAGE, marketItems.length)

  return (
    <StablePortalShell
      pageTitle="Market Board"
      pageDescription="Community trading values with weekly movement."
    >
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
        <h2 className="text-xl font-semibold">Stable SMP Market</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Values are measured in Netherite Ingots. Only premium items trend in the 1-10 ingot range.
        </p>
        <p className="mt-1 text-xs text-zinc-400">
          Reference rate: 12 End Crystals = 1 Netherite Ingot.
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          Showing {startItemNumber}-{endItemNumber} of {marketItems.length} items
        </p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {paginatedItems.map((item) => {
          const isUp = item.weeklyChangePercent >= 0
          const previousPrice = previousWeekPrice(item.currentPrice, item.weeklyChangePercent)
          const currentIngotValue = toIngotValue(item.currentPrice)
          const previousIngotValue = toIngotValue(previousPrice)

          return (
            <article
              key={item.name}
              className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 transition hover:border-zinc-600"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 p-1">
                    <item.icon width={38} height={38} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-xs text-zinc-400">
                      {item.category}
                      {item.lotSize ? ` • ${item.lotSize}` : ""}
                    </p>
                  </div>
                </div>

                <div
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                    isUp ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"
                  }`}
                >
                  {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {isUp ? "+" : ""}
                  {item.weeklyChangePercent.toFixed(1)}%
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-md border border-zinc-700 bg-zinc-900 p-2">
                  <p className="text-xs text-zinc-400">Current Value</p>
                  <p className="font-semibold text-white">{currentIngotValue} ingots</p>
                </div>
                <div className="rounded-md border border-zinc-700 bg-zinc-900 p-2">
                  <p className="text-xs text-zinc-400">Previous Week</p>
                  <p className="font-semibold text-zinc-100">{previousIngotValue} ingots</p>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 p-3">
        <button
          type="button"
          onClick={() => setCurrentPage((value) => Math.max(value - 1, 1))}
          disabled={currentPage === 1}
          className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
          <button
            type="button"
            key={pageNumber}
            onClick={() => setCurrentPage(pageNumber)}
            className={`rounded-md border px-3 py-1.5 text-sm ${
              currentPage === pageNumber
                ? "border-white bg-white text-zinc-950"
                : "border-zinc-700 text-zinc-100 hover:bg-zinc-900"
            }`}
          >
            {pageNumber}
          </button>
        ))}

        <button
          type="button"
          onClick={() => setCurrentPage((value) => Math.min(value + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </StablePortalShell>
  )
}
