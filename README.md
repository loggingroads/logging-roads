# Logging Roads

http://loggingroads.org

Logging roads are a major indicator of deforestation in the Congo Basin . Until now, their reach has been difficult to visualize, obscuring the rapid rise in deforestation in the region. Often, these roads are discovered only after they have been abandoned.

The Logging Roads project is a joint initiative of Global Forest Watch and Moabi to monitor the spread of logging roads across the Congo Basin.

Together, we are analyzing over a decade of imagery to track rainforest logging road activity.

## Contributing

We need people to help tag roads! Go to loggingroads.org and click "Start Contributing"

Feel free to submit any bugs/issues/questions to the issue tracker on this repo. or contact us at info@loggingroads.org

## Project Components

In addition to this front-end website, Logging Roads uses several backend components, many forked from OpenStreetMap Tools

### Logging Roads Tasking Manager

http://tasks.loggingroads.org/

https://github.com/crowdcover/osm-tasking-manager2

Forked from OSM HOT Tasking Manager (https://github.com/hotosm/osm-tasking-manager2)

A custom installation of tasking manager configured to list only logging roads tasks and point to the Logging Roads iD.

### LoggingRoads iD

http://id.loggingroads.org/ (usually accessed via Tasking Manager)

https://github.com/loggingroads/iD

Forked from OSM iD (https://github.com/openstreetmap/iD)

Modified to include only logging roads presets, and include Landsat satellite layers in the menu.

### Logging Roads Crowd Source Tool (to-fix)

http://fix.loggingroads.org

Forked from Mapbox's to-fix tool (https://github.com/osmlab/to-fix)

Modified to allow users to select a year based on satellite imagery and save the selection as a tag in OSM.

* to-fix (https://github.com/crowdcover/to-fix)
* to-fix-backend (https://github.com/crowdcover/to-fix-backend)


### Logging Roads website

* Map (https://github.com/crowdcover/logging-roads-animation-map) - Mapbox-gl map visualization of logging roads over time http://map.loggingroads.org (also on homepage at loggingroads.org)
* Tessera () - Vector tile server
* LoggingRoads DataMunge (https://github.com/crowdcover/logging-roads-datamunge) - Extracts data from OSM nightly, used to update vector tiles and data downloads
* OSM Meta Util (https://github.com/crowdcover/osm-meta-util) - Used for the leaderboard. Counts changes on OSM changes tagged with project hash tags.
* LoggingRoads Backend (https://github.com/crowdcover/logging-roads-backend) - Simple web service to access stats calculated by DataMunge and OSM Meta Util

## Development
To run locally, make sure you have [bundler](http://bundler.io/) installed and run the following command from within the project directory:

`bundle exec jekyll serve -w --baseurl ''`

## Deployment

Deployment of the website code requires Ruby and Jekyll to build, or you can build externally and only copy up the static files from Jekyll.


### Updating production loggingroads.org

```
#get latest code from Github
git fetch --all
git pull

#use specific version of ruby for jekyll build for consistency between environments
rvm use 2.2.1
#rebuild site
jekyll build
#re-link the downloads folder
cd _site
ln -s ~/logging-roads-datamunge/output/ downloads
```
also in update.prod.sh

## License

MIT, see LICENSE.txt and https://tldrlegal.com/license/mit-license

Individual components of the project (listed above) may have different licenses.
