export module ICloud {
  export type Derivative = {
    checksum: string;
    fileSize: number;
    width: number;
    height: number;
    url?: string;
  };

  export type Image = {
    batchGuid: string;
    derivatives: Record<string, Derivative>;
    contributorLastName: string;
    batchDateCreated: Date;
    dateCreated: Date;
    contributorFirstName: string;
    photoGuid: string;
    contributorFullName: string;
    caption: string;
    height: number;
    width: number;
  };

  export type Metadata = {
    photos: Record<string, ICloud.Image>;
    photoGuids: string[];
  };
}
