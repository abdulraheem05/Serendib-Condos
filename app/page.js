
"use client";

import Image from "next/image";
import { ArrowUpRight, Compass, Handshake, Globe2 } from "lucide-react";
import Header from "@/components/Header";
import Explorer from "@/components/Explorer";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/data";
import EnquiryButton from "@/components/EnquiryButton";
import SmoothScroll from "@/components/SmoothScroll";
import { emailLink } from "@/lib/projects";

function scrollToSection(event, sectionId) {
  event.preventDefault();
  document.getElementById(sectionId)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <a
        className="skip"
        href="#main"
        onClick={(event) => scrollToSection(event, "main")}
      >
        Skip to content
      </a>

      <Header />

      <main id="main">
        <section
          id="home"
          className="hero container"
          aria-labelledby="home-title"
        >
          <Image
            src="/assets/hero.jpg"
            alt="Illustrative modern apartment dining and living space with floor-to-ceiling windows"
            fill
            priority
            sizes="(max-width: 1200px) 96vw, 1200px"
            className="hero-image"
          />

          <Reveal className="hero-content">
            <p className="eyebrow light">
              Rooted in Sri Lanka. Connected to you.
            </p>
            <h1 id="home-title">
              A place to call home.
              <br />A connection to <em>Sri Lanka.</em>
            </h1>
            <p>
              Discover condominium opportunities across the island, with
              guidance for buyers living overseas.
            </p>
            <a
              href="#properties"
              className="button gold"
              onClick={(event) => scrollToSection(event, "properties")}
            >
              Explore properties
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </Reveal>

          <div className="hero-bottom">
            <span>City addresses</span>
            <span>Coastal escapes</span>
            <span>Hill-country calm</span>
          </div>
        </section>

        <Explorer />

        <section
          id="how"
          className="section container"
          aria-labelledby="how-title"
        >
          <div className="section-head">
            <div>
              <p className="eyebrow">How it works</p>
              <h2 id="how-title">From first look to next steps.</h2>
            </div>
          </div>

          <div className="steps">
            {[
              [
                "Build your shortlist",
                "Choose a location and compare the project details that matter to you.",
              ],
              [
                "Understand the terms",
                "Request the developer’s payment schedule, specifications and construction updates.",
              ],
              [
                "Speak to the project team",
                "Arrange a conversation and get independent legal advice before committing.",
              ],
            ].map(([title, text], i) => (
              <Reveal key={title} delay={i * 0.06}>
                <article>
                  <span className="step-number">0{i + 1}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section
          id="about"
          className="about section"
          aria-labelledby="about-title"
        >
          <div className="container about-grid">
            <Reveal>
              <p className="eyebrow">About Serendib Condos</p>
              <h2 id="about-title">
                Closer to the place
                <br />
                you have in mind.
              </h2>
            </Reveal>

            <Reveal delay={0.08}>
              <p>
                Based in Canada, we help overseas clients explore condos and
                apartments in Sri Lanka and connect with development teams.
              </p>
              <div className="about-points">
                {[
                  [Compass, "Location-led discovery"],
                  [Handshake, "Developer connections"],
                  [Globe2, "Guidance from overseas"],
                ].map(([Icon, label]) => (
                  <span className="flex items-center gap-3" key={label}>
                    <Icon size={18} className="text-gold" aria-hidden="true" />
                    {label}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section
          id="contact"
          className="section container contact"
          aria-labelledby="contact-title"
        >
          <Reveal>
            <p className="eyebrow">Consultation</p>
            <h2 id="contact-title">
              Let’s talk about
              <br />
              what you’re looking for.
            </h2>
            <p>Share your preferred city, budget and timeline.</p>
          </Reveal>

          <Reveal className="contact-box" delay={0.08}>
            <ArrowUpRight className="contact-symbol" aria-hidden="true" />
            <h3>Start a conversation</h3>
            <a
              className="email-link"
              href={emailLink(site.email, "Sri Lanka property enquiry")}
            >
              {site.email}
            </a>
            <EnquiryButton className="button">
              Book a consultation
              <ArrowUpRight size={16} aria-hidden="true" />
            </EnquiryButton>
          </Reveal>
        </section>
      </main>

      <footer>
        <div className="container footer-inner">
          
          <p>© {new Date().getFullYear()} Serendib Condos</p>
          
        </div>
      </footer>
    </>
  );
}
