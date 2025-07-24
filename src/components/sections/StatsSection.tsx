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
    { 
      label: 'Professional Wins', 
      value: 3, 
      suffix: '',
      ariaLabel: 'Kumar Prescod has 3 professional boxing wins',
      description: 'Perfect undefeated professional record'
    },
    { 
      label: 'Amateur Wins', 
      value: 63, 
      suffix: '',
      ariaLabel: 'Kumar Prescod has 63 amateur boxing wins',
      description: 'Exceptional 63-8 amateur record'
    },
    { 
      label: 'KO Rate', 
      value: 100, 
      suffix: '%',
      ariaLabel: 'Kumar Prescod has a 100 percent knockout rate professionally',
      description: 'All professional wins by knockout'
    },
    { 
      label: 'National Titles', 
      value: 9, 
      suffix: '',
      ariaLabel: 'Kumar Prescod won 9 national amateur boxing titles',
      description: '9x National Champion - dominant amateur career'
    },
    { 
      label: 'Team USA', 
      value: 2, 
      suffix: 'x',
      ariaLabel: 'Kumar Prescod represented Team USA twice',
      description: 'Selected twice for Team USA international competitions'
    },
    { 
      label: 'Years Training', 
      value: 12, 
      suffix: '',
      ariaLabel: 'Kumar Prescod has been training for 12 years',
      description: 'Started at age 6 - now 12 years of dedicated training'
    },
  ];

  return (
    <section 
      className="py-16 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 text-white relative overflow-hidden"
      aria-labelledby="stats-heading"
      role="region"
    >
      {/* Subtle boxing ring element - performance optimized */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 border-4 border-gold-400/40 rounded-full animate-subtle" />
      </div>
      
      <div className="container-max relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 
            id="stats-heading"
            className="text-5xl lg:text-7xl font-black mb-6"
          >
            The <span className="ring-text">Numbers</span> Don't Lie
          </h2>
          <p className="text-xl text-gold-high-contrast max-w-4xl mx-auto font-semibold">
            Kumar "The Raw One" Prescod's championship statistics speak for themselves. From 9x national amateur champion 
            to perfect 3-0 professional record with 100% KO rate - every number tells a story of dedication, hard work, and championship potential.
          </p>
        </motion.div>

        <div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8"
          role="list"
          aria-label="Kumar Prescod boxing statistics"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center group focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 focus-within:ring-offset-slate-900 rounded-lg p-4 transition-all duration-200 hover:bg-slate-800/30"
              role="listitem"
              tabIndex={0}
              aria-label={stat.ariaLabel}
              aria-describedby={`stat-desc-${index}`}
            >
              <div 
                className="text-3xl md:text-4xl lg:text-5xl font-bold ring-text mb-2"
                aria-live="polite"
                aria-atomic="true"
              >
                {inView && (
                  <CountUp
                    end={stat.value}
                    duration={2}
                    suffix={stat.suffix}
                    aria-label={`${stat.value}${stat.suffix} ${stat.label.toLowerCase()}`}
                  />
                )}
              </div>
              <div className="text-sm md:text-base text-gold-high-contrast font-medium mb-1">
                {stat.label}
              </div>
              <div 
                id={`stat-desc-${index}`}
                className="text-xs text-white/60 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200"
                aria-hidden="false"
              >
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection; 