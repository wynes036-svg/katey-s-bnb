'use client'

import { useState } from 'react'
import type { BreakfastSelection } from '@/types'

const MENU_ITEMS = [
  { id: 'full-english', label: 'Full English Breakfast', description: 'Eggs, bacon, sausage, beans, toast' },
  { id: 'continental', label: 'Continental Spread', description: 'Pastries, fruit, yoghurt, granola' },
  { id: 'avocado-toast', label: 'Avocado Toast', description: 'Sourdough, smashed avocado, poached eggs' },
  { id: 'porridge', label: 'Artisan Porridge', description: 'Oats, seasonal fruit, honey, seeds' },
  { id: 'smoked-salmon', label: 'Smoked Salmon Bagel', description: 'Cream cheese, capers, red onion' },
  { id: 'pancakes', label: 'Buttermilk Pancakes', description: 'Maple syrup, fresh berries, clotted cream' },
]

const COMMON_RESTRICTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-free',
  'Dairy-free',
  'Nut allergy',
  'Halal',
  'Kosher',
]

interface BreakfastPlannerProps {
  guestCount: number
  selections: BreakfastSelection[]
  onChange: (selections: BreakfastSelection[]) => void
}

export default function BreakfastPlanner({
  guestCount,
  selections,
  onChange,
}: BreakfastPlannerProps) {
  const [customRestrictions, setCustomRestrictions] = useState<string[]>(
    Array(guestCount).fill('')
  )

  function getSelection(personIndex: number): BreakfastSelection {
    return (
      selections.find((s) => s.personIndex === personIndex) ?? {
        personIndex,
        items: [],
        restrictions: [],
      }
    )
  }

  function updateSelection(personIndex: number, updated: Partial<BreakfastSelection>) {
    const current = getSelection(personIndex)
    const merged = { ...current, ...updated }
    const rest = selections.filter((s) => s.personIndex !== personIndex)
    onChange([...rest, merged])
  }

  function toggleItem(personIndex: number, itemId: string) {
    const sel = getSelection(personIndex)
    const items = sel.items.includes(itemId)
      ? sel.items.filter((i) => i !== itemId)
      : [...sel.items, itemId]
    updateSelection(personIndex, { items })
  }

  function toggleRestriction(personIndex: number, restriction: string) {
    const sel = getSelection(personIndex)
    const restrictions = sel.restrictions.includes(restriction)
      ? sel.restrictions.filter((r) => r !== restriction)
      : [...sel.restrictions, restriction]
    updateSelection(personIndex, { restrictions })
  }

  function handleCustomRestriction(personIndex: number, value: string) {
    const updated = [...customRestrictions]
    updated[personIndex] = value
    setCustomRestrictions(updated)
  }

  function addCustomRestriction(personIndex: number) {
    const value = customRestrictions[personIndex].trim()
    if (!value) return
    const sel = getSelection(personIndex)
    if (!sel.restrictions.includes(value)) {
      updateSelection(personIndex, { restrictions: [...sel.restrictions, value] })
    }
    const updated = [...customRestrictions]
    updated[personIndex] = ''
    setCustomRestrictions(updated)
  }

  const guests = Array.from({ length: guestCount }, (_, i) => i)

  return (
    <div className="space-y-8">
      <div>
        <h2
          className="text-2xl text-[#1C1917] mb-2"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Plan Your Breakfast
        </h2>
        <p className="text-[#78716C] text-sm">
          Choose your morning menu and let us know about any dietary needs.
        </p>
      </div>

      {guests.map((personIndex) => {
        const sel = getSelection(personIndex)
        return (
          <div
            key={personIndex}
            className="rounded-2xl border border-[#D6D0C8] bg-white p-6"
          >
            <h3
              className="text-lg font-semibold text-[#1C1917] mb-4"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {guestCount === 1 ? 'Your Breakfast' : `Guest ${personIndex + 1}`}
            </h3>

            {/* Menu items */}
            <fieldset className="mb-6">
              <legend className="text-sm font-medium text-[#1C1917] mb-3">
                Choose your items
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MENU_ITEMS.map((item) => {
                  const checked = sel.items.includes(item.id)
                  return (
                    <label
                      key={item.id}
                      className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${
                        checked
                          ? 'border-[#C4622D] bg-[#FDF5F0]'
                          : 'border-[#D6D0C8] hover:border-[#C4622D]/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleItem(personIndex, item.id)}
                        className="mt-0.5 h-4 w-4 rounded border-[#D6D0C8] text-[#C4622D] focus:ring-[#C4622D]"
                        aria-label={item.label}
                      />
                      <div>
                        <p className="text-sm font-medium text-[#1C1917]">{item.label}</p>
                        <p className="text-xs text-[#78716C]">{item.description}</p>
                      </div>
                    </label>
                  )
                })}
              </div>
            </fieldset>

            {/* Dietary restrictions */}
            <fieldset>
              <legend className="text-sm font-medium text-[#1C1917] mb-3">
                Dietary requirements
              </legend>
              <div className="flex flex-wrap gap-2 mb-3">
                {COMMON_RESTRICTIONS.map((restriction) => {
                  const checked = sel.restrictions.includes(restriction)
                  return (
                    <button
                      key={restriction}
                      type="button"
                      onClick={() => toggleRestriction(personIndex, restriction)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#C4622D] focus:ring-offset-1 ${
                        checked
                          ? 'bg-[#C4622D] text-white'
                          : 'bg-[#E8E4DF] text-[#78716C] hover:bg-[#D6D0C8]'
                      }`}
                      aria-pressed={checked}
                    >
                      {restriction}
                    </button>
                  )
                })}
              </div>

              {/* Custom restriction input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customRestrictions[personIndex] ?? ''}
                  onChange={(e) => handleCustomRestriction(personIndex, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addCustomRestriction(personIndex)
                    }
                  }}
                  placeholder="Other restriction or allergy…"
                  className="flex-1 rounded-lg border border-[#D6D0C8] px-3 py-2 text-sm text-[#1C1917] placeholder-[#78716C] focus:border-[#C4622D] focus:outline-none focus:ring-1 focus:ring-[#C4622D]"
                  aria-label={`Custom dietary restriction for guest ${personIndex + 1}`}
                />
                <button
                  type="button"
                  onClick={() => addCustomRestriction(personIndex)}
                  className="rounded-lg bg-[#E8E4DF] px-3 py-2 text-sm font-medium text-[#78716C] hover:bg-[#D6D0C8] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C4622D]"
                >
                  Add
                </button>
              </div>

              {/* Show added custom restrictions */}
              {sel.restrictions.filter((r) => !COMMON_RESTRICTIONS.includes(r)).length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {sel.restrictions
                    .filter((r) => !COMMON_RESTRICTIONS.includes(r))
                    .map((r) => (
                      <span
                        key={r}
                        className="inline-flex items-center gap-1 rounded-full bg-[#C4622D]/10 px-3 py-1 text-xs text-[#C4622D]"
                      >
                        {r}
                        <button
                          type="button"
                          onClick={() => toggleRestriction(personIndex, r)}
                          className="ml-1 hover:text-[#A8521F] focus:outline-none"
                          aria-label={`Remove ${r}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                </div>
              )}
            </fieldset>
          </div>
        )
      })}
    </div>
  )
}
