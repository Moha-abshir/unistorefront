import React from "react";
import Hero from "../components/Hero/Hero";
import DiscountedCarousel from "../components/Carousel/DiscountedCarousel";
import FeaturedCarousel from "../components/Carousel/FeaturedCarousel";
import FeaturedCategories from "../components/Featured/FeaturedCategories";
import TrustBadges from "../components/Trust/TrustBadges";
import DealBannerCarousel from "../components/deals/DealBannerCarousel";
import DealsList from "../components/deals/DealsList";
import { Helmet } from "react-helmet";
import "./index.css";

const HomePage = () => {
  return (
    <div className="products-section">
      <div className="hero-carousel-wrapper">
        <DiscountedCarousel />
      </div>
      <FeaturedCarousel />
      <div className="hero-section-standalone">
        <Hero />
      </div>
      <DealBannerCarousel />
      <DealsList />
      <FeaturedCategories />
      <TrustBadges />
      <Helmet>
        {/* Home Page Meta Tags */}
        <title>Manwell Store | Trendy Fashion Clothing in Eastleigh, Nairobi</title>
        <meta
          name="description"
          content="Shop premium quality fashion for men & women at Manwell Store. Affordable, stylish, and latest trends in Eastleigh. Visit us or shop online now!"
        />
        <meta name="keywords" content="
          online fashion store kenya,
          best online shop kenya,
          trendy clothes kenya,
          eastleigh fashion,
          eastleigh clothes online,
          affordable fashion kenya,
          men fashion kenya,
          women fashion kenya,
          unisex fashion kenya,
          latest fashion trends kenya,
          designer clothes kenya,
          casual wear kenya,
          streetwear kenya,
          official wear kenya,
          men suits kenya,
          women dresses kenya,
          hoodies kenya,
          t-shirts kenya,
          jeans kenya,
          shoes kenya,
          handbags kenya,
          fashion accessories kenya,
          online shopping kenya,
          nairobi fashion store,
          wholesale clothes kenya,
          eastleigh wholesale fashion,
          best clothing store kenya,
          top online fashion shop kenya,
          quality clothes kenya,
          fashion deals kenya,
          manwell store,
          manwell clothing kenya
      " />
        <meta name="author" content="Manwell Store" />

        {/* Open Graph */}
        <meta property="og:title" content="Manwell Store | Trendy Fashion Clothing in Eastleigh, Nairobi" />
        <meta property="og:description" content="Shop premium quality fashion for men & women at Manwell Store. Affordable, stylish, and latest trends in Eastleigh. Visit us or shop online now!" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://github.com/Muzamilafey/myassets/blob/main/Mandera%20-%201.png?raw=true" />
        <meta property="og:url" content="https://manwellstore.com" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Manwell Store | Trendy Fashion Clothing in Eastleigh, Nairobi" />
        <meta name="twitter:description" content="Shop premium quality fashion for men & women at Manwell Store. Affordable, stylish, and latest trends in Eastleigh. Visit us or shop online now!" />
        <meta name="twitter:image" content="https://github.com/Muzamilafey/myassets/blob/main/Mandera%20-%201.png?raw=true" />
      </Helmet>
    </div>
  );
};

export default HomePage;
