# News Content

This folder contains news articles, press releases, and media content.

## Content Structure

Each news item should be a markdown file with frontmatter:

```markdown
---
title: "Article Title"
date: "2024-01-15"
category: "fight-news" | "training" | "media" | "community"
author: "Author Name"
featured: true | false
image: "/images/news/article-image.jpg"
excerpt: "Brief description of the article"
tags: ["boxing", "training", "Oakland"]
---

# Article Content

Article body content in markdown format...
```

## Categories
- **fight-news**: Upcoming fights, results, announcements
- **training**: Training updates, gym progress, technique
- **media**: Interviews, appearances, press coverage
- **community**: Community involvement, charity, local events

## File Naming
- Format: `YYYY-MM-DD-article-slug.md`
- Example: `2024-01-15-kumar-wins-championship-bout.md`

## Usage
- Latest News section on homepage
- Dedicated news/blog page
- RSS feed generation
- Social media content