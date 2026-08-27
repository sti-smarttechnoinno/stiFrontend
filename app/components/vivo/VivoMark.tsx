"use client";

import Image from "next/image";

export function VivoMark({ light = false }: { light?: boolean }) {
  return (
    <span className={`brand-lockup ${light ? "brand-lockup--light" : ""}`}>
      <span className="brand-symbol" aria-hidden="true">
        <Image
          src="/assets/vivo-logo.svg"
          alt="vivo"
          width={31}
          height={31}
          className="object-contain"
        />
      </span>
      <span className="brand-wordmark">vivo</span>
    </span>
  );
}
