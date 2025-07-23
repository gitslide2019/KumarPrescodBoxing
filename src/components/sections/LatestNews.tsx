import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

const LatestNews: React.FC = () => {
  const news = [
    {
      id: 1,
      title: "Kumar Prescod Dominates in Latest Victory",
      excerpt: "The 18-year-old boxing prodigy continues his undefeated streak with a stunning TKO victory in the 6th round.",
      date: "November 20, 2024",
      category: "Fight Results",
      readTime: "3 min read",
      image: "/images/news-1.jpg",
    },
    {
      id: 2,
      title: "Training Camp: Behind the Scenes with Kumar",
      excerpt: "Exclusive look at Kumar's intense training regimen as he prepares for his upcoming championship fight.",
      date: "November 15, 2024",
      category: "Training",
      readTime: "5 min read",
      image: "/images/news-2.jpg",
    },
    {
      id: 3,
      title: "Kumar Prescod Named 'Rising Star of the Year'",
      excerpt: "The boxing community recognizes Kumar's exceptional talent and dedication to the sport.",
      date: "November 10, 2024",
      category: "Awards",
      readTime: "2 min read",
      image: "/images/news-3.jpg",
    },
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {news.map((article, index) => (
        <motion.article
          key={article.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="card overflow-hidden group cursor-pointer"
        >
          {/* Article Image */}
          <div className="relative h-48 bg-gradient-to-br from-primary-600 to-gold-500 overflow-hidden">
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full">
                {article.category}
              </span>
            </div>
          </div>

          {/* Article Content */}
          <div className="p-6">
            <div className="flex items-center text-sm text-secondary-500 mb-3">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{article.date}</span>
              <span className="mx-2">•</span>
              <Clock className="w-4 h-4 mr-1" />
              <span>{article.readTime}</span>
            </div>

            <h3 className="text-xl font-bold text-secondary-900 mb-3 group-hover:text-primary-600 transition-colors duration-200">
              {article.title}
            </h3>

            <p className="text-secondary-600 mb-4 line-clamp-3">
              {article.excerpt}
            </p>

            <button className="flex items-center text-primary-600 hover:text-primary-700 font-semibold group-hover:translate-x-1 transition-transform duration-200">
              Read More
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </motion.article>
      ))}
    </div>
  );
};

export default LatestNews; 