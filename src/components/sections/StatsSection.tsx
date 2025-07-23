import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';

const StatsSection: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const stats = [
    { label: 'Professional Wins', value: 3, suffix: '' },
    { label: 'KO Victories', value: 3, suffix: '' },
    { label: 'Fight Win Rate', value: 100, suffix: '%' },
    { label: 'National Amateur Titles', value: 9, suffix: '' },
    { label: 'Years Training', value: 10, suffix: '' },
    { label: 'Age', value: 18, suffix: '' },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 text-white relative overflow-hidden">
      {/* Boxing ring aesthetic background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border-4 border-primary-600 rounded-full animate-pulse-slow" />
        <div className="absolute bottom-10 right-10 w-24 h-24 border-4 border-gold-500 rounded-full animate-bounce-slow" />
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-gradient-to-r from-primary-600/20 to-gold-500/20 rounded-full animate-float" />
      </div>
      
      <div className="container-max relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl lg:text-7xl font-black mb-6">
            The <span className="ring-text">Numbers</span> Don't Lie
          </h2>
          <p className="text-xl text-gold-200 max-w-4xl mx-auto font-semibold">
            Kumar "The Raw One" Prescod's championship statistics speak for themselves. From 9x national amateur champion 
            to perfect 3-0 professional record with 100% KO rate - every number tells a story of dedication, hard work, and championship potential.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold ring-text mb-2">
                {inView && (
                  <CountUp
                    end={stat.value}
                    duration={2}
                    suffix={stat.suffix}
                  />
                )}
              </div>
              <div className="text-sm md:text-base text-gold-200 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection; 