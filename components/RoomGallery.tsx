'use client'

import { useState } from 'react'
import Image from 'next/image'

interface RoomGalleryProps {
  images: string[]
  roomName: string
}

export default function RoomGallery({ images, roomName }: RoomGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setIsLightboxOpen(true)
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
  }

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox()
    if (e.key === 'ArrowRight') nextImage()
    if (e.key === 'ArrowLeft') prevImage()
  }

  if (images.length === 0) {
    return (
      <div className="aspect-[4/3] bg-gradient-to-br from-[#E8E4DF] to-[#D6D0C8] flex items-center justify-center rounded-xl border-2 border-dashed border-[#C4622D]/30">
        <div className="text-center p-8">
          <span className="text-6xl mb-4 block" aria-hidden="true">📸</span>
          <h3 className="text-lg font-semibold text-[#1C1917] mb-2">Add Your Room Photos</h3>
          <p className="text-[#78716C] text-sm mb-4">
            Upload your beautiful room images to showcase your space
          </p>
          <div className="text-xs text-[#78716C] bg-white/50 rounded-lg p-3">
            <p className="font-medium mb-1">To add images:</p>
            <p>1. Add photos to <code className="bg-[#C4622D]/10 px-1 rounded">public/images/room/</code></p>
            <p>2. Update the ROOM_IMAGES array in page.tsx</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div className="aspect-[4/3] relative rounded-xl overflow-hidden bg-[#F5F0EB] cursor-pointer group">
          <Image
            src={images[selectedImage]}
            alt={`${roomName} - View ${selectedImage + 1}`}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={selectedImage === 0}
            onClick={() => openLightbox(selectedImage)}
          />
          {/* Overlay with click hint */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3">
              <svg className="w-6 h-6 text-[#1C1917]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Thumbnail Grid */}
        {images.length > 1 && (
          <div className="grid grid-cols-6 gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                onDoubleClick={() => openLightbox(index)}
                className={`aspect-square relative rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  selectedImage === index
                    ? 'border-[#C4622D] ring-2 ring-[#C4622D]/20'
                    : 'border-[#D6D0C8] hover:border-[#C4622D]/50'
                }`}
              >
                <Image
                  src={image}
                  alt={`${roomName} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 16vw, 8vw"
                />
              </button>
            ))}
          </div>
        )}

        <p className="text-sm text-[#78716C] text-center">
          Click any image to view full screen • {images.length} photos
        </p>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-[#C4622D] transition-colors z-10"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Previous button */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 text-white hover:text-[#C4622D] transition-colors z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Next button */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 text-white hover:text-[#C4622D] transition-colors z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Main lightbox image */}
          <div className="relative max-w-[90vw] max-h-[90vh] w-full h-full flex items-center justify-center">
            <Image
              src={images[lightboxIndex]}
              alt={`${roomName} - Full view ${lightboxIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Image counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full">
            {lightboxIndex + 1} of {images.length}
          </div>
        </div>
      )}
    </>
  )
}