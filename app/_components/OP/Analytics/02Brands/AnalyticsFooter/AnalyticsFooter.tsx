"use client";
import React, { memo } from "react";
import styles from "@/app/(authPaths)/op/analytics/analytics.module.css";
import { formatNumbers } from "@/app/_utils/formatNumbers";
import AnalyticsFooterNotFound from "./AnalyticsFooterNotFound";
import { IPageState } from "../../00Types/OP_Analytics_Types";
import AreaChart2 from "../../00Charts/AreaChart2";

function AnalyticsFooter({ pageState }: { pageState: IPageState }) {
  if (pageState.selectedSocialMediaAccount?.platform === "YOUTUBE") {
    return (
      <div
        className={`${styles.card} flex gap-[3vw] grow px-[1vw] py-[0.6vw] rounded-xl bg-[var(--dark)] `}
      >
        <div className="flex items-center w-1/2 h-full gap-[1.5vw] text-[var(--white)]">
          <div className="w-1/2 h-full flex flex-col">
            <h3 className="text-xl font-bold">Videos</h3>
            <ul className="text-sm list-none">
              <li className="flex justify-between items-center">
                <span title="All time">Videos Created</span>
                <span title="All time">
                  {formatNumbers(
                    Number(
                      pageState.fetchedYoutubeAnalytics?.youtubeAnalytics
                        ?.overallStatistics?.videoCount
                    )
                  ) || "No Data Available!"}
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span
                  title={`Data as of: ${
                    pageState?.fetchedYoutubeAnalytics?.youtubeAnalytics?.detailedStatistics?.slice(
                      pageState.activeAnalyticsTimeframe === "Daily"
                        ? -4
                        : pageState.activeAnalyticsTimeframe === "Weekly"
                          ? -2
                          : -1
                    )[0].start || "No Data Available!"
                  }`}
                >
                  Likes
                </span>
                <span
                  title={`Data as of: ${
                    pageState?.fetchedYoutubeAnalytics?.youtubeAnalytics?.detailedStatistics?.slice(
                      pageState.activeAnalyticsTimeframe === "Daily"
                        ? -4
                        : pageState.activeAnalyticsTimeframe === "Weekly"
                          ? -2
                          : -1
                    )[0].start || "No Data Available!"
                  }`}
                >
                  {formatNumbers(
                    Number(
                      pageState.fetchedYoutubeAnalytics?.youtubeAnalytics?.detailedStatistics?.slice(
                        pageState.activeAnalyticsTimeframe === "Daily"
                          ? -4
                          : pageState.activeAnalyticsTimeframe === "Weekly"
                            ? -2
                            : -1
                      )[0].likes
                    )
                  ) || "No Data Available!"}
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span title="All time">Views</span>
                <span title="All time">
                  {formatNumbers(
                    Number(
                      pageState.fetchedYoutubeAnalytics?.youtubeAnalytics
                        ?.overallStatistics?.viewCount
                    )
                  ) || "No Data Available!"}
                </span>
              </li>
            </ul>
          </div>
          <div className="w-1/2 py-2 h-full flex justify-center items-center">
            <div className="bg-[#0F0F0F] h-full w-full rounded-2xl overflow-hidden">
              <h3 className="text-sm pt-3 pl-5 font-bold">Views</h3>
              <div className="text-[var(--dark)]">
                <AreaChart2
                  timeframe={pageState.activeAnalyticsTimeframe}
                  seriesName={"Views"}
                  chartData={
                    pageState?.fetchedYoutubeAnalytics?.youtubeAnalytics?.detailedStatistics?.map(
                      (ele: { date: string; view: number }) => ele?.view || 0
                    ) || []
                  }
                  datesCategories={
                    pageState.fetchedYoutubeAnalytics?.youtubeAnalytics?.detailedStatistics?.map(
                      (item: any) => item.start
                    ) || []
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center w-1/2 h-full gap-[1.5vw] text-[var(--white)]">
          <div className="w-1/2 h-full flex flex-col">
            <h3 className="text-xl font-bold">Comments</h3>
            <ul className="text-sm list-none">
              <li className="flex justify-between items-center">
                <span
                  title={`Data as of: ${
                    pageState?.fetchedYoutubeAnalytics?.youtubeAnalytics?.detailedStatistics?.slice(
                      pageState.activeAnalyticsTimeframe === "Daily"
                        ? -4
                        : pageState.activeAnalyticsTimeframe === "Weekly"
                          ? -2
                          : -1
                    )[0].start || "No Data Available!"
                  }`}
                >
                  Comments Created
                </span>
                <span
                  title={`Data as of: ${
                    pageState?.fetchedYoutubeAnalytics?.youtubeAnalytics?.detailedStatistics?.slice(
                      pageState.activeAnalyticsTimeframe === "Daily"
                        ? -4
                        : pageState.activeAnalyticsTimeframe === "Weekly"
                          ? -2
                          : -1
                    )[0].start || "No Data Available!"
                  }`}
                >
                  {pageState?.fetchedYoutubeAnalytics?.youtubeAnalytics?.detailedStatistics?.slice(
                    pageState.activeAnalyticsTimeframe === "Daily"
                      ? -4
                      : pageState.activeAnalyticsTimeframe === "Weekly"
                        ? -2
                        : -1
                  )[0].comments || "No Data Available!"}
                </span>
              </li>
            </ul>
          </div>
          <div className="w-1/2 py-2 h-full flex justify-center items-center">
            <div className="bg-[#0F0F0F] h-full w-full rounded-2xl overflow-hidden">
              <h3 className="text-sm pt-3 pl-5 font-bold">Comments Created</h3>
              <div className="text-[var(--dark)]">
                <AreaChart2
                  timeframe={pageState.activeAnalyticsTimeframe}
                  seriesName={"Comments"}
                  chartData={
                    pageState?.fetchedYoutubeAnalytics?.youtubeAnalytics?.detailedStatistics?.map(
                      (ele: {
                        date: string;
                        comments: number;
                        engagementRate: string;
                        followers: number;
                        likes: number;
                        view: number;
                      }) => ele?.comments || 0
                    ) || []
                  }
                  datesCategories={
                    pageState.fetchedYoutubeAnalytics?.youtubeAnalytics?.detailedStatistics?.map(
                      (item: any) => item.start
                    ) || []
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (pageState.selectedSocialMediaAccount?.platform === "TWITTER") {
    return (
      <div
        className={`${styles.card} flex gap-[3vw] grow px-[1vw] py-[0.6vw] rounded-xl bg-[var(--dark)] `}
      >
        <div className="flex items-center w-1/2 h-full gap-[1.5vw] text-[var(--white)]">
          <div className="w-1/2 h-full flex flex-col">
            <h3 className="text-xl font-bold">Tweets</h3>
            <ul className="text-sm list-none">
              <li className="flex justify-between items-center">
                <span>Tweets Created</span>
                <span>
                  {formatNumbers(
                    Number(
                      pageState.fetchedTwitterAnalytics?.twitterAnalytics?.slice(
                        -1
                      )[0]?.tweetCount
                    )
                  ) || "No Data Available!"}
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span>Likes</span>
                <span>
                  {formatNumbers(
                    Number(
                      pageState.fetchedTwitterAnalytics?.twitterAnalytics?.slice(
                        -1
                      )[0]?.likeCount
                    )
                  ) || "No Data Available!"}
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span>Retweets</span>
                <span>
                  {formatNumbers(
                    Number(
                      pageState.fetchedTwitterAnalytics?.twitterAnalytics?.slice(
                        -1
                      )[0]?.retweetCount
                    )
                  ) || "No Data Available!"}
                </span>
              </li>
            </ul>
          </div>
          <div className="w-1/2 py-2 h-full flex justify-center items-center">
            <div className="bg-[#0F0F0F] h-full w-full rounded-2xl overflow-hidden">
              <h3 className="text-sm pt-3 pl-5 font-bold">Tweets Created</h3>
              <div className="text-[var(--dark)]">
                <AreaChart2
                  timeframe={pageState.activeAnalyticsTimeframe}
                  seriesName={"Tweets"}
                  chartData={
                    pageState?.fetchedTwitterAnalytics?.twitterAnalytics?.map(
                      (ele: { tweetCount: number }) => ele?.tweetCount || 0
                    ) || []
                  }
                  datesCategories={
                    pageState.fetchedTwitterAnalytics?.twitterAnalytics?.map(
                      (item: any) => item.start
                    ) || []
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center w-1/2 h-full gap-[1.5vw] text-[var(--white)]">
          <div className="w-1/2 h-full flex flex-col">
            <h3 className="text-xl font-bold">Replies</h3>
            <ul className="text-sm list-none">
              <li className="flex justify-between items-center">
                <span>Replies Count</span>
                <span>
                  {formatNumbers(
                    Number(
                      pageState.fetchedTwitterAnalytics?.twitterAnalytics?.slice(
                        -1
                      )[0]?.replyCount
                    )
                  ) || "No Data Available!"}
                </span>
              </li>
            </ul>
          </div>
          <div className="w-1/2 py-2 h-full flex justify-center items-center">
            <div className="bg-[#0F0F0F] h-full w-full rounded-2xl overflow-hidden">
              <h3 className="text-sm pt-3 pl-5 font-bold">Replies Count</h3>
              <div className="text-[var(--dark)]">
                <AreaChart2
                  timeframe={pageState.activeAnalyticsTimeframe}
                  seriesName={"Replies"}
                  chartData={
                    pageState?.fetchedTwitterAnalytics?.twitterAnalytics?.map(
                      (ele: { replyCount: number }) => ele?.replyCount || 0
                    ) || []
                  }
                  datesCategories={
                    pageState.fetchedTwitterAnalytics?.twitterAnalytics?.map(
                      (item: any) => item.start
                    ) || []
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (pageState.selectedSocialMediaAccount?.platform === "FACEBOOK") {
    return (
      <div
        className={`${styles.card} flex gap-[3vw] grow px-[1vw] py-[0.6vw] rounded-xl bg-[var(--dark)] `}
      >
        <div className="flex items-center w-1/2 h-full gap-[1.5vw] text-[var(--white)]">
          <div className="w-1/2 h-full flex flex-col">
            <h3 className="text-xl font-bold">Page</h3>
            <ul className="text-sm list-none">
              <li className="flex justify-between items-center">
                <span>Page Likes</span>
                <span>
                  {formatNumbers(
                    Number(
                      pageState.fetchedFacebookAnalytics?.FacebookAnalytics?.slice(
                        -1
                      )[0]?.pageLikes
                    )
                  ) || "No Data Available!"}
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span>Posts Likes</span>
                <span>
                  {formatNumbers(
                    Number(
                      pageState.fetchedFacebookAnalytics?.FacebookAnalytics?.slice(
                        -1
                      )[0]?.likes
                    )
                  ) || "No Data Available!"}
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span>Shares</span>
                <span>
                  {formatNumbers(
                    Number(
                      pageState.fetchedFacebookAnalytics?.FacebookAnalytics?.slice(
                        -1
                      )[0]?.shares
                    )
                  ) || "No Data Available!"}
                </span>
              </li>
            </ul>
          </div>
          <div className="w-1/2 py-2 h-full flex justify-center items-center">
            <div className="bg-[#0F0F0F] h-full w-full rounded-2xl overflow-hidden">
              <h3 className="text-sm pt-3 pl-5 font-bold">Page Likes</h3>
              <div className="text-[var(--dark)]">
                <AreaChart2
                  timeframe={pageState.activeAnalyticsTimeframe}
                  seriesName={"Page Likes"}
                  chartData={
                    pageState?.fetchedFacebookAnalytics?.FacebookAnalytics?.map(
                      (ele: { pageLikes: number }) => ele?.pageLikes || 0
                    ) || []
                  }
                  datesCategories={
                    pageState.fetchedFacebookAnalytics?.FacebookAnalytics?.map(
                      (item: any) => item.start
                    ) || []
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center w-1/2 h-full gap-[1.5vw] text-[var(--white)]">
          <div className="w-1/2 h-full flex flex-col">
            <h3 className="text-xl font-bold">Comments</h3>
            <ul className="text-sm list-none">
              <li className="flex justify-between items-center">
                <span>Comments Count</span>
                <span>
                  {formatNumbers(
                    Number(
                      pageState.fetchedFacebookAnalytics?.FacebookAnalytics?.slice(
                        -1
                      )[0]?.comments
                    )
                  ) || "No Data Available!"}
                </span>
              </li>
            </ul>
          </div>
          <div className="w-1/2 py-2 h-full flex justify-center items-center">
            <div className="bg-[#0F0F0F] h-full w-full rounded-2xl overflow-hidden">
              <h3 className="text-sm pt-3 pl-5 font-bold">Comments Count</h3>
              <div className="text-[var(--dark)]">
                <AreaChart2
                  timeframe={pageState.activeAnalyticsTimeframe}
                  seriesName={"Comments"}
                  chartData={
                    pageState?.fetchedFacebookAnalytics?.FacebookAnalytics?.map(
                      (ele: { comments: number }) => ele?.comments || 0
                    ) || []
                  }
                  datesCategories={
                    pageState.fetchedFacebookAnalytics?.FacebookAnalytics?.map(
                      (item: any) => item.start
                    ) || []
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (pageState.selectedSocialMediaAccount?.platform === "NEWSLETTER") {
    return (
      <div
        className={`${styles.card} flex gap-[3vw] grow px-[1vw] py-[0.6vw] rounded-xl bg-[var(--dark)] `}
      >
        <div className="flex items-center w-1/2 h-full gap-[1.5vw] text-[var(--white)]">
          <div className="w-1/2 h-full flex flex-col">
            <h3 className="text-xl font-bold">Newsletter</h3>
            <ul className="text-sm list-none">
              <li className="flex justify-between items-center">
                <span>Mailing Count</span>
                <span>
                  {formatNumbers(
                    Number(
                      pageState.fetchedNewsletterAnalytics?.newsLetterAnalytics?.slice(
                        -1
                      )[0]?.mailingCount
                    )
                  ) || "No Data Available!"}
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span>Newsletter Count</span>
                <span>
                  {formatNumbers(
                    Number(
                      pageState.fetchedNewsletterAnalytics?.newsLetterAnalytics?.slice(
                        -1
                      )[0]?.newsLetterCount
                    )
                  ) || "No Data Available!"}
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span>Click Count</span>
                <span>
                  {formatNumbers(
                    Number(
                      pageState.fetchedNewsletterAnalytics?.newsLetterAnalytics?.slice(
                        -1
                      )[0]?.clickCount
                    )
                  ) || "No Data Available!"}
                </span>
              </li>
            </ul>
          </div>
          <div className="w-1/2 py-2 h-full flex justify-center items-center">
            <div className="bg-[#0F0F0F] h-full w-full rounded-2xl overflow-hidden">
              <h3 className="text-sm pt-3 pl-5 font-bold">Click Count</h3>
              <div className="text-[var(--dark)]">
                <AreaChart2
                  timeframe={pageState.activeAnalyticsTimeframe}
                  seriesName={"Click Count"}
                  chartData={
                    pageState?.fetchedNewsletterAnalytics?.newsLetterAnalytics?.map(
                      (ele: { clickCount: number }) => ele?.clickCount || 0
                    ) || []
                  }
                  datesCategories={
                    pageState.fetchedNewsletterAnalytics?.newsLetterAnalytics?.map(
                      (item: any) => item.start
                    ) || []
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center w-1/2 h-full gap-[1.5vw] text-[var(--white)]">
          <div className="w-1/2 h-full flex flex-col">
            <h3 className="text-xl font-bold">Opening Count</h3>
            <ul className="text-sm list-none">
              <li className="flex justify-between items-center">
                <span>Opening Count</span>
                <span>
                  {formatNumbers(
                    Number(
                      pageState.fetchedNewsletterAnalytics?.newsLetterAnalytics?.slice(
                        -1
                      )[0]?.openingCount
                    )
                  ) || "No Data Available!"}
                </span>
              </li>
            </ul>
          </div>
          <div className="w-1/2 py-2 h-full flex justify-center items-center">
            <div className="bg-[#0F0F0F] h-full w-full rounded-2xl overflow-hidden">
              <h3 className="text-sm pt-3 pl-5 font-bold">Opening Count</h3>
              <div className="text-[var(--dark)]">
                <AreaChart2
                  timeframe={pageState.activeAnalyticsTimeframe}
                  seriesName={"Opening Count"}
                  chartData={
                    pageState?.fetchedNewsletterAnalytics?.newsLetterAnalytics?.map(
                      (ele: { openingCount: number }) => ele?.openingCount || 0
                    ) || []
                  }
                  datesCategories={
                    pageState.fetchedNewsletterAnalytics?.newsLetterAnalytics?.map(
                      (item: any) => item.start
                    ) || []
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <AnalyticsFooterNotFound />;
  }
}

export default memo(AnalyticsFooter);
