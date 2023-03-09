import { Box, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { NULL_ADDRESS } from "../../data/constants";

/**
 * @name Liquid
 * @description Liquid component that shows the user's liquid balance and delegatee.
 * @dev This component is used in the ShowYourDelegatees component.
 * @param {object} data - The user's data.
 * @param {number} data.balance - The user's balance.
 * @param {string} data.delegates - The user's delegates.
 * @param {boolean} haveStakes - If the user has stakes.
 * @author Jesús Sánchez Fernández | WWW.JSANCHEZFDZ.ES
 * @version 1.0.0
 */
const Liquid = ({ data, haveStakes }) => {
    const borderColor = useColorModeValue("blackAlpha.400", "whiteAlpha.400");
    return (
        <Stack
            direction="column"
            border="1px"
            p={2}
            rounded="lg"
            borderColor={borderColor}
            spacing={0}
            w={haveStakes ? "auto" : "25vw"}>
            <Box>
                <Text fontWeight="bold">Liquid T</Text>
                <Text>{data.balance}</Text>
            </Box>
            <Box>
                <Text fontWeight="bold">Delegatee</Text>
                {data.delegates === NULL_ADDRESS ? <Text>Not delegated</Text> : <Text>{data.delegates}</Text>}
            </Box>
        </Stack>
    );
};

export default Liquid;
