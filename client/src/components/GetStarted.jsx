import { ClipboardList, Eye, Save, ArrowRight, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

export default function GetStarted() {
  return (
    <section className="bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-teal-600">
            Get started in 3 simple steps
          </h2>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto">
            A calm, guided way to discover careers that fit your personality
          </p>
        </motion.div>

        {/* Steps */}
        <div className="flex flex-col items-center gap-10">
          {/* Top row */}
          <div className="relative flex items-center gap-10">
            {/* Step 1 */}
            <motion.div
              custom={0}
              variants={cardVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              className="bg-gray-100 border border-gray-300 rounded-2xl 
                w-64 h-64 px-6 py-8 text-center shadow-sm 
                transition-transform"
            >
              <div
                className="w-12 h-12 mx-auto mb-5 rounded-full bg-teal-100 
                flex items-center justify-center"
              >
                <ClipboardList className="w-6 h-6 text-teal-700" />
              </div>

              <h3 className="text-base font-semibold text-gray-900">
                Take a quick quiz
              </h3>
              <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                Answer a short set of questions to reveal your MBTI type.
              </p>
            </motion.div>

            {/* Arrow */}
            <ArrowRight className="hidden md:block w-9 h-9 text-gray-300" />

            {/* Step 2 */}
            <motion.div
              custom={1}
              variants={cardVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              className="bg-gray-100 border border-gray-300  rounded-2xl 
                w-64 h-64 px-6 py-8 text-center shadow-sm 
                transition-transform"
            >
              <div
                className="w-12 h-12 mx-auto mb-5 rounded-full bg-purple-100 
                flex items-center justify-center"
              >
                <Eye className="w-6 h-6 text-purple-700" />
              </div>

              <h3 className="text-base font-semibold text-gray-900">
                See sample matches
              </h3>
              <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                Preview careers that naturally align with your personality.
              </p>
            </motion.div>
          </div>

          {/* Arrow down */}
          <ArrowDown className="w-9 h-9 text-gray-300" />

          {/* Step 3 */}
          <motion.div
            custom={2}
            variants={cardVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
            className=" bg-gray-100 border border-gray-300 rounded-2xl 
              w-64 h-64 px-6 py-8 text-center shadow-sm 
              transition-transform"
          >
            <div
              className="w-12 h-12 mx-auto mb-5 rounded-full bg-blue-100 
              flex items-center justify-center"
            >
              <Save className="w-6 h-6 text-blue-700" />
            </div>

            <h3 className="text-base font-semibold text-gray-900">
              Save your results
            </h3>
            <p className="text-sm text-gray-500 mt-3 leading-relaxed">
              Create an account to keep insights and track your progress.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
