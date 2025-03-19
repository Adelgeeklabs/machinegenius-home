"use client";
import AnalyticsTabsCard from "./AnalyticsTabsCard";
import AnalyticsTabsCardSkeleton from "./AnalyticsTabsCardSkeleton";
import AnalyticsTabsCardNotFound from "./AnalyticsTabsCardNotFound";
import { IPageState } from "../../00Types/OP_Analytics_Types";
import { formatNumbers } from "@/app/_utils/formatNumbers";
import { memo } from "react";

function AnalyticsTabContent({ pageState }: { pageState: IPageState }) {
  if (pageState.selectedSocialMediaAccount?.platform === "YOUTUBE") {
    return (
      <div className="tab-content">
        <div className="flex gap-3">
          {pageState.loadingAnalytics ? (
            <AnalyticsTabsCardSkeleton />
          ) : pageState.fetchedYoutubeAnalytics?.youtubeAnalytics ? (
            <AnalyticsTabsCard
              pageState={pageState}
              title="Subscribers"
              value={
                Number(
                  pageState?.fetchedYoutubeAnalytics?.youtubeAnalytics
                    ?.overallStatistics?.subscriberCount
                ) || 0
              }
              chartData={
                pageState?.fetchedYoutubeSubscribers?.map(
                  (ele: { totalSubscribers: number }) =>
                    ele?.totalSubscribers || 0
                ) || []
              }
              datesCategories={
                pageState.fetchedYoutubeSubscribers?.map(
                  (item: any) => item.start
                ) || []
              }
            />
          ) : (
            <AnalyticsTabsCardNotFound />
          )}

          {pageState.loadingAnalytics ? (
            <AnalyticsTabsCardSkeleton />
          ) : pageState.fetchedYoutubeAnalytics?.youtubeAnalytics ? (
            <AnalyticsTabsCard
              pageState={pageState}
              title="Engagement"
              value={
                pageState?.fetchedYoutubeAnalytics?.youtubeAnalytics?.detailedStatistics?.slice(
                  pageState.activeAnalyticsTimeframe === "Daily"
                    ? -4
                    : pageState.activeAnalyticsTimeframe === "Weekly"
                      ? -2
                      : -1
                )[0].engagementRate || 0
              }
              chartData={pageState.fetchedYoutubeAnalytics.youtubeAnalytics?.detailedStatistics.map(
                (ele: { date: string; engagementRate: string }) =>
                  Number(ele?.engagementRate?.split("%")[0]) || 0
              )}
              datesCategories={
                pageState.fetchedYoutubeAnalytics?.youtubeAnalytics?.detailedStatistics.map(
                  (item: any) => item.start
                ) || []
              }
            />
          ) : (
            <AnalyticsTabsCardNotFound />
          )}
        </div>
      </div>
    );
  } else if (pageState.selectedSocialMediaAccount?.platform === "TWITTER") {
    return (
      <div className="tab-content">
        <div className="flex gap-3">
          {pageState.loadingAnalytics ? (
            <AnalyticsTabsCardSkeleton />
          ) : pageState.fetchedTwitterAnalytics?.twitterAnalytics ? (
            <AnalyticsTabsCard
              pageState={pageState}
              title="Followers"
              value={formatNumbers(
                Number(
                  pageState?.fetchedTwitterAnalytics?.twitterAnalytics?.slice(
                    -1
                  )[0]?.memberCount || 0
                )
              )}
              chartData={pageState?.fetchedTwitterAnalytics?.twitterAnalytics.map(
                (ele: { memberCount: number }) => ele?.memberCount || 0
              )}
              datesCategories={
                pageState.fetchedTwitterAnalytics?.twitterAnalytics.map(
                  (item: any) => item.start
                ) || []
              }
            />
          ) : (
            <AnalyticsTabsCardNotFound />
          )}

          {pageState.loadingAnalytics ? (
            <AnalyticsTabsCardSkeleton />
          ) : pageState.fetchedTwitterAnalytics?.twitterAnalytics ? (
            <AnalyticsTabsCard
              pageState={pageState}
              title="Engagement"
              value={
                pageState?.fetchedTwitterAnalytics?.twitterAnalytics?.slice(
                  -1
                )[0]?.engagementRate || 0
              }
              chartData={pageState.fetchedTwitterAnalytics.twitterAnalytics.map(
                (ele: { engagementRate: string }) =>
                  Number(ele?.engagementRate?.split("%")[0]) || 0
              )}
              datesCategories={
                pageState.fetchedTwitterAnalytics?.twitterAnalytics.map(
                  (item: any) => item.start
                ) || []
              }
            />
          ) : (
            <AnalyticsTabsCardNotFound />
          )}
        </div>
      </div>
    );
  } else if (pageState.selectedSocialMediaAccount?.platform === "FACEBOOK") {
    return (
      <div className="tab-content">
        <div className="flex gap-3">
          {pageState.loadingAnalytics ? (
            <AnalyticsTabsCardSkeleton />
          ) : pageState.fetchedFacebookAnalytics?.FacebookAnalytics ? (
            <AnalyticsTabsCard
              pageState={pageState}
              title="Followers"
              value={
                formatNumbers(
                  Number(
                    pageState?.fetchedFacebookAnalytics?.FacebookAnalytics?.slice(
                      -1
                    )[0]?.followers
                  )
                ) || 0
              }
              chartData={pageState?.fetchedFacebookAnalytics?.FacebookAnalytics.map(
                (ele: { followers: number }) => ele?.followers || 0
              )}
              datesCategories={
                pageState.fetchedFacebookAnalytics?.FacebookAnalytics.map(
                  (item: any) => item.start
                ) || []
              }
            />
          ) : (
            <AnalyticsTabsCardNotFound />
          )}

          {pageState.loadingAnalytics ? (
            <AnalyticsTabsCardSkeleton />
          ) : pageState.fetchedFacebookAnalytics?.FacebookAnalytics ? (
            <AnalyticsTabsCard
              pageState={pageState}
              title="Engagement"
              value={
                pageState?.fetchedFacebookAnalytics?.FacebookAnalytics?.slice(
                  -1
                )[0]?.engagementRate || 0
              }
              chartData={pageState.fetchedFacebookAnalytics.FacebookAnalytics.map(
                (ele: { engagementRate: string }) =>
                  Number(ele?.engagementRate?.split("%")[0]) || 0
              )}
              datesCategories={
                pageState.fetchedFacebookAnalytics?.FacebookAnalytics.map(
                  (item: any) => item.start
                ) || []
              }
            />
          ) : (
            <AnalyticsTabsCardNotFound />
          )}
        </div>
      </div>
    );
  } else if (pageState.selectedSocialMediaAccount?.platform === "NEWSLETTER") {
    return (
      <div className="tab-content">
        <div className="flex gap-3">
          {pageState.loadingAnalytics ? (
            <AnalyticsTabsCardSkeleton />
          ) : pageState.fetchedNewsletterAnalytics?.newsLetterAnalytics ? (
            <AnalyticsTabsCard
              pageState={pageState}
              title="Opening Count"
              value={
                formatNumbers(
                  Number(
                    pageState?.fetchedNewsletterAnalytics?.newsLetterAnalytics?.slice(
                      -1
                    )[0]?.openingCount
                  )
                ) || 0
              }
              chartData={pageState?.fetchedNewsletterAnalytics?.newsLetterAnalytics.map(
                (ele: { openingCount: number }) => ele?.openingCount || 0
              )}
              datesCategories={
                pageState.fetchedNewsletterAnalytics?.newsLetterAnalytics.map(
                  (item: any) => item.start
                ) || []
              }
            />
          ) : (
            <AnalyticsTabsCardNotFound />
          )}

          {pageState.loadingAnalytics ? (
            <AnalyticsTabsCardSkeleton />
          ) : pageState.fetchedNewsletterAnalytics?.newsLetterAnalytics ? (
            <AnalyticsTabsCard
              pageState={pageState}
              title="Engagement"
              value={
                pageState?.fetchedNewsletterAnalytics?.newsLetterAnalytics?.slice(
                  -1
                )[0]?.engagementRate || 0
              }
              chartData={pageState.fetchedNewsletterAnalytics.newsLetterAnalytics.map(
                (ele: { engagementRate: string }) =>
                  Number(ele?.engagementRate?.split("%")[0]) || 0
              )}
              datesCategories={
                pageState.fetchedNewsletterAnalytics?.newsLetterAnalytics.map(
                  (item: any) => item.start
                ) || []
              }
            />
          ) : (
            <AnalyticsTabsCardNotFound />
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div className="tab-content">
        <div className="flex gap-3">
          <AnalyticsTabsCardNotFound />
          <AnalyticsTabsCardNotFound />
        </div>
      </div>
    );
  }
}

export default memo(AnalyticsTabContent);
