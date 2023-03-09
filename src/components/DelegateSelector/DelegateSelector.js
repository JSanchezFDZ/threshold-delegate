import { Center, Select } from "@chakra-ui/react";

/**
 * @name DelegateSelector
 * @description DelegateSelector component that allows the user to select a stake to delegate.
 * @dev This component is used in the Stats component.
 * @param {object} data - The user's data.
 * @param {number} data.balance - The user's balance.
 * @param {number} data.votes - The user's votes.
 * @param {string} data.delegates - The user's delegates.
 * @param {array} stakes - The user's stakes.
 * @param {string} selectedOption - The selected stake.
 * @param {function} handleChange - The function to handle the change of the select.
 * @author Jesús Sánchez Fernández | WWW.JSANCHEZFDZ.ES
 * @version 1.0.0
 */
const DelegateSelector = ({ data, stakes, selectedOption, handleChange }) => {
    return (
        <Center>
            <Select
                size="sm"
                mt={2}
                textAlign="center"
                value={selectedOption}
                onChange={handleChange}
                w={["80%", "70%", "40%"]}
                placeholder="-- Select to delegate --">
                <option value="Balance">Liquid | Balance: {data.balance}</option>
                {stakes.map((stake) => {
                    const address = stake.idStake;
                    const cutAddress = address.slice(0, 6) + "..." + address.slice(-4);
                    const totalStaked = stake.totalStaked;
                    return (
                        <option key={address} value={address}>
                            ID: {cutAddress} | Balance: {totalStaked}
                        </option>
                    );
                })}
            </Select>
        </Center>
    );
};

export default DelegateSelector;
