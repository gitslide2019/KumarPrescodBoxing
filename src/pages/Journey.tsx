import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Camera, Filter, Grid, List, Search, Tag } from 'lucide-react';
import { useAnalytics } from '../contexts/AnalyticsContext';
import PhotoGallery from '../components/common/PhotoGallery';
import { allPhotos, getPhotosByCategory, PhotoMetadata } from '../utils/imageUtils';

const Journey: React.FC = () => {
  const { trackEvent } = useAnalytics();
  const [filteredPhotos, setFilteredPhotos] = useState<PhotoMetadata[]>(allPhotos);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    trackEvent('Page', 'View', 'Journey');
  }, [trackEvent]);

  // Get unique categories and tags
  const categories = ['all', ...Array.from(new Set(allPhotos.map(photo => photo.category)))];
  const allTags = allPhotos.flatMap(photo => photo.tags);
  const uniqueTags = ['all', ...Array.from(new Set(allTags))];

  // Filter photos based on selected filters
  useEffect(() => {
    let filtered = [...allPhotos];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = getPhotosByCategory(selectedCategory);
    }

    // Filter by tag
    if (selectedTag !== 'all') {
      filtered = filtered.filter(photo => photo.tags.includes(selectedTag));
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(photo => 
        photo.title.toLowerCase().includes(searchLower) ||
        photo.description.toLowerCase().includes(searchLower) ||
        photo.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    setFilteredPhotos(filtered);
  }, [selectedCategory, selectedTag, searchTerm]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    trackEvent('Journey', 'Filter Category', category);
  };

  const handleTagChange = (tag: string) => {
    setSelectedTag(tag);
    trackEvent('Journey', 'Filter Tag', tag);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term) {
      trackEvent('Journey', 'Search', term);
    }
  };

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'training': return 'Training';
      case 'portrait': return 'Portraits';
      case 'fight': return 'Fights';
      case 'community': return 'Community';
      case 'exclusive': return 'Exclusive';
      default: return 'All Photos';
    }
  };

  return (
    <>
      <Helmet>
        <title>Journey Gallery - Kumar Prescod Boxing</title>
        <meta name="description" content="Explore Kumar Prescod's boxing journey through exclusive photos and training footage." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Header */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
          <div className="container-max text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-center mb-4">
                <Camera className="w-8 h-8 mr-3" />
                <span className="text-lg font-semibold">Photo Gallery</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                Kumar's <span className="text-gold-high-contrast">Journey</span>
              </h1>
              <p className="text-xl opacity-90 max-w-3xl mx-auto">
                Follow Kumar's path from Oakland streets to championship glory through exclusive training photos, 
                behind-the-scenes moments, and professional portraits.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="container-max py-12">
          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-md p-6 mb-8"
          >
            <div className="grid md:grid-cols-4 gap-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search photos..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {getCategoryDisplayName(category)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tag Filter */}
              <div>
                <select
                  value={selectedTag}
                  onChange={(e) => handleTagChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Tags</option>
                  {uniqueTags.slice(1).map(tag => (
                    <option key={tag} value={tag}>
                      #{tag}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Mode */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Active Filters */}
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                  <Filter className="w-4 h-4 mr-1" />
                  {getCategoryDisplayName(selectedCategory)}
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className="ml-2 text-primary-500 hover:text-primary-700"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedTag !== 'all' && (
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  <Tag className="w-4 h-4 mr-1" />
                  #{selectedTag}
                  <button
                    onClick={() => handleTagChange('all')}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    ×
                  </button>
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  <Search className="w-4 h-4 mr-1" />
                  "{searchTerm}"
                  <button
                    onClick={() => handleSearch('')}
                    className="ml-2 text-green-500 hover:text-green-700"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </motion.div>

          {/* Results Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <p className="text-gray-600">
              Showing <span className="font-semibold">{filteredPhotos.length}</span> of{' '}
              <span className="font-semibold">{allPhotos.length}</span> photos
            </p>
          </motion.div>

          {/* Photo Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {filteredPhotos.length > 0 ? (
              <PhotoGallery 
                photos={filteredPhotos} 
                columns={viewMode === 'grid' ? 3 : 2}
                showMetadata={true}
                enableLightbox={true}
                enableSharing={true}
                enableDownload={false}
              />
            ) : (
              <div className="text-center py-12">
                <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No photos found</h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria to find more photos.
                </p>
              </div>
            )}
          </motion.div>

          {/* Photo Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 bg-white rounded-xl shadow-md p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Gallery Statistics</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {allPhotos.length}
                </div>
                <div className="text-gray-600">Total Photos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {allPhotos.filter(p => p.category === 'training').length}
                </div>
                <div className="text-gray-600">Training Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {allPhotos.filter(p => p.featured).length}
                </div>
                <div className="text-gray-600">Featured Photos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {uniqueTags.length - 1}
                </div>
                <div className="text-gray-600">Photo Tags</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Journey; 