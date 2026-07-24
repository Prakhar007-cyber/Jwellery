/*
  A slow, elegant typographic marquee. The row is duplicated and
  translated -50% so it loops seamlessly (see .animate-marquee).
*/
const WORDS = ["Rings", "Necklaces", "Bracelets", "Earrings", "ÉLANORA"];

export function Marquee() {
  const row = [...WORDS, ...WORDS];
  return (
    <section className="overflow-hidden border-y border-line bg-ivory py-10">
      <div className="flex w-max animate-marquee whitespace-nowrap will-change-transform">
        {row.map((word, i) => (
          <span key={i} className="flex items-center">
            <span className="display px-8 text-6xl text-espresso lg:text-8xl">{word}</span>
            <span className="text-3xl text-gold">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}
