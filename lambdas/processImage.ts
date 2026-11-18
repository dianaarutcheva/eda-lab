import type { SQSHandler } from "aws-lambda";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client();

export const handler: SQSHandler = async (event) => {
  console.log("Event ", JSON.stringify(event));

  for (const record of event.Records) {
    const recordBody = JSON.parse(record.body);
    if (!recordBody.Records) continue;

    console.log("Record body ", JSON.stringify(recordBody));

    for (const messageRecord of recordBody.Records) {
      const { bucket, object } = messageRecord.s3;
      const key = decodeURIComponent(object.key.replace(/\+/g, " "));

      try {
        await s3.send(new GetObjectCommand({ Bucket: bucket.name, Key: key }));
      } catch (error) {
        console.log(error);
      }
    }
  }
};