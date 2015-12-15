#~/bin/sh

#script to update the logging roads prod website

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
