import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Twitter, Youtube, Heart, MessageCircle, Share2 } from 'lucide-react';

const SocialFeed: React.FC = () => {
  const socialPosts = [
    {
      id: 1,
      platform: 'Instagram',
      icon: Instagram,
      content: "Training day 247. Every punch, every drop of sweat brings me closer to greatness. 💪🥊 #BoxingLife #KumarPrescod",
      image: "/images/social-1.jpg",
      likes: 1247,
      comments: 89,
      shares: 23,
      timestamp: "2 hours ago",
      color: "from-pink-500 to-purple-600",
    },
    {
      id: 2,
      platform: 'Twitter',
      icon: Twitter,
      content: "Oakland raised, world bound. The journey continues. Big announcement coming soon! 👊 #OaklandBoxing #NextGen",
      image: "/images/social-2.jpg",
      likes: 892,
      comments: 156,
      shares: 67,
      timestamp: "5 hours ago",
      color: "from-blue-400 to-blue-600",
    },
    {
      id: 3,
      platform: 'YouTube',
      icon: Youtube,
      content: "New vlog: Behind the scenes of my latest fight preparation. See what it takes to stay undefeated! 🎥",
      image: "/images/social-3.jpg",
      likes: 2156,
      comments: 234,
      shares: 89,
      timestamp: "1 day ago",
      color: "from-red-500 to-red-700",
    },
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {socialPosts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="card overflow-hidden group cursor-pointer"
        >
          {/* Platform Header */}
          <div className={`p-4 bg-gradient-to-r ${post.color} text-white`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <post.icon className="w-5 h-5" />
                <span className="font-semibold">{post.platform}</span>
              </div>
              <span className="text-sm opacity-80">{post.timestamp}</span>
            </div>
          </div>

          {/* Post Image */}
          <div className="relative h-48 bg-gradient-to-br from-primary-600 to-gold-500">
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-2xl mb-2">📸</div>
                <div className="text-sm opacity-80">Social Media Content</div>
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="p-4">
            <p className="text-secondary-700 mb-4 line-clamp-3">
              {post.content}
            </p>

            {/* Engagement Stats */}
            <div className="flex items-center justify-between text-sm text-secondary-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.comments}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Share2 className="w-4 h-4" />
                  <span>{post.shares}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SocialFeed; 