# Fight Information Directory Structure

This directory contains all fight-related materials including PDFs, posters, and ticket information.

## Directory Structure

```
fights/
├── README.md                    # This file
├── pdfs/                       # Fight cards, press releases, contracts
│   └── [date]-[location]/      # Specific fight PDFs
├── posters/                    # Fight promotional posters
│   └── [date]-[location]/      # Specific fight posters
├── tickets/                    # Ticket information and links
│   └── [date]-[location].json  # Ticket data for each fight
└── [date]-[location]/          # Fight-specific folders
    ├── info.json              # Fight details (opponent, venue, etc.)
    ├── press-release.pdf      # Official press release
    ├── fight-card.pdf         # Complete fight card
    └── poster.jpg             # Main promotional poster
```

## File Naming Convention

- Date format: YYYY-MM-DD (e.g., 2025-08-16)
- Location: lowercase with hyphens (e.g., oakland, las-vegas)
- Example: `2025-08-16-oakland/`

## Fight Information JSON Format

```json
{
  "date": "2025-08-16",
  "location": "Oakland, CA",
  "venue": "Oakland Arena",
  "opponent": "TBA",
  "title": "Homecoming Fight",
  "ticketUrl": "https://example.com/tickets",
  "pdfFiles": {
    "fightCard": "/fights/pdfs/2025-08-16-oakland/fight-card.pdf",
    "pressRelease": "/fights/pdfs/2025-08-16-oakland/press-release.pdf"
  },
  "posterUrl": "/fights/posters/2025-08-16-oakland/main-poster.jpg",
  "description": "Kumar returns to his hometown Oakland for a special homecoming fight."
}
```

## Adding New Fight Information

1. Create a new directory with the date-location format
2. Add the info.json file with fight details
3. Upload PDFs to the appropriate subdirectories
4. Update the ticket information in tickets/ directory
5. Add promotional materials to posters/ directory

## Current Fights

### August 16, 2025 - Oakland, CA
- **Status**: Upcoming
- **Venue**: TBA
- **Opponent**: TBA
- **Title**: Homecoming Fight
- **Special**: Kumar's return to his hometown