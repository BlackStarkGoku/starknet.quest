import { NextPage } from "next";
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
import Popup from "../../components/UI/menus/popup";

const QuestPage: NextPage = () => {
  const router = useRouter();
  const {
    questPage: questId,
    task_id: taskId,
    res,
    error_msg: errorMsg,
  } = router.query;
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
  });
  const [errorPageDisplay, setErrorPageDisplay] = useState(false);
  const { address } = useAccount();
  const hasRootDomain = useHasRootDomain(address);
  const [showDomainPopup, setShowDomainPopup] = useState<boolean>(false);

  useEffect(() => {
    if (!address) return;
    setShowDomainPopup(!hasRootDomain);
  }, [address, hasRootDomain]);

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
    <div className={homeStyles.screen}>
      {showDomainPopup && (
        <Popup
          title="Mandatory Starknet Domain"
          banner="/visuals/profile.webp"
          description="To access Starknet Quest, you must own a Starknet domain. It's your passport to the Starknet ecosystem. Get yours now."
          buttonName="Get a Starknet Domain"
          onClick={() => window.open(starknetIdAppLink)}
        />
      )}
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
      />
    </div>
  );
};

export default QuestPage;
