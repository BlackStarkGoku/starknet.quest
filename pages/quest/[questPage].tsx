import { GetServerSidePropsContext, NextPage } from "next";
import QuestDetails from "../../components/quests/questDetails";
import React, { useEffect, useState } from "react";
import homeStyles from "../../styles/Home.module.css";
import styles from "../../styles/quests.module.css";
import { useRouter } from "next/router";
import { QueryError, QuestDocument } from "../../types/backTypes";
import RewardSkeleton from "../../components/skeletons/rewardSkeleton";
import ErrorScreen from "../../components/UI/screens/errorScreen";
import NftIssuer from "../../components/quests/nftIssuer";
import BackButton from "../../components/UI/backButton";
import useHasRootDomain from "../../hooks/useHasRootDomain";
import { useAccount } from "@starknet-react/core";
import { starknetIdAppLink } from "../../utils/links";
import BannerPopup from "../../components/UI/menus/bannerPopup";
import { useDomainFromAddress } from "../../hooks/naming";
import Head from "next/head";

type QuestPageProps = {
  customTags: boolean;
};

/* eslint-disable react/prop-types */
const QuestPage: NextPage<QuestPageProps> = ({ customTags }) => {
  const router = useRouter();
  const {
    questPage: questId,
    task_id: taskId,
    res,
    error_msg: errorMsg,
  } = router.query;
  console.log("questPage", questId);
  const [quest, setQuest] = useState<QuestDocument>({
    id: 0,
    name: "loading",
    desc: "loading",
    issuer: "loading",
    category: "loading",
    rewards_endpoint: "",
    logo: "",
    rewards_img: "",
    rewards_title: "loading",
    rewards_nfts: [],
    img_card: "",
    title_card: "",
    hidden: false,
    disabled: false,
    expiry_timestamp: "loading",
    mandatory_domain: null,
  });
  const [errorPageDisplay, setErrorPageDisplay] = useState(false);
  const { address } = useAccount();
  const [showDomainPopup, setShowDomainPopup] = useState<boolean>(false);
  const hasRootDomain = useHasRootDomain(quest.mandatory_domain, address);
  const { domain } = useDomainFromAddress(address);

  // this fetches quest data
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_LINK}/get_quest?id=${questId}`)
      .then((response) => response.json())
      .then((data: QuestDocument | QueryError) => {
        if ((data as QuestDocument).name) {
          setQuest(data as QuestDocument);
        }
      })
      .catch((err) => {
        if (questId) {
          console.log(err);
          setErrorPageDisplay(true);
        }
      });
  }, [questId]);

  return errorPageDisplay ? (
    <ErrorScreen
      errorMessage="This quest doesn't exist !"
      buttonText="Go back to quests"
      onClick={() => router.push("/")}
    />
  ) : (
    <>
      {customTags ? (
        <>
          <Head>
            <meta
              property="og:title"
              content="Join the Starknet Pro Score with mySwap CL Now!"
              key="og-title"
            />
            <meta
              property="og:description"
              content="Complete simple missions and claim your commemorative NFT!"
              key="og-desc"
            />
            <meta
              property="og:image"
              content="/braavos/myswap.webp"
              key="og-image"
            />
            <meta
              name="twitter:title"
              content="Join the Starknet Pro Score with mySwap CL Now!"
            />
            <meta
              name="twitter:description"
              content="Complete simple missions and claim your commemorative NFT!"
            />
            <meta name="twitter:image" content="/braavos/myswap.webp" />
          </Head>
        </>
      ) : null}
      <div className={homeStyles.screen}>
        {showDomainPopup &&
          (domain ? (
            <BannerPopup
              title="Subdomains are not allowed"
              banner="/visuals/profile.webp"
              description="To access Starknet Quest you need a Root Starknet domain (not a subdomain like .braavos.stark or .xplorer.stark)."
              buttonName="Get a Starknet Domain"
              onClick={() => window.open(starknetIdAppLink)}
              onClose={() => setShowDomainPopup(false)}
            />
          ) : (
            <BannerPopup
              title="Mandatory Starknet Domain"
              banner="/visuals/profile.webp"
              description="To access Starknet Quest, you must own a Starknet domain. It's your passport to the Starknet ecosystem. Get yours now."
              buttonName="Get a Starknet Domain"
              onClick={() => window.open(starknetIdAppLink)}
              onClose={() => setShowDomainPopup(false)}
            />
          ))}
        <div className={homeStyles.backButton}>
          <BackButton onClick={() => router.back()} />
        </div>
        <div className={styles.imageContainer}>
          {quest.issuer === "loading" ? (
            <RewardSkeleton />
          ) : (
            <NftIssuer
              issuer={{
                name: quest.issuer,
                logoFavicon: quest.logo,
              }}
            />
          )}
        </div>
        <QuestDetails
          quest={quest}
          taskId={taskId as string | undefined}
          res={res as string | undefined}
          errorMsg={errorMsg as string | undefined}
          setShowDomainPopup={setShowDomainPopup}
          hasRootDomain={hasRootDomain}
        />
      </div>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { questPage: questId } = context.query;
  let customTags = false;
  if (questId === "101") {
    customTags = true;
  }
  return {
    props: {
      customTags,
    },
  };
}

export default QuestPage;
