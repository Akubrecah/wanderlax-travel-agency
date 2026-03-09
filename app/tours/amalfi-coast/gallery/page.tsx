import React from 'react';

export default function AmalfiCoastGalleryPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
      <style dangerouslySetInnerHTML={{__html: `
        .editorial-grid {
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            gap: 1.5rem;
        }
      `}} />
      <div className="max-w-[1100px] mx-auto min-h-screen bg-white dark:bg-background-dark shadow-2xl my-8 p-12 md:p-20 flex flex-col">
        <header className="flex items-center justify-between border-b border-primary/20 pb-8 mb-12">
          <div className="flex items-center gap-3">
            <div className="text-primary">
              <span className="material-symbols-outlined text-3xl">diamond</span>
            </div>
            <h2 className="text-slate-900 dark:text-slate-100 text-xl font-black tracking-[0.2em]">Twende Africa Tours</h2>
          </div>
          <div className="text-primary font-medium tracking-widest text-xs uppercase">
            Private Collection — 2024
          </div>
        </header>

        <main className="flex-grow">
          <div className="mb-16">
            <h1 className="text-slate-900 dark:text-slate-100 text-6xl md:text-7xl font-light tracking-tight leading-tight">
              Visual Journey: <br/>
              <span className="font-black italic">The Amalfi Coast</span>
            </h1>
            <div className="w-24 h-1 bg-primary mt-8"></div>
            <p className="mt-8 text-slate-500 dark:text-slate-400 max-w-xl text-lg leading-relaxed">
              A curated collection of moments captured across the rugged shoreline, from the lemon groves of Sorrento to the high cliffs of Ravello.
            </p>
          </div>

          <div className="editorial-grid">
            {/* Main Cinematic Shot */}
            <div className="col-span-12 mb-8">
              <div className="aspect-[21/9] w-full bg-slate-200 overflow-hidden rounded-lg group relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  alt="Panoramic view of Positano at sunset" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  data-alt="Golden hour panoramic view of Positano coastal town" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiqUtzFTyvl5G63ITaANmA2UQ2t7U0aO9pXj-E6R2UwtVlYQ-wX0HTH88uCCsN8DvzlAeLnOEEWDWchp4aNr1eAr_OylZVxR2JtDz1DN7gUGUzy7QMaMz89YbfWIr3anx61Og_BhV2845ONHrs6328YOXfZGqSbcSFpSgryx2QAD2jf7HYNwTCCbnLdWD6RSkpXWgOgdla0-nim1IZshngzLlgXH19JpQuXjGn4Z7d9dBeWyoDuSbnVdv_8RxTvxoXtzNc-rgIgw"
                />
                <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-black/80 px-4 py-2 text-[10px] tracking-widest uppercase font-bold text-primary">
                  Golden Hour over the Tyrrhenian Sea
                </div>
              </div>
            </div>

            {/* Portrait & Detail Duo */}
            <div className="col-span-12 md:col-span-7">
              <div className="aspect-[4/5] w-full bg-slate-200 overflow-hidden rounded-lg group relative mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  alt="Classic Italian architecture in Positano" 
                  className="w-full h-full object-cover" 
                  data-alt="Vertical shot of colorful Italian hillside buildings" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGtIoBLDMiOjOKhvyaKW2TtW_p51iCzVPP_LLHeiL_ybN9r-gIOmW9bM1mbEMv8NzetOrne2yDYkjmFfthFGngu9SLhklUleiSmXSl8wB_jBQh5RISCI4bbQ1ISedyC5C0vyLCCQM1Y8cHVXCRW5jWXRVvmg7W9eUi7nLWTQUyi-MGXANwysZvOuF061xc_czVVx6HRImFsYF2j_SbsqtxL_SGspjzgtDPZlevps-QYStzgEE3u--7PJUBClOCz3Ix2sIiTaIuYg"
                />
              </div>
              <p className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold mb-8">Architecture of the vertical city, Positano</p>
            </div>

            <div className="col-span-12 md:col-span-5 flex flex-col gap-6">
              <div className="aspect-square w-full bg-slate-200 overflow-hidden rounded-lg group relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  alt="Private boat cruise" 
                  className="w-full h-full object-cover" 
                  data-alt="Luxury wooden Riva boat cruising on blue water" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJ_jrJS2NBqt8VkQS7bt1v1ULuN1l-isOpg4EY1RqDZShg0iQvFpQ7F6WmE4_lHaZcjJk3AJwEvCARLDGvmS3WvgP0VpB4kdzW4spT_l7-xqt8QzFCqp49nISFkuj8k_FMZ5KsBYEmAVh2IXpysWmgxSfLuvbiSOYi3BLAuoQrWhh0_LoAkA_zlBlNZnO49ZdCWsWOP_afqXkbX0q1Qopnk_y_ck1LmgVLrip2aVV4Ec_GSHP-VROmVavu5gInsWP1W5BZv8-l0w"
                />
                <div className="absolute inset-0 border-[12px] border-white/10 pointer-events-none"></div>
              </div>
              <p className="text-[11px] uppercase tracking-widest text-primary font-bold">Private Riva Cruise: Emerald Grotto</p>

              <div className="aspect-[3/4] w-full bg-slate-200 overflow-hidden rounded-lg group relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  alt="Vintage car in the hills" 
                  className="w-full h-full object-cover" 
                  data-alt="Classic vintage sports car parked on a mountain road" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBofJuyQY_zgG17YeNaRnA_sz2FvRQ4gGfCXAtCrkGXgJrXK7Cai0hiZXJ74nEqXWz95zxaeGD87u6te2v-W_oeIHnymM9FHX4crqLpBygKjmbZJmSfEdzoqHSO--EQbesVE8v06gUBBSuwkaGnn_cs0P7COhhQeOEO6HX4P3aHTYvPux6L2tsUQvjp9LRQ3PDydgLTLsgJpA1hkQpcYRhkAj3gqcTBwW3O4jw0kNc9XqyTZt40SPzMNK7c3u8mZC0B-OFetCC1pQ"
                />
              </div>
              <p className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold">Vintage Ferrari in the hills of Ravello</p>
            </div>

            {/* Trio Grid */}
            <div className="col-span-12 md:col-span-4 mt-8">
              <div className="aspect-square w-full bg-slate-200 overflow-hidden rounded-lg mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  alt="Venetian style windows" 
                  className="w-full h-full object-cover" 
                  data-alt="Close up of ornate Italian window shutters and flowers" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfsGHSj5L9dzYhh4bqmBpdI7DcXHqj1FyZMMA8fXe9LLaHecbqbsdsFHaELWkiigzZE7AJECdk42m2QZWoi7vFhnqavkzF379iatR8x5IpH8VJrrbTz2FjpRqjCllRaLLTil5K_F56_oMFrh4IOnnawsH6fS5p4QHTXq0b01v9t3BpWguAMyrG-_qcXn2fqWfMO4O1UpdcTuB6rcuR4fqghMP7kpWVnemxxkdjmONNHvIj4ZtGUjGwE2O6n4IUUFdkAM3kgRTiXw"
                />
              </div>
              <p className="text-[10px] italic text-slate-500">Local details, Amalfi Town</p>
            </div>

            <div className="col-span-12 md:col-span-4 mt-8">
              <div className="aspect-square w-full bg-slate-200 overflow-hidden rounded-lg mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  alt="Mediterranean Cuisine" 
                  className="w-full h-full object-cover" 
                  data-alt="Luxury seafood dish served on a terrace overlooking sea" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAj5otgI8U5d0t2SLZmcj4TzFeyyChFJCT6FDOoPKroWBpWQBpPOcReV-mtMJxM_0h3_fC5DJluebFosadxtM5h6nbH2JPgJy8LlGJa325dkuz33hPNLVH4mKnJzddj0MTErG9PLdlq9nXgnxT4kBp2M2pceuA9b-xpPGFKLd5sgHVP8zjfn1j1vT4V4_3tTv1bPrlKQGaiQJJaE2RNaPCkEOs_TIDLEx69YVCysV4tvghiIJJtejNLEiM9Ce1Nuy60Atolw9z6dg"
                />
              </div>
              <p className="text-[10px] italic text-slate-500">Gourmet dining at La Sponda</p>
            </div>

            <div className="col-span-12 md:col-span-4 mt-8">
              <div className="aspect-square w-full bg-slate-200 overflow-hidden rounded-lg mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  alt="Cliffside pool" 
                  className="w-full h-full object-cover" 
                  data-alt="Luxury infinity pool overlooking the Mediterranean sea" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCl8d5kCRVFS7YYUi--c13tsbBrYCs_pd-jFkV3ClWKpazQ7aihl_kaGSnqjLn3n-Nnmo3rgHfE2-wVt-dlI7ABJVHCp7xvFU15CnmTQT-NTaGLkJcr9IaeOrv8qQNg7kvlG3cRtUhiTn64LNn4XuyDd8NnyK4oEITmnELNZnlkEdmmBOKBVnmkMXPn0TnWxyzJsrAEb-n-4VhhGcIsU9oQSOXkvqFUF4H_FzceY7UThIDpfAUhjO1m8fy-XnGsylVhsPrZtUvXYA"
                />
              </div>
              <p className="text-[10px] italic text-slate-500">The infinity edge of Belmond Caruso</p>
            </div>
          </div>
        </main>

        <footer className="mt-20 pt-12 border-t border-slate-100 dark:border-slate-800 flex justify-between items-end">
          <div className="flex flex-col gap-2">
            <span className="text-primary text-2xl font-black">04</span>
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold">Page Sequence</p>
          </div>
          <div className="text-right">
            <p className="text-slate-900 dark:text-slate-100 text-sm font-bold tracking-tighter mb-1">UNCOMPROMISING LUXURY</p>
            <p className="text-slate-400 text-[9px] uppercase tracking-widest">Twende Africa Tours &copy; 2024</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
