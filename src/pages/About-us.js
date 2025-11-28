import React from "react";
import "./pages.css"; // external stylesheet

export default function AboutManwell() {
  return (
    <div className="about-container">
      <header className="about-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Manwell Store</h1>
            <p>
              Curating premium fashion for the modern you — handcrafted selections,
              quality fabrics, timeless styling. Visit us in Eastleigh, Nairobi.
            </p>

            <div className="hero-buttons">
              <a href="#visit" className="btn-primary">Visit Us — Eastleigh</a>
              <a href="#collections" className="btn-secondary">Explore Collections</a>
            </div>

            <div className="hero-features">
              <div className="feature-card">
                <h4>Premium Fabrics</h4>
                <p>Thoughtfully sourced — longevity & comfort.</p>
              </div>
              <div className="feature-card">
                <h4>Tailored Fit</h4>
                <p>Expert craftsmanship for every silhouette.</p>
              </div>
              <div className="feature-card">
                <h4>Ethical Practices</h4>
                <p>Mindful production and responsible sourcing.</p>
              </div>
            </div>
          </div>

          <div className="hero-image">
            <img
              alt="Manwell Store - fashion display"
              src="/public/logo.png"
            />
            <p>A curated corner of premium fashion in Eastleigh — seasonal drops and classic staples.</p>
          </div>
        </div>
      </header>

      <main className="about-main">
        <section className="mission-section">
          <div className="mission-text">
            <h2>Our Mission</h2>
            <p>
              At Manwell Store our mission is to provide premium, timeless fashion that empowers confidence.
              We blend quality materials with considered design so every piece becomes a curated favorite in your wardrobe.
            </p>

            <h3>Our Vision</h3>
            <p>
              To be Eastleigh’s destination for premium apparel — known for exceptional service,
              care for craft, and pieces that stand the test of time.
            </p>
          </div>

          <div className="mission-cards">
            <h4>Why choose Manwell?</h4>
            <ul>
              <li>• Carefully selected fabrics & finishes.</li>
              <li>• Small-batch seasonal collections.</li>
              <li>• Personalised fittings and styling advice.</li>
              <li>• Transparent pricing and fair practices.</li>
            </ul>
          </div>
        </section>

        <section className="values-section">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card"><h5>Quality</h5><p>We never compromise on materials or finish.</p></div>
            <div className="value-card"><h5>Craft</h5><p>Local expertise with global standards.</p></div>
            <div className="value-card"><h5>Respect</h5><p>For people, partners, and the environment.</p></div>
            <div className="value-card"><h5>Service</h5><p>Warm, attentive, and personal shopping experience.</p></div>
          </div>
        </section>

        <section className="team-section">
          <h2>Our Team</h2>
          <p>A small team of passionate curators, tailors and stylists dedicated to great clothing and service.</p>
          <div className="team-grid">
            <div className="team-card"><div className="avatar">A</div><div><strong> Founder & Head Curator</strong><p>Styling & collection direction</p></div></div>
            <div className="team-card"><div className="avatar">J</div><div><strong> Lead Tailor</strong><p>Bespoke fittings & alterations</p></div></div>
            <div className="team-card"><div className="avatar">Z</div><div><strong> Customer Experience</strong><p>In-store styling and care guidance</p></div></div>
          </div>
        </section>

        <section id="visit" className="visit-section">
          <div className="visit-info">
            <h2>Visit Manwell Store</h2>
            <p>We are located in the heart of Eastleigh. Drop by for a fitting or browse our latest collection in-person.</p>

            <div className="visit-details">
              <div><h4>Address</h4><p>Eastleigh, Nairobi, Kenya — (Find us on the main market street)</p></div>
              <div><h4>Store Hours</h4><p>Mon–Sat: 9:00 AM — 7:00 PM • Sun: 10:00 AM — 4:00 PM</p></div>
              <div><h4>Contact</h4><p>Phone: +254 794 701 113 • Email: manwellstore@gmail.com</p></div>
              <a href="mailto:manwellstore@gmail.com" className="btn-secondary">Email Us</a>
            </div>
          </div>

          <div className="map-container">
            <iframe
              title="Manwell Store Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.123456789!2d36.8460!3d-1.2620!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sEastleigh%2C%20Nairobi!5e0!3m2!1sen!2ske!4v0000000000"
              allowFullScreen={false}
              loading="lazy"
            />
          </div>
        </section>

        <section className="newsletter-section">
          <div className="newsletter-content">
            <div>
              <h3>Stay updated on drops & events</h3>
              <p>Join our newsletter for early access to new arrivals and exclusive trunk shows.</p>
            </div>
            <form className="newsletter-form">
              <input type="email" placeholder="you@example.com" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </section>

        <footer className="about-footer">
          © {new Date().getFullYear()} Manwell Store — Premium fashion in Eastleigh. All rights reserved.
        </footer>
      </main>
    </div>
  );
}
