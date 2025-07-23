/**
 * Component Showcase - Demonstration of all boxing website components
 * This file shows how to use each component with the Kumar Prescod data
 */

import React, { useState } from 'react';
import {
  FighterCard,
  FightRecord,
  TrainingGrid,
  NewsArticle,
  StatsWidget
} from '../index';

// Import data
import { kumarProfile } from '../../data/kumar-profile';
import { professionalFights } from '../../data/fight-records';
import { recentTrainingSessions } from '../../data/training-sessions';
import { newsArticles } from '../../data/news-articles';

const ComponentShowcase: React.FC = () => {
  const [selectedFight, setSelectedFight] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  // Example stats for StatsWidget
  const performanceStats = [
    {
      label: 'Power Rating',
      value: 95,
      icon: '💥',
      color: 'red' as const,
      format: 'number' as const,
      change: 5,
      changeLabel: 'since last fight',
      showTrend: true
    },
    {
      label: 'Speed Rating',
      value: 88,
      icon: '⚡',
      color: 'yellow' as const,
      format: 'number' as const,
      change: 3,
      changeLabel: 'this month',
      showTrend: true
    },
    {
      label: 'Accuracy',
      value: 71,
      icon: '🎯',
      color: 'blue' as const,
      format: 'percentage' as const,
      change: -2,
      changeLabel: 'vs average',
      showTrend: true
    },
    {
      label: 'Cardio Level',
      value: 92,
      icon: '🫀',
      color: 'green' as const,
      format: 'number' as const,
      change: 8,
      changeLabel: 'improvement',
      showTrend: true
    }
  ];

  const trainingStats = [
    {
      label: 'Weekly Hours',
      value: 18,
      icon: '⏰',
      color: 'blue' as const,
      format: 'number' as const
    },
    {
      label: 'Sessions',
      value: 6,
      icon: '📅',
      color: 'green' as const,
      format: 'number' as const
    },
    {
      label: 'Intensity Avg',
      value: 85,
      icon: '🔥',
      color: 'red' as const,
      format: 'percentage' as const
    }
  ];

  // Create fighter object from kumar profile
  const kumarFighter = {
    id: 'kumar-prescod',
    name: kumarProfile.personal.fullName,
    nickname: kumarProfile.personal.nickname,
    age: kumarProfile.personal.age,
    height: kumarProfile.personal.height,
    weight: kumarProfile.personal.weight,
    reach: kumarProfile.personal.reach,
    stance: kumarProfile.personal.stance,
    hometown: `${kumarProfile.personal.birthPlace}`,
    record: kumarProfile.record,
    weightClass: 'Light Heavyweight' as const,
    profileImage: '/images/kumar/profile-main.jpg',
    achievements: kumarProfile.careerHighlights.map(highlight => ({
      id: highlight.achievement.toLowerCase().replace(/\s+/g, '-'),
      title: highlight.achievement,
      date: highlight.date,
      description: highlight.description,
      type: 'Milestone' as const
    })),
    social: kumarProfile.socialMedia
  };

  const handleFightClick = (fight: any) => {
    console.log('Fight clicked:', fight.id);
    setSelectedFight(fight.id);
  };

  const handleSessionClick = (session: any) => {
    console.log('Training session clicked:', session.id);
    setSelectedSession(session.id);
  };

  const handleTagClick = (tag: string) => {
    console.log('Tag clicked:', tag);
  };

  const handleArticleClick = (article: any) => {
    console.log('Article clicked:', article.slug);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 space-y-16">
        
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
            Kumar Prescod Boxing Components
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A showcase of production-ready React components built for boxing websites
            with modern design, accessibility, and performance optimizations.
          </p>
        </div>

        {/* Fighter Card Component */}
        <section className="space-y-6">
          <div className="border-l-4 border-red-600 pl-4">
            <h2 className="text-3xl font-bold mb-2">FighterCard Component</h2>
            <p className="text-gray-400">
              Display fighter profiles with comprehensive stats and biographical information
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-lg font-bold mb-4">Small Size</h3>
              <FighterCard
                fighter={kumarFighter}
                size="small"
                showRecord={true}
                showAchievements={false}
                onClick={() => console.log('Small fighter card clicked')}
              />
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-bold mb-4">Medium Size (Default)</h3>
              <FighterCard
                fighter={kumarFighter}
                size="medium"
                showRecord={true}
                showAchievements={true}
                onClick={() => console.log('Medium fighter card clicked')}
              />
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-bold mb-4">Large Size</h3>
              <FighterCard
                fighter={kumarFighter}
                size="large"
                showRecord={true}
                showAchievements={true}
                onClick={() => console.log('Large fighter card clicked')}
              />
            </div>
          </div>
        </section>

        {/* Stats Widget Component */}
        <section className="space-y-6">
          <div className="border-l-4 border-blue-600 pl-4">
            <h2 className="text-3xl font-bold mb-2">StatsWidget Component</h2>
            <p className="text-gray-400">
              Animated performance metrics with visual indicators and trend analysis
            </p>
          </div>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Performance Stats (Grid Layout)</h3>
              <StatsWidget
                title="Performance Metrics"
                stats={performanceStats}
                record={kumarProfile.record}
                layout="grid"
                size="medium"
                animated={true}
                variant="performance"
              />
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Training Stats (Horizontal Layout)</h3>
              <StatsWidget
                title="Training Statistics"
                stats={trainingStats}
                layout="horizontal"
                size="small"
                animated={true}
                variant="training"
                showComparison={false}
              />
            </div>
          </div>
        </section>

        {/* Fight Record Component */}
        <section className="space-y-6">
          <div className="border-l-4 border-green-600 pl-4">
            <h2 className="text-3xl font-bold mb-2">FightRecord Component</h2>
            <p className="text-gray-400">
              Comprehensive fight history with opponent details and results visualization
            </p>
          </div>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Timeline Layout</h3>
              <FightRecord
                fights={professionalFights.slice(0, 2)} // Show first 2 fights
                title="Recent Professional Fights"
                showOpponentDetails={true}
                showVenue={true}
                layout="timeline"
                onFightClick={handleFightClick}
              />
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">List Layout</h3>
              <FightRecord
                fights={professionalFights}
                title="Complete Fight Record"
                showOpponentDetails={true}
                showVenue={true}
                layout="list"
                onFightClick={handleFightClick}
              />
            </div>
          </div>
        </section>

        {/* Training Grid Component */}
        <section className="space-y-6">
          <div className="border-l-4 border-yellow-600 pl-4">
            <h2 className="text-3xl font-bold mb-2">TrainingGrid Component</h2>
            <p className="text-gray-400">
              Interactive training session display with filtering and media integration
            </p>
          </div>
          
          <TrainingGrid
            sessions={recentTrainingSessions}
            title="Recent Training Sessions"
            period="month"
            showFilters={true}
            onSessionClick={handleSessionClick}
          />
        </section>

        {/* News Article Component */}
        <section className="space-y-6">
          <div className="border-l-4 border-purple-600 pl-4">
            <h2 className="text-3xl font-bold mb-2">NewsArticle Component</h2>
            <p className="text-gray-400">
              Rich blog post component with markdown support and boxing-themed styling
            </p>
          </div>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Card Layout</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsArticles.slice(0, 3).map(article => (
                  <NewsArticle
                    key={article.id}
                    article={article}
                    variant="card"
                    showAuthor={true}
                    showTags={true}
                    showReadTime={true}
                    onTagClick={handleTagClick}
                    onArticleClick={handleArticleClick}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Preview Layout</h3>
              <NewsArticle
                article={newsArticles[0]}
                variant="preview"
                showAuthor={true}
                showTags={true}
                showReadTime={true}
                onTagClick={handleTagClick}
                onArticleClick={handleArticleClick}
                className="max-w-4xl mx-auto"
              />
            </div>
          </div>
        </section>

        {/* Usage Information */}
        <section className="bg-gray-900/50 rounded-lg p-8 border border-gray-700">
          <h2 className="text-2xl font-bold mb-4">Component Integration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-2 text-green-400">Features</h3>
              <ul className="space-y-2 text-gray-300">
                <li>✅ Fully responsive design</li>
                <li>✅ WCAG accessibility compliant</li>
                <li>✅ TypeScript with comprehensive types</li>
                <li>✅ Modern React patterns (hooks, functional components)</li>
                <li>✅ Performance optimized (lazy loading, memoization)</li>
                <li>✅ Boxing-themed styling with red/black color scheme</li>
                <li>✅ Integration with existing data structures</li>
                <li>✅ Error handling and loading states</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-2 text-blue-400">Technical Details</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Built with React 18+ and TypeScript</li>
                <li>• Styled with Tailwind CSS</li>
                <li>• Optimized images with WebP support</li>
                <li>• Smooth animations and transitions</li>
                <li>• Mobile-first responsive approach</li>
                <li>• SEO-friendly markup structure</li>
                <li>• Comprehensive error boundaries</li>
                <li>• Easy customization via props</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-400">
              <strong>Note:</strong> All components are production-ready and integrate seamlessly with the existing
              Kumar Prescod Boxing website data structures. They follow modern accessibility standards and 
              performance best practices for optimal mobile boxing fan experience.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default ComponentShowcase;