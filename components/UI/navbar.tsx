import Link from "next/link";
import React, {
  useState,
  useEffect,
  FunctionComponent,
  useCallback,
} from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import styles from "../../styles/components/navbar.module.css";
import Button from "./button";
import {
  useConnectors,
  useAccount,
  useProvider,
  useTransactionManager,
  Connector,
} from "@starknet-react/core";
import Wallets from "./wallets";
import ModalMessage from "./modalMessage";
import { useDisplayName } from "../../hooks/displayName.tsx";
import { useDomainFromAddress } from "../../hooks/naming";
import { constants } from "starknet";
import ModalWallet from "./modalWallet";
import { CircularProgress } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useRouter } from "next/router";
import theme from "../../styles/theme";
import { FaDiscord, FaTwitter } from "react-icons/fa";

const Navbar: FunctionComponent = () => {
  const [nav, setNav] = useState<boolean>(false);
  const [hasWallet, setHasWallet] = useState<boolean>(false);
  const { address } = useAccount();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [txLoading, setTxLoading] = useState<number>(0);
  const { available, connect, disconnect, connectors } = useConnectors();
  const { provider } = useProvider();
  const domainOrAddressMinified = useDisplayName(address ?? "");
  const domain = useDomainFromAddress(address ?? "").domain;
  const addressOrDomain =
    domain && domain.endsWith(".stark") ? domain : address;
  const network =
    process.env.NEXT_PUBLIC_IS_TESTNET === "true" ? "testnet" : "mainnet";
  const [navbarBg, setNavbarBg] = useState<boolean>(false);
  const { hashes } = useTransactionManager();
  const [showWallet, setShowWallet] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // to handle autoconnect starknet-react adds connector id in local storage
    // if there is no value stored, we show the wallet modal
    const timeout = setTimeout(() => {
      if (!address) {
        if (
          !localStorage.getItem("lastUsedConnector") &&
          router?.pathname !== "/partnership"
        ) {
          if (connectors.length > 0) setHasWallet(true);
        } else {
          const lastConnectedConnectorId =
            localStorage.getItem("lastUsedConnector");
          if (lastConnectedConnectorId === null) return;

          const lastConnectedConnector = connectors.find(
            (connector) => connector.id === lastConnectedConnectorId
          );
          if (lastConnectedConnector === undefined) return;
          tryConnect(lastConnectedConnector);
        }
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    address ? setIsConnected(true) : setIsConnected(false);
  }, [address]);

  useEffect(() => {
    if (!isConnected) return;

    provider.getChainId().then((chainId) => {
      const isWrongNetwork =
        (chainId === constants.StarknetChainId.SN_GOERLI &&
          network === "mainnet") ||
        (chainId === constants.StarknetChainId.SN_MAIN &&
          network === "testnet");
      setIsWrongNetwork(isWrongNetwork);
    });
  }, [provider, network, isConnected]);

  const tryConnect = useCallback(
    async (connector: Connector) => {
      if (address) return;
      if (await connector.ready()) {
        connect(connector);

        return;
      }
    },
    [address, connectors]
  );

  function disconnectByClick(): void {
    disconnect();
    setIsConnected(false);
    setIsWrongNetwork(false);
    setShowWallet(false);
  }

  function handleNav(): void {
    setNav(!nav);
  }

  function onTopButtonClick(): void {
    if (!isConnected) {
      if (available.length > 0) {
        if (available.length === 1) {
          connect(available[0]);
        } else {
          setHasWallet(true);
        }
      } else {
        setHasWallet(true);
      }
    } else {
      setShowWallet(true);
    }
  }

  function topButtonText(): string | undefined {
    const textToReturn = isConnected ? domainOrAddressMinified : "connect";

    return textToReturn;
  }

  const handleScroll = () => {
    if (window.scrollY > 10) {
      setNavbarBg(true);
    } else {
      setNavbarBg(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className={`fixed w-full z-[1]`} id="nav">
        <div
          className={`${styles.navbarContainer} ${
            navbarBg ? styles.navbarScrolled : ""
          }`}
        >
          <div className="ml-4">
            <Link href="/" className="cursor-pointer">
              <img
                className="cursor-pointer"
                src="/visuals/starknetquestLogo.svg"
                alt="Starknet.id Logo"
                width={70}
                height={70}
              />
            </Link>
          </div>
          <div>
            <ul className="hidden lg:flex uppercase items-center">
              <Link href="/">
                <li className={styles.menuItem}>Quests</li>
              </Link>
              <Link href="/achievements">
                <li className={styles.menuItem}>Achievements</li>
              </Link>
              <Link href={`/${address ? addressOrDomain : "not-connected"}`}>
                <li className={styles.menuItem}>My land</li>
              </Link>
              {/* Note: I'm not sure that our testnet will be public so we don't show any link  */}
              {/* <SelectNetwork network={network} /> */}
              <div className="text-background ml-5 mr-5">
                <Button
                  onClick={
                    isConnected
                      ? () => setShowWallet(true)
                      : available.length === 1
                      ? () => connect(available[0])
                      : () => setHasWallet(true)
                  }
                >
                  {isConnected ? (
                    <>
                      {txLoading > 0 ? (
                        <div className="flex justify-center items-center">
                          <p className="mr-3">{txLoading} on hold</p>
                          <CircularProgress
                            sx={{
                              color: "white",
                            }}
                            size={25}
                          />
                        </div>
                      ) : (
                        <div className="flex justify-center items-center">
                          <p className="mr-3">{domainOrAddressMinified}</p>
                          <AccountCircleIcon />
                        </div>
                      )}
                    </>
                  ) : (
                    "connect"
                  )}
                </Button>
              </div>
            </ul>
            <div onClick={handleNav} className="lg:hidden">
              <AiOutlineMenu
                color={theme.palette.secondary.main}
                size={25}
                className="mr-3"
              />
            </div>
          </div>
        </div>

        <div
          className={
            nav
              ? "lg:hidden fixed left-0 top-0 w-full h-screen bg-black/10"
              : ""
          }
        >
          <div
            className={
              nav
                ? "fixed left-0 top-0 w-full sm:w-[60%] lg:w-[45%] h-screen bg-background px-5 ease-in duration-500 flex justify-between flex-col"
                : "fixed left-[-100%] top-0 p-10 ease-in h-screen flex justify-between flex-col"
            }
          >
            <div className="h-full flex flex-col">
              <div className="flex w-full items-center justify-between">
                <div>
                  <Link href="/">
                    <img
                      src="/visuals/starknetquestLogo.svg"
                      alt="Starknet Quest Logo"
                      width={70}
                      height={70}
                    />
                  </Link>
                </div>

                <div
                  onClick={handleNav}
                  className="rounded-lg cursor-pointer p-1"
                >
                  <AiOutlineClose color={theme.palette.secondary.main} />
                </div>
              </div>
              <div className="py-4 my-auto text-center font-extrabold">
                <ul className="uppercase text-babe-blue">
                  <Link href="/">
                    <li
                      onClick={() => setNav(false)}
                      className={styles.menuItemSmall}
                    >
                      Quests
                    </li>
                  </Link>
                  <Link href="/achievements">
                    <li
                      onClick={() => setNav(false)}
                      className={styles.menuItemSmall}
                    >
                      Achievements
                    </li>
                  </Link>
                  <Link
                    href={`/${address ? addressOrDomain : "not-connected"}`}
                  >
                    <li
                      onClick={() => setNav(false)}
                      className={styles.menuItemSmall}
                    >
                      My land
                    </li>
                  </Link>
                </ul>
              </div>
            </div>
            <div className="flex flex-col items-center my-4 w-full">
              <div className="text-background">
                <Button onClick={onTopButtonClick}>{topButtonText()}</Button>
              </div>
              <div className="flex">
                <div className="rounded-full shadow-gray-400 p-3 cursor-pointer hover:scale-105 ease-in duration-300 mt-2">
                  <a
                    href="https://twitter.com/starknet_quest"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaTwitter size={28} color={theme.palette.secondary.main} />
                  </a>
                </div>
                <div className="rounded-full shadow-gray-400 p-3 cursor-pointer hover:scale-105 ease-in duration-300 mt-2">
                  <a
                    href="https://discord.gg/byEGk6w6T6"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaDiscord size={28} color={theme.palette.secondary.main} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalMessage
        open={isWrongNetwork}
        title={"Wrong network"}
        closeModal={() => setIsWrongNetwork(false)}
        message={
          <div className="mt-3 flex flex-col items-center justify-center text-center">
            <p>
              This app only supports Starknet {network}, you have to change your
              network to be able use it.
            </p>
            <div className="mt-3">
              <Button onClick={() => disconnectByClick()}>
                {`Disconnect`}
              </Button>
            </div>
          </div>
        }
      />
      <ModalWallet
        domain={domainOrAddressMinified}
        open={showWallet}
        closeModal={() => setShowWallet(false)}
        disconnectByClick={disconnectByClick}
        hashes={hashes}
        setTxLoading={setTxLoading}
      />
      <Wallets
        closeWallet={() => setHasWallet(false)}
        hasWallet={Boolean(hasWallet && !isWrongNetwork)}
      />
    </>
  );
};

export default Navbar;
