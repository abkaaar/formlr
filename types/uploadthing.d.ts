declare module 'uploadthing' {
    export function uploadFiles(options: { 
        files: File[]; 
        endpoint: string; 
    }): Promise<{ url: string }[]>;
}