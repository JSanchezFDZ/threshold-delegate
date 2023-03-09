import { useState } from "react";

import { Box, Text, useColorModeValue } from "@chakra-ui/react";

// Components
import DelegateSelector from "../DelegateSelector/DelegateSelector";
import ShowYourDelegatees from "../ShowYourDelegatee/ShowYourDelegatees";

/**
 * @name Stats
 * @description Stats component that displays the user's votes and allows them to delegate them.
 * @dev This component is used in the Delegate component.
 * @param {object} data - The user's data.
 * @param {number} data.balance - The user's balance.
 * @param {number} data.votes - The user's votes.
 * @param {string} data.delegates - The user's delegates.
 * @author Jesús Sánchez Fernández | WWW.JSANCHEZFDZ.ES
 * @version 1.0.0
 */
const Stats = ({ data, stakes, setSelectedStake }) => {
    // ------------------------------ Chakra UI ------------------------------ //
    const bgColorTop = useColorModeValue("blackAlpha.200", "#7D00FF");
    const [selectedOption, setSelectedOption] = useState("All");

    // -------------------------- Handle functions --------------------------- //
    const allBalance = data.balance + data.stakedBalance;
    const handleChange = (e) => {
        const value = e.target.value;
        setSelectedOption(value);
        if (value === "Balance") setSelectedStake(null);
        else {
            const stake = stakes.find((stake) => stake.idStake === value);
            setSelectedStake(stake);
        }
    };

    // ------------------------------ Variables ------------------------------ //

    const haveStakes = stakes.length > 0;

    // ------------------------------ Render --------------------------------- //
    return (
        <Box bgColor={bgColorTop} p={4} borderTopRadius="md">
            <Text>
                You have {allBalance} <strong>votes</strong> in total. {haveStakes && "(Liquid + Staked)"}
            </Text>
            {haveStakes && (
                <DelegateSelector
                    data={data}
                    stakes={stakes}
                    handleChange={handleChange}
                    selectedOption={selectedOption}
                />
            )}
            {data && stakes && <ShowYourDelegatees data={data} stakes={stakes} haveStakes={haveStakes} />}
        </Box>
    );
};

export default Stats;
