#!/usr/bin/env bash

set -e

cd $HOME
wget "https://docs.google.com/uc?id=0B3X9GlR6EmbnQ0FtZmJJUXEyRTA&export=download" -O gdrive
sudo chmod +x gdrive
access_token=$(curl -X POST -H "Content-Type: application/x-www-form-urlencoded" \
    -d "client_id=$CLIENT_ID&client_secret=$CLIENT_SECRET&grant_type=refresh_token&refresh_token=$REFRESH_TOKEN" \
     "https://www.googleapis.com/oauth2/v4/token" | \
    python -c "import sys, json; print json.load(sys.stdin)['access_token']")

if [[ "$UPLOAD_FOLDER" == */. ]]
then
    # only upload the content files inside
    for f in $UPLOAD_FOLDER
    do
        ./gdrive upload --access-token $access_token -r --parent $PARENT_FOLDER_ID ${f}
    done
else
    # create this folder, and upload its content files into drive
    ./gdrive upload --access-token $access_token -r --parent $PARENT_FOLDER_ID $UPLOAD_FOLDER
fi
