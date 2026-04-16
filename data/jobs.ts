export type StaticJob = {
  slug: string;
  title: string;
  district: string;
  location: string;
  county?: string;
  type?: string;
  posted?: string;
  applyUrl: string;
  overview?: string;
  responsibilities?: string[];
  requirements?: string[];
};

export const jobs: StaticJob[] = [];