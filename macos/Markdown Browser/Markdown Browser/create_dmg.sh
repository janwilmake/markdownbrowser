#!/bin/bash

# Script to create a DMG file for distribution
APP_NAME="Markdown Browser"
DMG_NAME="MarkdownBrowser-1.0"

# Create a temporary directory
mkdir -p dmg-temp
cp -r "build/${APP_NAME}.app" dmg-temp/

# Create Applications symlink
ln -s /Applications dmg-temp/Applications

# Create the DMG
hdiutil create -volname "${APP_NAME}" -srcfolder dmg-temp -ov -format UDZO "${DMG_NAME}.dmg"

# Clean up
rm -rf dmg-temp

echo "DMG created: ${DMG_NAME}.dmg"