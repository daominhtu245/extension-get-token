#!/bin/bash
yarn prod
cd dist && zip -r cookie-token-final-1.0.0.zip . && cd ..
mv dist/cookie-token-final-1.0.0.zip ./
