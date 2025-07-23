# Fight Data

This folder contains structured data for Kumar's fights - both past results and upcoming events.

## File Structure

### Past Fights: `results/YYYY-MM-DD-opponent.json`
```json
{
  "id": "fight-001",
  "date": "2024-01-15",
  "opponent": {
    "name": "John Smith",
    "record": "12-3-1",
    "weightClass": "Welterweight"
  },
  "result": "WIN",
  "method": "KO",
  "round": 3,
  "time": "2:45",
  "venue": {
    "name": "Oakland Arena",
    "city": "Oakland",
    "state": "CA"
  },
  "weightClass": "Welterweight",
  "title": null,
  "images": ["/images/fights/2024-01-15-smith/fight-poster.jpg"],
  "videoHighlights": "https://youtube.com/watch?v=...",
  "notes": "Dominant performance with early knockout"
}
```

### Upcoming Fights: `upcoming/YYYY-MM-DD-opponent.json`
```json
{
  "id": "upcoming-001",
  "date": "2024-06-15",
  "opponent": {
    "name": "Mike Johnson",
    "record": "15-2-0",
    "weightClass": "Welterweight"
  },
  "venue": {
    "name": "MGM Grand",
    "city": "Las Vegas",
    "state": "NV"
  },
  "weightClass": "Welterweight",
  "title": "WBC Regional Title",
  "ticketUrl": "https://ticketmaster.com/...",
  "fightCard": "Main Event",
  "broadcastInfo": {
    "network": "ESPN",
    "time": "9:00 PM ET"
  },
  "images": ["/images/fights/2024-06-15-johnson/fight-poster.jpg"]
}
```

## Usage
- Fight history display
- Upcoming fights section
- Statistics calculation
- SEO-friendly fight pages