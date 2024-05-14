# puppeteer-pn95

Project N95 is a mask website that is shutting down. I wrote this scraping code to help assist [patrickthebiosteamist](https://www.tiktok.com/@patrickthebiosteamist) on collecting information from the site. 

[Patrick's processed files](https://positive-gauge-216.notion.site/Selecting-a-Mask-for-the-Pandemic-c558299b5d6e47eeab8cf40c216e0f57)

[Cakelin's Notion Database of Output CSV](https://www.notion.so/thecakelin/Project-N95-Web-Scraping-bd7db19e478e42d1a7e3ba9b75e28be1)

[Cakelin Tiktok - Walkthrough](https://www.tiktok.com/@thecakelin/video/7314944737042042154)

[Cakelin Tiktok - Watch the Code Run!](https://www.tiktok.com/@thecakelin/video/7314950872419683630)

This README is written for those who have little to no experience coding. I will not be maintaining or updating these files, it's just an example of scraping data for archival purposes

## Files
* pn95.js: A simple scraping script that gets masks from the Project N95 website, a nonprofit that is shutting down soon.
* [package.json](https://docs.npmjs.com/cli/v10/configuring-npm/package-json): defines what packages and versions are used
* pn95_masks.csv: CSV output file

## Steps to Run
These are commands for a [command line](https://www.freecodecamp.org/news/command-line-for-beginners/) terminal on a Mac, sometimes they are slightly different in Windows

You need to be in the same location in your computer as the files to run them.

Install node version manager:

```
brew install nvm
```

Install latest node version:

```
nvm install --lts
```

You can use npm or yarn to install [puppeteer](https://www.npmjs.com/package/puppeteer) (which is a node package)

Print to output in terminal:

```
node pn95.js
```

Print to file:

```
node pn95.js > pn95_masks.csv
```

