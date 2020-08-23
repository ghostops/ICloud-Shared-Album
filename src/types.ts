export module ICloud {
    export interface Image {
        batchGuid: string;
        derivatives: any;
        contributorLastName: string;
        batchDateCreated: Date;
        dateCreated: Date;
        contributorFirstName: string;
        photoGuid: string;
        contributorFullName: string;
        width: string;
        caption: string;
        height: string;
    }

    export interface UrlDerivative {
        url: string;
        bestDerivative: any;
    }

    export type ImageWithUrl = Image & UrlDerivative;

    export interface Metadata {
        photos: Record<string, ICloud.Image>;
        photoGuids: string[];
    }
}

