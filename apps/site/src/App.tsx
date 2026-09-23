import { motion } from 'motion/react'
import { ArrowRightIcon, CaretRightIcon } from '@phosphor-icons/react'
import { ButtonLink, SiteBar } from '@leonida/ui'

const rise = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
}

const APPS = [
  {
    id: 'stories',
    name: 'Leonida Stories',
    href: '/stories/',
    image: '/assets/scene-neon-tropics.jpg',
    alt: 'Neon Tropics hotel on a wet boulevard at night',
    pitch: 'A night-feed phone app. Grab a sighting, edit it, and watch the locals react.',
    flow: ['Pick a scene', 'Edit the shot', 'Post the rumor'],
    accent: 'text-vice',
    ring: 'group-hover:border-vice/50',
    span: 'lg:col-span-7',
    aspect: 'aspect-[16/10]',
  },
  {
    id: 'hijack',
    name: 'Billboard Hijack',
    href: '/hijack/',
    image: '/assets/board-city-neon.jpg',
    alt: 'Blank billboard above a neon art deco storefront',
    pitch: 'Scout a blank board, design a rogue ad, and put it on the skyline.',
    flow: ['Scout a board', 'Design the ad', 'Go live'],
    accent: 'text-sodium',
    ring: 'group-hover:border-sodium/50',
    span: 'lg:col-span-5',
    aspect: 'aspect-[16/10] lg:aspect-[4/5]',
  },
] as const

const TOOLS = ['Filters', 'Crop', 'Resize', 'Text', 'Shapes', 'Stickers', 'Draw', 'Frames']

export default function App() {
  return (
    <div className="min-h-dvh bg-ink-950">
      <SiteBar current="home" />

      <section className="relative isolate flex min-h-[620px] items-end md:min-h-[min(calc(100dvh-3.5rem),860px)] overflow-hidden">
        <img
          src="/assets/hero-leonida-collage.jpg"
          alt=""
          className="absolute inset-0 -z-10 h-full w-full object-cover object-[65%_center]"
          fetchPriority="high"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(11_10_15/0.88)_0%,rgb(11_10_15/0.6)_32%,transparent_62%),linear-gradient(0deg,var(--color-ink-950)_0%,rgb(11_10_15/0.4)_35%,transparent_60%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,var(--color-ink-950)_0%,rgb(11_10_15/0.8)_40%,transparent_75%)] md:hidden"
        />
        <motion.div
          className="mx-auto w-full max-w-[1400px] px-4 pb-14 pt-24 md:px-6 md:pb-20"
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.08 }}
        >
          <motion.h1
            variants={rise}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="type-display text-[clamp(4.5rem,15vw,10rem)] leading-[0.85] tracking-[0.01em] text-fg"
          >
            Leonida
          </motion.h1>
          <motion.p
            variants={rise}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-[34ch] text-lg leading-relaxed text-fg/80 md:text-xl"
          >
            Two fan-made apps built on the Unlayer Image Editor. Leak a story from the loop, or
            take over a billboard.
          </motion.p>
          <motion.div
            variants={rise}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <ButtonLink href="/stories/" size="lg" className="[--color-accent:var(--color-vice)]">
              Open Stories
              <ArrowRightIcon size={18} weight="bold" aria-hidden />
            </ButtonLink>
            <ButtonLink href="/hijack/" size="lg" className="[--color-accent:var(--color-sodium)]">
              Open Hijack
              <ArrowRightIcon size={18} weight="bold" aria-hidden />
            </ButtonLink>
          </motion.div>
        </motion.div>
      </section>

      <main className="mx-auto max-w-[1400px] px-4 md:px-6">
        <section aria-labelledby="apps-title" className="py-16 md:py-24">
          <h2 id="apps-title" className="type-display text-4xl text-fg md:text-5xl">
            Pick your night
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-12">
            {APPS.map((app, i) => (
              <motion.a
                key={app.id}
                href={app.href}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className={`group flex flex-col overflow-hidden rounded-surface border border-line bg-ink-900 transition-colors ${app.ring} ${app.span}`}
              >
                <div className={`relative overflow-hidden ${app.aspect} lg:flex-1`}>
                  <img
                    src={app.image}
                    alt={app.alt}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-quint)] group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-col gap-4 p-5 md:p-6">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="type-display text-3xl text-fg">{app.name}</h3>
                    <ArrowRightIcon
                      size={22}
                      weight="bold"
                      aria-hidden
                      className={`${app.accent} shrink-0 transition-transform group-hover:translate-x-1`}
                    />
                  </div>
                  <p className="max-w-[52ch] text-muted">{app.pitch}</p>
                  <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-fg/90">
                    {app.flow.map((step, s) => (
                      <li key={step} className="flex items-center gap-2">
                        {s > 0 && <CaretRightIcon size={12} className="text-subtle" aria-hidden />}
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </motion.a>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="editor-title"
          className="grid grid-cols-1 gap-8 border-t border-line py-16 md:grid-cols-2 md:py-20"
        >
          <div>
            <h2 id="editor-title" className="type-display text-4xl text-fg md:text-5xl">
              One editor underneath
            </h2>
            <p className="mt-4 max-w-[52ch] leading-relaxed text-muted">
              Both apps mount the same Unlayer Image Editor. Stories uses it on phone-sized shots;
              Hijack uses it on a 16:9 ad canvas that gets warped onto the board.
            </p>
          </div>
          <ul className="flex flex-wrap content-start gap-2 md:justify-end">
            {TOOLS.map((tool) => (
              <li
                key={tool}
                className="rounded-full border border-line-strong bg-ink-900 px-4 py-2 text-sm text-fg/90"
              >
                {tool}
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-4 py-8 text-sm text-subtle md:flex-row md:items-center md:justify-between md:px-6">
          <p>Fan parody. Fictional places. Not affiliated with any game studio.</p>
          <div className="flex gap-5">
            <a href="/hijack/assets/ATTRIBUTIONS.md" className="hover:text-fg">
              Image credits
            </a>
            <span className="font-mono">#BuiltWithImageEditor</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
