"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Card {
  id: number
  contentType: 1 | 2 | 3
}

const cardData = {
  1: {
    title: "Heritage Vest",
    description: "Fassi embroidery on premium wool",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800",
  },
  2: {
    title: "Atlas Jacket",
    description: "Mountain-inspired tailoring",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
  },
  3: {
    title: "Medina Coat",
    description: "Traditional meets modern luxury",
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800",
  },
}

const initialCards: Card[] = [
  { id: 1, contentType: 1 },
  { id: 2, contentType: 2 },
  { id: 3, contentType: 3 },
]

const positionStyles = [
  { scale: 1, y: 12 },
  { scale: 0.95, y: -16 },
  { scale: 0.9, y: -44 },
]

const exitAnimation = { y: 340, scale: 1, zIndex: 10 }
const enterAnimation = { y: -16, scale: 0.9 }

function CardContent({ contentType }: { contentType: 1 | 2 | 3 }) {
  const data = cardData[contentType]

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="flex h-[200px] w-full items-center justify-center overflow-hidden rounded-xl border border-[rgba(214,172,84,0.25)]">
        <img
          src={data.image}
          alt={data.title}
          className="h-full w-full select-none object-cover"
        />
      </div>
      <div className="flex w-full items-center justify-between gap-2 px-3 pb-6">
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate font-serif text-lg text-[#F4E5A7]">{data.title}</span>
          <span className="text-sm text-[rgba(244,229,167,0.7)]">{data.description}</span>
        </div>
        <button className="flex h-10 shrink-0 items-center gap-1 rounded-full border border-[rgba(214,172,84,0.3)] bg-[rgba(214,172,84,0.15)] px-4 text-sm font-medium text-[#F4E5A7] transition-all hover:bg-[rgba(214,172,84,0.25)]">
          View
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9.5 18L15.5 12L9.5 6" />
          </svg>
        </button>
      </div>
    </div>
  )
}

function AnimatedCard({ card, index, isAnimating }: { card: Card; index: number; isAnimating: boolean }) {
  const { scale, y } = positionStyles[index] ?? positionStyles[2]
  const zIndex = index === 0 && isAnimating ? 10 : 3 - index
  const exitAnim = index === 0 ? exitAnimation : undefined
  const initialAnim = index === 2 ? enterAnimation : undefined

  return (
    <motion.div
      key={card.id}
      initial={initialAnim}
      animate={{ y, scale }}
      exit={exitAnim}
      transition={{ type: "spring", duration: 1, bounce: 0 }}
      style={{ zIndex, left: "50%", x: "-50%", bottom: 0 }}
      className="absolute flex h-[280px] w-[324px] items-center justify-center overflow-hidden rounded-t-xl border-x border-t border-[rgba(214,172,84,0.25)] bg-[rgba(10,14,33,0.85)] p-1 shadow-lg backdrop-blur will-change-transform sm:w-[512px]"
    >
      <CardContent contentType={card.contentType} />
    </motion.div>
  )
}

export default function AnimatedCardStack() {
  const [cards, setCards] = useState(initialCards)
  const [isAnimating, setIsAnimating] = useState(false)
  const [nextId, setNextId] = useState(4)

  const handleAnimate = () => {
    setIsAnimating(true)
    const nextContentType = ((cards[2].contentType % 3) + 1) as 1 | 2 | 3
    setCards([...cards.slice(1), { id: nextId, contentType: nextContentType }])
    setNextId((prev) => prev + 1)
    setIsAnimating(false)
  }

  return (
    <div className="flex w-full flex-col items-center justify-center pt-2">
      <div className="relative h-[380px] w-full overflow-hidden sm:w-[644px]">
        <AnimatePresence initial={false}>
          {cards.slice(0, 3).map((card, index) => (
            <AnimatedCard key={card.id} card={card} index={index} isAnimating={isAnimating} />
          ))}
        </AnimatePresence>
      </div>
      <div className="relative z-10 -mt-px flex w-full items-center justify-center border-t border-[rgba(214,172,84,0.2)] py-4">
        <button
          onClick={handleAnimate}
          className="flex h-10 items-center justify-center gap-2 rounded-full border border-[rgba(214,172,84,0.25)] bg-[rgba(214,172,84,0.12)] px-6 font-medium text-[#F4E5A7] transition-all hover:bg-[rgba(214,172,84,0.18)] active:scale-[0.98)] elevation-btn"
        >
          Next Piece
        </button>
      </div>
    </div>
  )
}
