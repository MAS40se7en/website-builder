import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const authenticateUser = async () => {
        const { userId } = await auth();

        console.log(userId);

        if (!userId) {
            throw new Error('Unauthorized')
        }

        return {userId};
}

export const ourFileRouter = {
    subaccountLogo: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } }).middleware(authenticateUser).onUploadComplete(async ({ metadata, file }) => {
        // This code RUNS ON YOUR SERVER after upload
        console.log("Upload complete for userId:", metadata.userId);
        console.log("file url", file.ufsUrl);
        // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
        return { uploadedBy: metadata.userId, fileUrl: file.ufsUrl };
    }),
    avatar: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } }).middleware(authenticateUser).onUploadComplete(async ({ metadata, file }) => {
        // This code RUNS ON YOUR SERVER after upload
        console.log("Upload complete for userId:", metadata.userId);
        console.log("file url", file.ufsUrl);
        // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
        return { uploadedBy: metadata.userId, fileUrl: file.ufsUrl };
    }),
    agencyLogo: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } }).middleware(authenticateUser).onUploadComplete(async ({ metadata, file }) => {
        // This code RUNS ON YOUR SERVER after upload
        console.log("Upload complete for userId:", metadata.userId);
        console.log("file url", file.ufsUrl);
        // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
        return { uploadedBy: metadata.userId, fileUrl: file.ufsUrl };
    }),
    media: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } }).middleware(authenticateUser).onUploadComplete(async ({ metadata, file }) => {
        // This code RUNS ON YOUR SERVER after upload
        console.log("Upload complete for userId:", metadata.userId);
        console.log("file url", file.ufsUrl);
        // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
        return { uploadedBy: metadata.userId, fileUrl: file.ufsUrl };
    })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;