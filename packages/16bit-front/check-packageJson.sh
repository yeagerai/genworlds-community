#!/bin/sh
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm

echo "**** [staging] Received update"
PACKAGE_CHANGES=`git diff HEAD@{1} --stat -- package.json | wc -l`
echo "$PACKAGE_CHANGES changes to package.json"

if [ $PACKAGE_CHANGES -gt 0 ] ; then
        echo "**** [staging] package.json has been updated. Reinstalling.."
        yarn install
        echo "**** [staging] Dependencies have been updated."
fi
