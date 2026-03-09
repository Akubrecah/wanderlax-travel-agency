import React from 'react';

export default function LocalExpertsPage() {
  return (
    <div className="bg-white text-[#1a1a1a] font-sans selection:bg-[#c51110] selection:text-white min-h-screen">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')]" />

      <main className="relative max-w-[1000px] mx-auto min-h-screen p-12 md:p-20 flex flex-col">
        {/* BEGIN: Header Section */}
        <header className="mb-16 z-10 relative">
          <div className="flex justify-between items-start mb-12">
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#1a1a1a] mb-1">
                Twende Africa Tours
              </span>
              <span className="text-[8px] tracking-[0.2em] uppercase text-[#717171]">
                LUXURY TRAVEL REIMAGINED
              </span>
            </div>
            <div className="text-[8px] tracking-[0.2em] uppercase text-[#717171]">
              PRIVATE COLLECTION — 2024
            </div>
          </div>

          <div className="mt-8">
            <h1 className="text-5xl md:text-6xl font-serif italic mb-4 text-[#1a1a1a]">
              Meet Your <br />
              <span className="not-italic font-bold">Local Experts</span>
            </h1>
            <div className="w-[40px] h-[2px] bg-[#c51110] mb-8"></div>
            <p className="max-w-2xl text-lg text-[#717171] leading-relaxed font-light">
              Our journeys are defined by the people who share them. We have
              hand-selected the most passionate historians, celebrated chefs, and
              local insiders to ensure your time on the Amalfi Coast is as
              authentic as it is unforgettable.
            </p>
          </div>
        </header>

        {/* BEGIN: Guide Profiles Grid */}
        <section
          className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20 z-10 relative"
          data-purpose="guide-profiles"
        >
          {/* Guide 1: Lorenzo */}
          <article className="flex flex-col group cursor-pointer" data-purpose="guide-card">
            <div className="relative aspect-[3/4] mb-6 overflow-hidden bg-gray-100">
              <img
                alt="Lorenzo - Historical Specialist"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 shadow-sm"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVIeGObn24pdGc_Fy496hVs4o0XqJy7s2ze5eAXCW0Lp_BFV5FTr4xjf2eSue2JUislCrTCHnDefCTOJssn9uk934I3cUXMVjbXiFlu6hR-WWghD7ikPCrnUDepB4Nt-iYzk5SDkB48OOSBVcaq74mjse82P7hRF71QKg_Wip0s2Bef37ix8Q1JquUqC1397O7O779-zlTCoDj__uOr8COhtywPHdU5v0UICYoBvYpoY_vn7B6J5oYzKxzVJ-nGpV0Z8_5q1TMZA"
              />
            </div>
            <h3 className="text-xl font-bold tracking-tight mb-1">Lorenzo Di Luca</h3>
            <p className="text-xs uppercase tracking-widest text-[#717171] font-semibold mb-4">
              Historical Specialist
            </p>
            <p className="text-sm leading-relaxed text-[#717171] mb-6">
              A native of Ravello with a PhD in Art History, Lorenzo has spent two
              decades uncovering the hidden stories behind the coast&apos;s most iconic
              villas and forgotten ruins.
            </p>
            <div className="mt-auto">
              <span className="text-[10px] uppercase font-bold text-[#c51110] tracking-wider block mb-1">
                Ask me about...
              </span>
              <p className="text-sm italic text-[#1a1a1a]">
                The secret gardens of Villa Cimbrone at dawn.
              </p>
            </div>
          </article>

          {/* Guide 2: Chiara */}
          <article className="flex flex-col group cursor-pointer" data-purpose="guide-card">
            <div className="relative aspect-[3/4] mb-6 overflow-hidden bg-gray-100">
              <img
                alt="Chiara - Culinary Expert"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 shadow-sm"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOJaYcLOZZKsthdnXelKDESsFP__9xXx7_Icxgrhjw9klkq14UdFNxae3c0k_cnrNyLvsXnm6h-SSVH2MPqBv7kgRfYyY42XHF_WT-Q3aMRmJTecitGv39vQp_1R7VD9xa-qW2Ep9-9R0oq5fx7kiHKyTAZxxCv_U9Cj6HHnu-BEaAtBp94HPep1KNpt2k5dd4jvXnPnlY-6hP2cnA1mVgmQVns6AZ8dYDdpOQuhMdjy8zM0sn4WTQgsvtR7kFHFSq_Gds8lRrGg"
              />
            </div>
            <h3 className="text-xl font-bold tracking-tight mb-1">Chiara Russo</h3>
            <p className="text-xs uppercase tracking-widest text-[#717171] font-semibold mb-4">
              Culinary Expert
            </p>
            <p className="text-sm leading-relaxed text-[#717171] mb-6">
              Chiara&apos;s family has farmed the Sorrento lemon groves for
              generations. She connects guests with the region&apos;s soul through
              exclusive kitchen access and private tastings.
            </p>
            <div className="mt-auto">
              <span className="text-[10px] uppercase font-bold text-[#c51110] tracking-wider block mb-1">
                Ask me about...
              </span>
              <p className="text-sm italic text-[#1a1a1a]">
                Where to find the best Gnocchi alla Sorrentina.
              </p>
            </div>
          </article>

          {/* Guide 3: Matteo */}
          <article className="flex flex-col group cursor-pointer" data-purpose="guide-card">
            <div className="relative aspect-[3/4] mb-6 overflow-hidden bg-gray-100">
              <img
                alt="Matteo - Marine Captain"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 shadow-sm"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2Rdm-YgCqsR8Mz5OQFd3l_UsTyzfWK1zmFXYBB7WnMO4iZpSqu8zoYQuopUqOmn-m0JtEHYV2FD3-lWFsZQggg98GbDMCwdANe-xs9fsgOFkvdW2JQDtTvJ5aFqmU6HN7pxxljgRqD09r8jHgkluEkzCzq44HZfYGOCclYfNRFT2lnEOTWHVGacbPypS1U3qhrD5jsy09O_YoN3AmjlCxHvyjDQxCt4UzP89JzGOVqvAvHsK1jM33T3aiF_39S9IYETcRvrWoNQ"
              />
            </div>
            <h3 className="text-xl font-bold tracking-tight mb-1">Matteo Moretti</h3>
            <p className="text-xs uppercase tracking-widest text-[#717171] font-semibold mb-4">
              Private Riva Captain
            </p>
            <p className="text-sm leading-relaxed text-[#717171] mb-6">
              Matteo knows every sea cave and secluded cove between Positano and
              Capri. His knowledge of the Tyrrhenian Sea ensures a perfectly timed
              private voyage.
            </p>
            <div className="mt-auto">
              <span className="text-[10px] uppercase font-bold text-[#c51110] tracking-wider block mb-1">
                Ask me about...
              </span>
              <p className="text-sm italic text-[#1a1a1a]">
                Swimming in the Emerald Grotto after hours.
              </p>
            </div>
          </article>
        </section>

        {/* BEGIN: Footer */}
        <footer className="mt-auto pt-12 border-t border-gray-100 flex justify-between items-end z-10 relative">
          <div className="flex flex-col">
            <span className="text-2xl font-serif font-bold text-[#c51110]">
              05
            </span>
            <span className="text-[8px] uppercase tracking-widest text-[#717171] mt-1">
              Page Sequence
            </span>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-bold tracking-widest uppercase mb-1">
              UNCOMPROMISING LUXURY
            </p>
            <p className="text-[8px] tracking-[0.1em] text-[#717171] uppercase">
              TWENDE AFRICA TOURS © 2024
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
