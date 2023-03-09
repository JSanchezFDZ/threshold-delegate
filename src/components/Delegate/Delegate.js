// React
import { useEffect, useState } from "react";

// Chakra UI
import { Box, Center, Heading, Text, useColorModeValue, useDisclosure } from "@chakra-ui/react";

// Utils
import { ethers } from "ethers";
import { useDisconnect, useContract } from "wagmi";
import { useQuery, gql } from "@apollo/client";

// Data
import { NULL_ADDRESS, SC_ABI, SC_ADDRESS, SC_STAKING_ABI, SC_STAKING_ADDRESS } from "../../data/constants";
import post from "../../data/325.json";

// Modal
import DelegateModal from "../Modals/DelegateModal/DelegateModal";
import ManualDelegate from "../Modals/ManualDelegate/ManualDelegate";
import BottomButtons from "../BottomButtons/BottomButtons";
import MainContainer from "../MainContainer/MainContainer";
import Loader from "../Loader/Loader";

/**
 * @name Delegate
 * @description Delegate component that displays the user's votes and allows them to delegate them.
 * @dev This component is used in the Home component.
 * @param {string} address - The user's address.
 * @param {object} connector - The user's connector.
 * @author Jesús Sánchez Fernández | WWW.JSANCHEZFDZ.ES
 * @version 1.0.1
 */

