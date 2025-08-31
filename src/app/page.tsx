import Events from "@/components/Events";
import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <>
      
      <main className="flex flex-col md:flex-row justify-between items-center min-h-[60vh] md:h-[80vh] px-6 md:px-16 pb-4 md:pb-0">
        {/* Left Content */}
        <div className="flex flex-col gap-6 max-w-lg">
          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 leading-snug">
            FIND PLAYERS & <br /> VENUES NEARBY
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-600 font-light italic leading-relaxed">
            Seamlessly explore sports venues <br />
            and play with sports enthusiasts just like you!
          </p>

          {/* Image for Mobile (below text) */}
          <div className="block md:hidden">
            <Image
              src="/pickle2.jpg" // replace with your actual image
              alt="Sports community"
              width={500}
              height={500}
              className="rounded-2xl shadow-lg"
            />
          </div>
        </div>

        {/* Image for Desktop/Tablet (right side) */}
        <div className="hidden md:block">
          <Image
            src="/pickle2.jpg"
            alt="Sports community"
            width={550}
            height={550}
            className="rounded-2xl shadow-lg"
          />
        </div>
      </main>
      <Events/>
    </>
  );
}