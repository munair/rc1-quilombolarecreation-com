#!/bin/bash
# script name : edit.bash
# script args : $1 -- file to be edited
#       $2 -- comments for git
#       $3 -- remove interactivity if parameter equals "noprompting"
#
# Make certain that you are only editing the development branch.
# Edit the file supplied as an argument to this script.
#
# The script ensures that edits are pushed to the development 
# branch at the origin before checking out staging to merge
# the edits previously made into staging. The script then pushes
# the merge into the staging branch back at the origin.
#
# After pushing the merge to staging at the origin we are ready to
# deploy to Heroku. Consequently the script lets git know about the
# staging Heroku app for the domain and identifies it as "staging-
# heroku". Then the push is made.
#
# Finally we check out the master branch, verify (--as always), and 
# merge the changes made to the staging branch. Of course this assumes
# that we actually bothered to checkout the staging site and viewed
# the new source code to verify changes and successful implementation.
# Then the changes are pushed to the master branch at the origin at
# GitHub, before identifying and then pushing the changes to the "live"
# or "production" instance ("production-heroku) at Heroku.
# 
git checkout development || git checkout -b development
git branch
echo "going to add the following files to the git repository: "
ls $1
git add --all $1
git commit -m "$2"
git remote remove origin
git remote add origin https://github.com/munair/www-quilombolarecreation-com.git
git push origin development
[ $3 == "noprompting" ] || while true; do
    read -p "shall we push changes to the staging GitHub repository and the staging instance on Heroku? " yn
    case $yn in
        [Yy]* ) echo "proceeding..."; break;;
        [Nn]* ) exit;;
        * ) echo "please answer yes or no.";;
    esac
done
git checkout 
git checkout staging || git checkout -b staging
git branch
git merge development
git push origin staging
cat ~/.netrc | grep heroku || heroku login && heroku keys:add ~/.ssh/id_rsa.pub
git remote remove heroku
git remote remove staging-heroku
heroku apps:destroy dev-quilombolarecreation-com --confirm dev-quilombolarecreation-com
heroku apps:create dev-quilombolarecreation-com
heroku domains:add dev.quilombolarecreation.com --app dev-quilombolarecreation-com
heroku git:remote -a dev-quilombolarecreation-com -r staging-heroku
git push staging-heroku staging:master
[ $3 == "noprompting" ] || while true; do
    read -p "shall we push changes to the master GitHub repository and the production instance on Heroku? " yn
    case $yn in
        [Yy]* ) echo "proceeding..."; break;;
        [Nn]* ) exit;;
        * ) echo "please answer yes or no.";;
    esac
done
git checkout master
git branch
git merge staging
git push origin master
git remote remove production-heroku
heroku apps:destroy www-quilombolarecreation-com --confirm www-quilombolarecreation-com
heroku apps:create www-quilombolarecreation-com
heroku domains:add www.quilombolarecreation.com --app www-quilombolarecreation-com
heroku addons:add postmark
heroku git:remote -a www-quilombolarecreation-com -r production-heroku
git push production-heroku master:master
git checkout development
