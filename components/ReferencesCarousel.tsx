"use client";

import { useRef } from "react";

const TESTIMONIALS = [
  {
    name: "Gabriel S.",
    tag: "@gabs_rblx",
    avatar: "🧑‍💻",
    stars: 5,
    text: "Comprei uma conta Blox Fruits e recebi em menos de 5 minutos. Entrega super rápida, recomendo demais!",
  },
  {
    name: "Mariana L.",
    tag: "@mary_plays",
    avatar: "👩‍🎮",
    stars: 5,
    text: "Achei que era golpe, mas chegou tudo certinho. Suporte muito atencioso, nota 10!",
  },
  {
    name: "Lucas R.",
    tag: "@luca_rox",
    avatar: "🧑‍🦱",
    stars: 5,
    text: "Melhor loja de contas Roblox que já comprei. Preço justo e entrega automática. Top!",
  },
  {
    name: "Ana Clara",
    tag: "@anaclara_gg",
    avatar: "👩‍�",
    stars: 5,
    text: "Já é a terceira vez que compro aqui. Sempre confiável e rápido. Vocês são feras!",
  },
  {
    name: "Pedro H.",
    tag: "@pedroh_vip",
    avatar: "🧑",
    stars: 5,
    text: "Conta com V4 exatamente como descrito. Sistema de pagamento seguro e sem dor de cabeça.",
  },
  {
    name: "Fernanda T.",
    tag: "@feh_tt",
    avatar: "�",
    stars: 5,
    text: "Recomendo pra galera que tá com medo de comprar online. Aqui é de confiança mesmo!",
  },
  {
    name: "Diego M.",
    tag: "@diegobf",
    avatar: "👨‍🦯",
    stars: 5,
    text: "Comprei pra presentear meu irmão e ele ficou muito feliz. Conta incrível pelo preço!",
  },
  {
    name: "Isabela C.",
    tag: "@bela_games",
    avatar: "👱‍♀️",
    stars: 5,
    text: "Atendimento rápido no Discord. Suporte resolveu meu problema em minutos. Amei!",
  },
];

const ITEMS = [...TESTIMONIALS, ...TESTIMONIALS];

function Stars({ count }: { count: number }) {
  return (
    <div className="refs-stars">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i}>★</span>
      ))}
    </div>
  );
}

export default function ReferencesCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <section className="refs-carousel-section">
      <div className="refs-carousel-header">
        <div className="refs-carousel-eyebrow">O que dizem nossos clientes</div>
        <p className="refs-carousel-subtitle">Centenas de compradores satisfeitos em toda a plataforma</p>
      </div>

      <div className="refs-carousel-outer">
        <div className="refs-carousel-fade refs-carousel-fade-left" />
        <div className="refs-carousel-fade refs-carousel-fade-right" />

        <div className="refs-carousel-track" ref={trackRef}>
          {ITEMS.map((item, idx) => (
            <div className="refs-card" key={idx}>
              <Stars count={item.stars} />
              <p className="refs-card-text">&ldquo;{item.text}&rdquo;</p>
              <div className="refs-card-author">
                <div className="refs-card-avatar">{item.avatar}</div>
                <div>
                  <div className="refs-card-name">{item.name}</div>
                  <div className="refs-card-tag">{item.tag}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
