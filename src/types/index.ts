export type SiteConfig = {
  name: string;
  title: string;
  description: string;
  origin: string;
  og: string;
  keywords: string[];
  creator: {
    name: string;
    url: string;
  };
  socials: {
    github: string;
    x: string;
  };
  contributors: {
    name: string;
    url: string;
    github: string;
    x: string;
  }[]
};
