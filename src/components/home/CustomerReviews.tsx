"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Rahim Ahmed",
    role: "Customer",
    rating: 5,
    comment:
      "Rentora made it easy to find the equipment I needed for my construction project. The rental process was simple and convenient.",
    initial: "R",
  },
  {
    name: "Nusrat Jahan",
    role: "Customer",
    rating: 5,
    comment:
      "I found photography equipment at an affordable price. The platform is easy to use and saves a lot of time.",
    initial: "N",
  },
  {
    name: "Tanvir Hasan",
    role: "Customer",
    rating: 4,
    comment:
      "A useful platform for renting equipment without buying expensive products. I really like the simple experience.",
    initial: "T",
  },
  {
    name: "Sadia Islam",
    role: "Customer",
    rating: 5,
    comment:
      "Rentora offers different types of equipment in one place. It makes finding the right rental equipment much easier.",
    initial: "S",
  },
];

export default function CustomerReviews() {
  return (
    <section className="relative overflow-hidden bg-[#FFF9EA] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
      {/* Soft background glow */}
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-[#F5B82E]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-[#B4651B]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-[#F5B82E]/25 px-4 py-2 text-xs font-bold uppercase tracking-[2px] text-[#7C4A0E]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B4651B]" />
            Customer Feedback
          </span>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-[#3B2314] sm:text-5xl">
            What Our Customers{" "}
            <span className="bg-linear-to-r from-[#E6A515] to-[#B4651B] bg-clip-text text-transparent">
              Say
            </span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#6B4426]/85 sm:text-base">
            Discover what customers appreciate about the Rentora
            equipment rental experience.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reviews.map((review, index) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col overflow-hidden rounded-3xl bg-white p-6 shadow-[0_14px_40px_-24px_rgba(59,35,20,0.35)] ring-1 ring-[#EBDCB5] transition-all duration-300 hover:shadow-[0_24px_50px_-20px_rgba(59,35,20,0.4)] hover:ring-[#F5B82E]"
            >
              {/* Corner glow */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#F5B82E]/0 blur-2xl transition-all duration-500 group-hover:bg-[#F5B82E]/30" />

              <div className="relative flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#3B2314] text-[#F5B82E] shadow-md shadow-[#3B2314]/20">
                  <Quote size={20} />
                </div>

                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      className={
                        i < review.rating
                          ? "fill-[#F5B82E] text-[#F5B82E]"
                          : "text-[#E5D6B5]"
                      }
                    />
                  ))}
                </div>
              </div>

              <p className="relative mt-5 min-h-30 flex-1 text-sm leading-7 text-[#6B4426]/90">
                &ldquo;{review.comment}&rdquo;
              </p>

              <div className="relative mt-6 flex items-center gap-3 border-t border-[#F0E3BF] pt-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F5B82E] text-lg font-extrabold text-[#3B2314] ring-4 ring-[#FFF3CF]">
                  {review.initial}
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-[#3B2314]">
                    {review.name}
                  </h3>
                  <p className="mt-1 text-xs text-[#6B4426]/70">
                    {review.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}