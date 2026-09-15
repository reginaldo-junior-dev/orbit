import { useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cx } from '../../lib/cx'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../shared/Reveal'

const ITEMS = [
  {
    question: 'Is Orbit free to use?',
    answer:
      'Yes. The Starter plan is free forever and covers unlimited tasks, daily planning and calendar view. Pro adds focus mode, insights and unlimited habits — with a 14-day free trial and no credit card required.',
  },
  {
    question: 'Does Orbit sync across my devices?',
    answer:
      'Yes. Orbit runs on web, desktop and mobile, and everything syncs in real time. Starter includes two devices; Pro and Constellation remove the limit entirely.',
  },
  {
    question: 'Can I use Orbit offline?',
    answer:
      'Absolutely. The desktop and mobile apps work fully offline. Anything you capture gets synced automatically the moment you are back online.',
  },
  {
    question: 'What makes Orbit different from other planners?',
    answer:
      'Most tools organize information; Orbit organizes your day. It combines tasks, habits and focus into one flow, then uses weekly insights to suggest one small improvement — instead of piling on dashboards you will never read.',
  },
  {
    question: 'Can I export my data?',
    answer:
      'Yes, on every plan. Export your tasks, notes and insights to Markdown, CSV or JSON whenever you want. Your data is yours — no lock-in, no dark patterns.',
  },
  {
    question: 'Do you offer a student discount?',
    answer:
      'Yes. Students and educators get 40% off Pro with a valid academic email. Reach out to our team and we will set it up within a day.',
  },
]

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0)
  const buttonRefs = useRef([])

  const handleKeyDown = (event, index) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    event.preventDefault()
    const delta = event.key === 'ArrowDown' ? 1 : -1
    const next = (index + delta + ITEMS.length) % ITEMS.length
    buttonRefs.current[next]?.focus()
  }

  return (
    <section id="faq" className="scroll-mt-24 py-24 sm:py-32" aria-labelledby="faq-title">
      <Container className="max-w-3xl">
        <Reveal>
          <SectionHeading
            id="faq-title"
            eyebrow="FAQ"
            title="Questions, answered"
            description="Everything you might be wondering before giving Orbit a spin."
          />
        </Reveal>

        <div className="mt-12 space-y-3">
          {ITEMS.map((item, index) => {
            const open = openIndex === index
            return (
              <Reveal key={item.question} delay={index * 60}>
                <div
                  className={cx(
                    'rounded-2xl border transition-colors duration-300',
                    open ? 'border-line-strong bg-surface' : 'border-line bg-surface/50 hover:border-line-strong',
                  )}
                >
                  <h3>
                    <button
                      type="button"
                      ref={(el) => {
                        buttonRefs.current[index] = el
                      }}
                      aria-expanded={open}
                      aria-controls={`faq-panel-${index}`}
                      id={`faq-button-${index}`}
                      onClick={() => setOpenIndex(open ? -1 : index)}
                      onKeyDown={(event) => handleKeyDown(event, index)}
                      className="flex w-full items-center justify-between gap-4 rounded-2xl px-6 py-5 text-left focus-visible:focus-ring"
                    >
                      <span className="font-display text-base font-semibold tracking-tight text-ink sm:text-lg">
                        {item.question}
                      </span>
                      <ChevronDown
                        aria-hidden="true"
                        className={cx(
                          'h-5 w-5 shrink-0 text-ink-3 transition-transform duration-300 motion-reduce:transition-none',
                          open ? 'rotate-180' : '',
                        )}
                      />
                    </button>
                  </h3>
                  <div
                    id={`faq-panel-${index}`}
                    role="region"
                    aria-labelledby={`faq-button-${index}`}
                    className={cx(
                      'grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none',
                      open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 text-sm leading-relaxed text-ink-2">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