const Delegate = ({ address, connector }) => {
    // ------------------ STATES -------------------
    const [selectedUser, setSelectedUser] = useState(null); // Selected user to delegate to
    const [loading, setLoading] = useState(false); // Loading state
    const [needReload, setNeedReload] = useState(true); // Need reload state
    const [firstLoad, setFirstLoad] = useState(true); // First load state
    const [selectedStake, setSelectedStake] = useState(null); // Selected stake to delegate to

    // ------------------ DATA ---------------------
    const [data, setData] = useState({
        balance: 0,
        stakedBalance: 0,
        votes: 0,
        delegates: "loading...",
        delegators: [],
        isLoaded: false,
    });

    // ------------------ MODALs -------------------
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isOpenManual, onOpen: onOpenManual, onClose: onCloseManual } = useDisclosure();

    // ------------------ CONTRACTS ----------------
    const [signedTContract, setSignedTContract] = useState(null);
    const [signedTStaking, setSignedTStaking] = useState(null);

    const contract = useContract({
        address: SC_ADDRESS,
        abi: SC_ABI,
    });

    const stakingContract = useContract({
        address: SC_STAKING_ADDRESS,
        abi: SC_STAKING_ABI,
    });

    // ------------------ STAKING ------------------
    const [stakes, setStakes] = useState([]);
    const [stakedBalance, setStakedBalance] = useState(0);
    const [stakedLoaded, setStakedLoaded] = useState(false);
    const { disconnect } = useDisconnect();

    // ------------------ GRAPHQL ------------------
    const lowerCaseAddress = address.toLowerCase();

    const QUERY = gql`
        {
            account(id: "${lowerCaseAddress}") {
                stakes {
                    totalStaked
                    id
                    delegatee {
                        id
                    }
                }
            }
        }
    `;

    const { data: dataQuery, loading: loadingQuery } = useQuery(QUERY);

    // ------------------ HANDLERS ------------------
    // Handle click on a delegator
    const handleClick = (delegator) => {
        setSelectedUser(delegator);
        onOpen();
    };

    const handleManualDelegation = async () => {
        onOpenManual();
    };

    // ------------------ EFFECTS -------------------

    useEffect(() => {
        const calculateStaking = async () => {
            if (dataQuery !== undefined && dataQuery.account && dataQuery.account.stakes.length > 0) {
                // Create new array with the stakes
                const stakes = dataQuery.account.stakes;
                // Sum all the stakes
                const totalStaked = stakes.reduce((acc, stake) => acc + Number(stake.totalStaked), 0);
                // Convert to BigInt
                const totalStakedBigInt = BigInt(totalStaked).toString();
                // Stake to ether
                const totalStakedEther = Number(ethers.utils.formatEther(totalStakedBigInt)).toFixed(0);
                // Convert foreach stake to ether
                const auxStakes = [];
                stakes.forEach((stake) => {
                    const stakeBigInt = BigInt(stake.totalStaked).toString();
                    const stakeEther = Number(ethers.utils.formatEther(stakeBigInt)).toFixed(0);
                    const delegatee = stake.delegatee?.id;
                    // Search 0x and cut the string
                    const delegateeAddress = delegatee?.match(/0x[a-fA-F0-9]{40}/g)[0] || NULL_ADDRESS;
                    auxStakes.push({ idStake: stake.id, totalStaked: stakeEther, delegatee: delegateeAddress });
                });

                setStakedBalance(totalStakedEther);
                setStakedLoaded(true);
                setStakes(auxStakes);
            } else {
                setStakedBalance(0);
                setStakedLoaded(true);
            }
        };
        calculateStaking();
    }, [dataQuery, loadingQuery]);

    useEffect(() => {
        const getData = async () => {
            setLoading(true);

            try {
                const signer = await connector.getSigner();
                const signedTContract = contract.connect(signer);
                const signedTStaking = stakingContract.connect(signer);
                const [balance, delegates] = await Promise.all([
                    signedTContract.balanceOf(address),
                    signedTContract.delegates(address),
                ]);

                const totalPosts = post.post_stream.posts;
                const delegators = [];
                const votesPromises = [];

                const REGEX = /0x[a-fA-F0-9]{40}/g;
                for (const post of totalPosts) {
                    const { cooked } = post;
                    const found = cooked.match(REGEX);
                    if (found) {
                        const address = found[0];
                        delegators.push({ username: post.username, address, post_number: post.post_number });
                        // Get the votes from the staking contract and the token contract
                        votesPromises.push(
                            Promise.all([signedTContract.getVotes(address), signedTStaking.getVotes(address)])
                        );
                    }
                }

                // Iterate over the promises and get the votes
                // 2 promises per delegator
                const votes = await Promise.all(votesPromises);
                for (let i = 0; i < delegators.length; i++) {
                    // Convert the votes to BigInt
                    const TRawBalance = BigInt(votes[i][0]).toString();
                    const SRawBalance = BigInt(votes[i][1]).toString();
                    // Sum the votes from the staking contract and the token contract
                    const TBalance = ethers.utils.formatEther(TRawBalance);
                    const SBalance = ethers.utils.formatEther(SRawBalance);
                    // Sum the votes + fix the decimals
                    const totalVotes = Number(TBalance) + Number(SBalance);
                    delegators[i].votes = totalVotes.toFixed(0);
                }

                // Wei to Ether
                let balanceFixed = ethers.utils.formatEther(balance);
                balanceFixed = Number(balanceFixed).toFixed(2);

                // Convert to number
                const totalBalance = Number(balanceFixed);
                const totalStakedBalance = Number(stakedBalance);

                // Set the data
                setData({
                    balance: totalBalance,
                    stakedBalance: totalStakedBalance,
                    delegates,
                    delegators,
                    isLoaded: true,
                });
                setSignedTContract(signedTContract);
                setSignedTStaking(signedTStaking);
            } catch (error) {
                console.log("🚀 ~ file: Delegate.js:203 ~ getData ~ error:", error);
            } finally {
                if (firstLoad) setFirstLoad(false);
                setLoading(false);
                setNeedReload(false);
            }
        };

        needReload && stakedLoaded && !loading && connector && getData();
    }, [address, connector, contract, loading, needReload, firstLoad, stakedLoaded, stakedBalance, stakingContract]);

    useEffect(() => {
        const reloadData = async () => {
            setNeedReload(true);
        };

        const interval = setInterval(reloadData, 5000);
        return () => clearInterval(interval);
    }, []);

    const borderColor = useColorModeValue("blackAlpha.300", "whiteAlpha.300");

    return (
        <>
            <Center>
                <Box
                    textAlign="center"
                    border="1px"
                    borderColor={borderColor}
                    rounded="lg"
                    p={4}
                    px={8}
                    shadow="dark-lg">
                    <Heading my={2}>Change your delegate</Heading>
                    <Text>Select a community member to represent you. You can change this at any time.</Text>

                    {loading && firstLoad && <Loader />}

                    {data.isLoaded && (
                        <MainContainer
                            borderColor={borderColor}
                            data={data}
                            stakes={stakes}
                            setSelectedStake={setSelectedStake}
                            handleClick={handleClick}
                        />
                    )}

                    <BottomButtons handleManualDelegation={handleManualDelegation} disconnect={disconnect} />
                </Box>
            </Center>

            {selectedUser && (
                <DelegateModal
                    isOpen={isOpen}
                    onClose={onClose}
                    selectedUser={selectedUser}
                    selectedStake={selectedStake}
                    balance={selectedStake ? selectedStake.totalStaked : data.balance}
                    contract={selectedStake ? signedTStaking : signedTContract}
                />
            )}

            {isOpenManual && (
                <ManualDelegate
                    isOpen={isOpenManual}
                    onClose={onCloseManual}
                    address={address}
                    selectedStake={selectedStake}
                    contract={selectedStake ? signedTStaking : signedTContract}
                />
            )}
        </>
    );
};

export default Delegate;
