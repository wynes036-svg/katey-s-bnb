import type { ArtistSpotlight as ArtistSpotlightType } from '@/types'

interface ArtistSpotlightProps {
  spotlight: ArtistSpotlightType
}

export default function ArtistSpotlight({ spotlight }: ArtistSpotlightProps) {
  return (
    <article
      className="rounded-2xl overflow-hidden bg-white border border-[#D6D0C8] shadow-sm"
      aria-label={`Artist Spotlight: ${spotlight.title}`}
    >
      {/* Video player */}
      <div className="relative w-full aspect-video bg-black">
        <video
          src={spotlight.videoUrl}
          className="w-full h-full object-cover"
          controls
          preload="metadata"
          playsInline
          aria-label={`${spotlight.title} — artist spotlight video`}
        />
      </div>

      {/* Content */}
      <div className="p-6 sm:p-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#C4622D]">
          Artist Spotlight
        </p>
        <h2
          className="mb-4 text-2xl sm:text-3xl text-[#1C1917]"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          {spotlight.title}
        </h2>

        <p className="text-[#78716C] leading-relaxed whitespace-pre-line">
          {spotlight.description}
        </p>

        {/* External link — only rendered when externalUrl is present */}
        {spotlight.externalUrl && (
          <a
            href={spotlight.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-[#C4622D] px-5 py-2.5 text-sm font-medium text-[#C4622D] transition-colors hover:bg-[#C4622D] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#C4622D] focus:ring-offset-2"
            aria-label={`Visit ${spotlight.title}'s external profile (opens in new tab)`}
          >
            Visit Profile
            <svg
              className="w-4 h-4"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        )}
      </div>
    </article>
  )
}
