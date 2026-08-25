import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: (process.env.AWS_S3_REGION || 'us-east-1').trim(),
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!.trim(),
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!.trim(),
  },
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});

const bucketName = process.env.AWS_S3_BUCKET || 'etomoda';

async function testUpload() {
  const objectKey = `documents/test-agent-${Date.now()}.txt`;
  
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
    ContentType: 'text/plain',
  });
  
  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  console.log('Signed URL:', signedUrl);
  
  try {
    const res = await fetch(signedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: 'Hello World from test agent'
    });
    console.log('PUT status:', res.status);
    console.log('PUT headers:', Object.fromEntries(res.headers.entries()));
    const text = await res.text();
    console.log('PUT response body:', text);
  } catch (err: any) {
    console.log('PUT error:', err.message);
  }
}

testUpload();
