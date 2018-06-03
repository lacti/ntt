#!/bin/bash

cd dist

rm -f *.zip

\ls | \
  xargs -n1 echo | \
  awk '{print "zip -r " $1 ".zip " $1 "/"}' | \
  tr '\n' '\0' | \
  xargs -0 -n1 /bin/bash -c

find . -name "*.zip" -exec \
  aws s3 cp \
    {} \
    s3://lacti.github.files/ntt/ \
    --acl public-read \;

cd ..

