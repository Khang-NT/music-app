#!/usr/bin/env bash

set -e

project_name="music-app"

cd $HOME;
git config --global user.email "khang.neon.1997@gmail.com";
git config --global user.name "TravisCI - Khang NT";

curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | sudo bash
sudo apt-get install git-lfs

git lfs clone -b gh-pages --single-branch https://$GH_USER:$GH_PASS@github.com/Khang-NT/build-artifacts.git gh-pages > /dev/null;
cd gh-pages;

git lfs install

mkdir -p $project_name/builds/$TRAVIS_BUILD_NUMBER;

cp -a $TRAVIS_BUILD_DIR/mobile/build/outputs/. $project_name/builds/$TRAVIS_BUILD_NUMBER/

find $project_name/builds/$TRAVIS_BUILD_NUMBER -size +40M -print0 | while read -d $'\0' file
do
   git lfs track "$file"
done

cd $project_name;

python $TRAVIS_BUILD_DIR/build_directory_index.py . "https://github.com/Khang-NT/build-artifacts/raw/gh-pages/$project_name/";

cd ..; git add --all .;
git commit -m "Travis build $project_name/$TRAVIS_BUILD_NUMBER pushed to gh-pages";
git push -fq origin gh-pages;