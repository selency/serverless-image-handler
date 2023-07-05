# BUILD
BUCKET_PREFIX=selency-sih-source
REGION=eu-west-1
BUCKET_NAME=$BUCKET_PREFIX-$REGION
SOLUTION_NAME=selency-sih
VERSION=1.0.2

./build-s3-dist.sh $BUCKET_PREFIX $SOLUTION_NAME $VERSION

aws s3 sync ./global-s3-assets s3://$BUCKET_NAME/$SOLUTION_NAME/$VERSION --acl bucket-owner-full-control
aws s3 sync ./regional-s3-assets s3://$BUCKET_NAME/$SOLUTION_NAME/$VERSION --acl bucket-owner-full-control

echo "Successfully created deployment assets for version $VERSION of solution $SOLUTION_NAME in bucket $BUCKET_NAME."
