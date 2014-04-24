LeaderboardCI
=============

Leader board for teamcity based on Siren of shame.

When a build succeeds you get 1 point when a build fails you lose 4 points.

Streak: when you've 5 successful builds in a row you gain 4 extra points.

Installation
============

You'll need a redis database.
Edit the config.json in the config folder so it matches your configuration
run node server.js