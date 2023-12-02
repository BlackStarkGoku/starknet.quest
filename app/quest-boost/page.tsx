"use client";

import React, { use, useEffect, useState } from "react";
import styles from "../../styles/questboost.module.css";
import BoostCard from "../../components/quest-boost/boostCard";
import CategoryTitle from "../../components/UI/titles/categoryTitle";
import Componentstyles from "../../styles/components/pages/home/howToParticipate.module.css";
import Steps from "../../components/UI/steps/steps";
import { getBoosts } from "../../services/apiService";
import Quest from "../../components/quests/quest";

export default function Page() {
  const [boosts, setBoosts] = useState([]);

  const fetchBoosts = async () => {
    try {
      const res = await getBoosts();
      setBoosts(res);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBoosts();
  }, []);

  useEffect(() => {
    console.log({ boosts });
  }, [boosts]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Boosts Quest</h1>
      <div className={styles.card_container}>
        {boosts?.map((boost) => {
          return (
            <Quest
              key={boost.id}
              title={boost.title_card}
              onClick={() => router.push(`/quest/${boost.id}`)}
              imgSrc={boost.img_card}
              issuer={{
                name: boost.issuer,
                logoFavicon: boost.logo,
              }}
              reward={boost.rewards_title}
              id={boost.id}
              expired={boost.expiry < Date.now() / 1000}
            />
          );
        })}
      </div>

      <section className={styles.instructions_container}>
        <CategoryTitle
          title="How Quest Boosts and the Lottery Work ?"
          subtitle="Boost Your Quests, Maximize Your Gains!"
        />
        <div className={Componentstyles.stepsContainer}>
          <Steps
            subTitleBefore={true}
            steps={[
              {
                title: "Boost Your Chances",
                subtitle: "01",
                description:
                  "When a quest is boosted, every completion automatically gives you a chance in our lottery. The more boosted quests you complete, the higher your chances of winning!",
                icon: "/icons/starknet.svg",
                banner: "/visuals/partners/getYourStarkDomain.webp",
              },
              {
                title: "Claim Your Piece of the Pie",
                subtitle: "02",
                description:
                  "Once the quest is finished, check the quest's special page to see if you've won the lottery. If you have, claim your reward with just one click!",
                icon: "/icons/crown.svg",
                banner: "/visuals/partners/collectNFTsInStarknetQuest.webp",
              },
              {
                title: "Double Your Chances",
                subtitle: "03",
                description:
                  "Once the quest is finished, check the quest's special page to see if you've won the lottery. If you have, claim your reward with just one click!",
                icon: "/icons/verified.svg",
                banner: "/visuals/partners/buildYourStarknetLand.webp",
              },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
