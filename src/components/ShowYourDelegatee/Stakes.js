import { Box, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { NULL_ADDRESS } from "../../data/constants";

/**
 * @name Stakes
 * @description Stakes component that shows the user's stakes.
 * @dev This component is used in the ShowYourDelegatees component.
 * @param {array} stakes - The user's stakes.
 * @param {string} stakes.idStake - The user's stake ID.
 * @param {string} stakes.delegatee - The user's delegatee.
 * @param {boolean} haveStakes - If the user has stakes.
 * @author Jesús Sánchez Fernández | WWW.JSANCHEZFDZ.ES
 * @version 1.0.0
 */
const Stakes = ({ stakes }) => {
    const borderColor = useColorModeValue("blackAlpha.400", "whiteAlpha.400");
    return stakes.map((stake, index) => {
        const cutStakeAddress = stake.idStake.slice(0, 6) + "..." + stake.idStake.slice(-4);
        const cutDelegateAddress = stake.delegatee.slice(0, 6) + "..." + stake.delegatee.slice(-4);
        return (
            <Stack direction="column" border="1px" key={index} p={2} spacing={0} rounded="lg" borderColor={borderColor}>
                <Box>
                    <Text fontWeight="bold">Stake ID</Text>
                    <Text>{cutStakeAddress}</Text>
                </Box>
                <Box>
                    <Text fontWeight="bold">Delegatee</Text>
                    {stake.delegatee === NULL_ADDRESS ? <Text>Not delegated</Text> : <Text>{cutDelegateAddress}</Text>}
                </Box>
            </Stack>
        );
    });
};

export default Stakes;
