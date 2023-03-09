import { Center, SimpleGrid } from "@chakra-ui/react";
import Liquid from "./Liquid";
import Stakes from "./Stakes";

/**
 * @name ShowYourDelegatees
 * @description ShowYourDelegatees component that shows the user's delegatees.
 * @dev This component is used in the Stats component.
 * @param {object} data - The user's data.
 * @param {number} data.balance - The user's balance.
 * @param {number} data.votes - The user's votes.
 * @param {number} data.stakedBalance - The user's staked balance.
 * @param {string} data.delegates - The user's delegates.
 * @param {array} stakes - The user's stakes.
 * @param {boolean} haveStakes - If the user has stakes.
 * @author Jesús Sánchez Fernández | WWW.JSANCHEZFDZ.ES
 * @version 1.0.0
 */
const ShowYourDelegatees = ({ data, stakes, haveStakes }) => {
    return (
        <Center mt={2} w="100%">
            <SimpleGrid minChildWidth="125px" spacing={4} w="100%">
                <Liquid data={data} haveStakes={haveStakes} />
                <Stakes stakes={stakes} haveStakes={haveStakes} />
            </SimpleGrid>
        </Center>
    );
};

export default ShowYourDelegatees;
