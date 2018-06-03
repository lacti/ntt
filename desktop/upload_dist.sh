#!/bin/bash

cd dist

rm -f *.zip

\ls | \
  xargs -n1 echo | \
  awk '{print "zip -r " $1 ".zip " $1 "/"}' | \
  tr '\n' '\0' | \
  xargs -0 -n1 /bin/bash -c

find . -name "*.zip" -exec \
  docker run -it \
    -e "AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}" \
    -e "AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}" \
    -e "AWS_DEFAULT_REGION=ap-northeast-2" \
    -v "$(pwd):/project" \
    mesosphere/aws-cli \
    s3 cp \
    {} \
    s3://lacti.github.files/ntt/ \
    --acl public-read \;

cd ..

