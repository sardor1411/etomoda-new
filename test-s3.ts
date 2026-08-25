import { S3Client, GetBucketAclCommand, GetBucketPolicyCommand, GetPublicAccessBlockCommand, GetBucketOwnershipControlsCommand, HeadObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: (process.env.AWS_S3_REGION || 'us-east-1').trim(),
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!.trim(),
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!.trim(),
  }
});

const bucketName = process.env.AWS_S3_BUCKET || 'etomoda';

async function testS3() {
  console.log('Testing S3 Configuration for bucket:', bucketName);
  
  try {
    const publicAccessBlock = await s3Client.send(new GetPublicAccessBlockCommand({ Bucket: bucketName }));
    console.log('Public Access Block:', JSON.stringify(publicAccessBlock.PublicAccessBlockConfiguration, null, 2));
  } catch (e: any) {
    console.log('Public Access Block Error:', e.message);
  }

  try {
    const ownership = await s3Client.send(new GetBucketOwnershipControlsCommand({ Bucket: bucketName }));
    console.log('Ownership Controls:', JSON.stringify(ownership.OwnershipControls, null, 2));
  } catch (e: any) {
    console.log('Ownership Controls Error:', e.message);
  }

  try {
    const policy = await s3Client.send(new GetBucketPolicyCommand({ Bucket: bucketName }));
    console.log('Bucket Policy:', policy.Policy);
  } catch (e: any) {
    console.log('Bucket Policy Error:', e.message);
  }

  try {
    const acl = await s3Client.send(new GetBucketAclCommand({ Bucket: bucketName }));
    console.log('Bucket ACL Grants:', JSON.stringify(acl.Grants, null, 2));
  } catch (e: any) {
    console.log('Bucket ACL Error:', e.message);
  }

  // Test an object
  const objectKey = 'documents/1782852283085-e7otumkiib6.jpg';
  console.log('\nTesting Object:', objectKey);
  try {
    const head = await s3Client.send(new HeadObjectCommand({ Bucket: bucketName, Key: objectKey }));
    console.log('Head Object Success:', JSON.stringify({
      ContentType: head.ContentType,
      ContentLength: head.ContentLength,
      ETag: head.ETag,
    }, null, 2));
  } catch (e: any) {
    console.log('Head Object Error:', e.message);
  }
  
  // Test direct HTTP GET
  const url = `https://${bucketName}.s3.${process.env.AWS_S3_REGION || 'us-east-1'}.amazonaws.com/${objectKey}`;
  console.log('\nTesting Direct GET URL:', url);
  try {
    const res = await fetch(url, { method: 'HEAD' });
    console.log('Direct GET HEAD status:', res.status);
    console.log('Headers:', Object.fromEntries(res.headers.entries()));
  } catch (e: any) {
    console.log('Direct GET error:', e.message);
  }
}

testS3();
