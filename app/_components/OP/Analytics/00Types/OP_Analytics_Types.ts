/*
op/analytics/page.tsx:
AnalyticsTabContent.tsx:
*/
export interface IPageState {
  activePageTab: "GodView" | "Brands";
  // ===== 01- Start God View =====
  fetchedYoutubeEngagementOverview: IGetYoutubeEngagementOverview | null;
  fetchedYoutubeFollowersOverview: IGetYoutubeFollowersOverview | null;
  fetchedBrandPlatformSubscribers: IBrandPlatformSubscribers | null;
  fetchedKPIData: IBrandTarget[];
  fetchedYoutubeData: BrandYoutubeAnalytics | null;
  isLoadingYoutubeData: boolean;
  // ===== 01- End God View =====
  // ===== 02- Start Brands =====
  activeAnalyticsTimeframe: "Daily" | "Weekly" | "Monthly" | "Yearly";
  loadingAnalytics: boolean;
  selectedSocialMediaAccount: ISocialMediaAccount | null;
  fetchedSocialMediaAccounts: ISocialMediaAccount[];
  loadingSocialMediaAccounts: boolean;
  fetchedYoutubeAnalytics: IGetYoutubeAnalytics | null;
  fetchedYoutubeSubscribers: IGetYoutubeSubscribers | null;
  fetchedTwitterAnalytics: IGetTwitterAnalytics | null;
  fetchedFacebookAnalytics: IGetFacebookAnalytics | null;
  fetchedNewsletterAnalytics: IGetNewsletterAnalytics | null;
  // ===== 02- End Brands =====
}
// =========================== 02- Start Brands ========================================
// =================================================================================
/*
op/analytics/get-all-accounts:
*/
export interface ISocialMediaAccount {
  _id: string;
  platform:
    | "LINKEDIN"
    | "TWITTER"
    | "FACEBOOK"
    | "YOUTUBE"
    | "TELEGRAM"
    | "REDDIT"
    | "NEWSLETTER";
  brand: {
    _id: string;
    brandName: string;
    acquisitionDate: number;
    niche: "politics" | "finance" | "entertainment";
  };
}
// =================================================================================
/*
op/analytics/get-youtube-analytics
*/
export interface OverallYouTubeStatistics {
  viewCount: string;
  subscriberCount: string;
  hiddenSubscriberCount: boolean;
  videoCount: string;
}

export interface DetailedYouTubeStats {
  date: string;
  start: string;
  end: string;
  likes: number;
  view: number;
  comments: number;
  engagementRate: string;
  followers: number;
}

export interface YouTubeAnalytics {
  overallStatistics: OverallYouTubeStatistics;
  detailedStatistics: DetailedYouTubeStats[];
}

export interface IGetYoutubeAnalytics {
  brand: string;
  youtubeAnalytics: YouTubeAnalytics;
}
// =================================================================================
/*
op/analytics/get-youtube-subscribers
*/
interface SubscriberMetric {
  date: string;
  start: string;
  end: string;
  subscribersGained: number;
  subscribersLost: number;
  totalSubscribers: number;
}

export type IGetYoutubeSubscribers = SubscriberMetric[];
// =================================================================================
/*
OP/analytics/get-twitter-analytics
*/
interface TwitterAnalytics {
  date: string;
  start: string;
  end: string;
  memberCount: number;
  tweetCount: number;
  likeCount: number;
  listedCount: number;
  mediaCount: number;
  replyCount: number;
  retweetCount: number;
  engagementRate: string;
}

export interface IGetTwitterAnalytics {
  brand: string;
  twitterAnalytics: TwitterAnalytics[];
}
// =================================================================================
/*
OP/analytics/get-facebook-analytics
*/
interface FacebookAnalytics {
  date: string;
  start: string;
  end: string;
  pageLikes: number;
  followers: number;
  likes: number; //posts likes
  shares: number;
  comments: number;
  engagementRate: string;
}

export interface IGetFacebookAnalytics {
  brand: string;
  FacebookAnalytics: FacebookAnalytics[];
}
// =================================================================================
/*
OP/analytics/get-news-analytics
*/
interface NewsLetterAnalytics {
  date: string;
  start: string;
  end: string;
  mailingCount: number;
  newsLetterCount: number;
  openingCount: number;
  clickCount: number;
  engagementRate: string;
}

export interface IGetNewsletterAnalytics {
  brand: string;
  newsLetterAnalytics: NewsLetterAnalytics[];
}
// =================================================================================
// =========================== 02- End Brands ========================================

// =========================== 01- Start God View ========================================
/*
op/kpisreport/daily-post
*/
interface IPlatform {
  target: number;
  current: number;
}

export interface IBrandTarget {
  brandId: string;
  brandName: string;
  youtube: IPlatform;
  facebook: IPlatform;
  twitter: IPlatform;
  newsletter: IPlatform;
}
// =================================================================================
/*
op/analytics/all-youtube-channels-analytics?startDate=${firstDayOfMonth}&endDate=${lastDayOfMonth}:
0- The date when the data was collected. (Format as YYYY-MM-DD)
1- The number of views (Views) for that day.
2- The number of likes (Likes) for that day.
3- The number of comments (Comments) for that day.
4- The average view duration (Average View Duration) in seconds.
5- The number of new subscribers gained (Subscribers Gained) on that day.
6- The estimated revenue (Estimated Revenue) in USD.
7- The estimated ad revenue (Estimated Ad Revenue) in USD.
*/
export interface BrandYoutubeAnalytics {
  brandsData: BrandYoutubeData[];
}

export interface BrandYoutubeData {
  brandId: string;
  brandName: string;
  data: {
    data: Array<
      [string, number, number, number, number, number, number, number]
    >;
  };
}
// =================================================================================
/*
op/analytics/get-youtube-revenues?brand=${selectedBrandId}&startDate=${firstDayOfMonth}&endDate=${lastDayOfMonth}
0- The date when the data was collected. (Format as YYYY-MM-DD)
1- The number of views (Views) for that day.
2- The number of likes (Likes) for that day.
3- The number of comments (Comments) for that day.
4- The average view duration (Average View Duration) in seconds.
5- The number of new subscribers gained (Subscribers Gained) on that day.
6- The estimated revenue (Estimated Revenue) in USD.
7- The estimated ad revenue (Estimated Ad Revenue) in USD.
*/
export type YoutubeDataRow = [
  string,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];
// =================================================================================
/*
op/analytics/youtube-engagement-overview?startDate=2024-12-26&endDate=2024-12-26:
*/
interface IYouTubeStats {
  date: string;
  start: string;
  end: string;
  engagementRate: string;
}

interface IBrandAnalytics {
  brandName: string;
  youtubeAnalytics: IYouTubeStats[];
}

export interface IGetYoutubeEngagementOverview {
  youtubeAnalytics: IBrandAnalytics[];
}
// =================================================================================
/*
op/analytics/brands-followers-today
- youtube-followers-overview
*/
interface Platform {
  twitter: number;
  youtube: number;
  facebook: number;
  newsLetter: number;
}

export interface BrandFollowers {
  brandName: string;
  platform: Platform;
}

export interface IBrandPlatformSubscribers {
  SocialFollowers: BrandFollowers[];
}
// =================================================================================
/*
youtube-followers-overview
*/
export interface IGetYoutubeFollowersOverview {
  brandName: string;
  dailyData: number;
}
// =================================================================================

// =========================== 01- End God View ========================================
