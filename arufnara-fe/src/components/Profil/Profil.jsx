import Image from "next/image";
import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Profil = () => {
  return (
    <div className="py-24 pb-10 bg-gradient-to-br from-blue-900/70 via-indigo-900/60 to-purple-800/70 sm:pb-0">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 place-items-center">
          {/* Left text content section */}
          <div className="pb-6 space-y-5 text-white sm:p-16">
            <h1 data-aos="fade-up" className="text-2xl font-semibold sm:text-3xl">
              ArufnaraStore
            </h1>
            <h1 data-aos="fade-up" className="text-3xl font-bold sm:text-4xl">
              TERLARIS SEPANJANG MASA
            </h1>
            <p data-aos="fade-up" className="leading-8 tracking-wide text-white/80">
              Arufnara Store, sebuah platform digital untuk pembelian dan top-up 
              voucher game secara cepat, aman, dan efisien.
            </p>
          </div>
          {/* Right carousel section */}
          <div data-aos="zoom-in" className="p-6 w-full max-w-md max-h-[400px]">
            <div className="p-4 border shadow-lg rounded-3xl bg-white/20 border-white/20 backdrop-blur-md">
              <Carousel
                autoPlay
                infiniteLoop
                showThumbs={false}
                showStatus={false}
                interval={3000}
              >
                <div>
                  <Image src="/ml-logo.png" alt="ML Logo 1" width={600} height={800}  />
                </div>
                <div>
                  <Image src="/ml-hero1.png" alt="Hero ML 1" width={600} height={600}  />
                </div>
                <div>
                  <Image src="/ml-hero2.png" alt="Hero ML 2"  width={600} height={600} />
                </div>
                {/* Tambahkan gambar sesuai kebutuhan */}
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profil;