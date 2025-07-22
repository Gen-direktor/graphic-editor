#!/bin/bash
echo "### System Checks ###"
glxinfo | grep -i 'opengl renderer'
node -p "process.versions"
npm list --depth=0
