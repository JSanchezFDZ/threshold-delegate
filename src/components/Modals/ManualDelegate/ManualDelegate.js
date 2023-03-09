// React
import { useEffect, useState } from "react";

// Utils
import { ethers } from "ethers";

// Chakra UI
import {
    Button,
    Center,
    Heading,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    SimpleGrid,
    Text,
    useColorModeValue,
    useToast,
} from "@chakra-ui/react";

// Utils
import { callToDelegate } from "../../../utils/contracts";

/**
 * @name ManualDelegate
 * @description ManualDelegate component that allows the user to delegate votes to another address.
 * @dev This component is used in the Delegate component.
 * @param {function} onClose - Function to close the modal.
 * @param {boolean} isOpen - Check if the modal is open.
 * @param {string} address - The user's address.
 * @param {object} contract - The contract object.
 * @author Jesús Sánchez Fernández | WWW.JSANCHEZFDZ.ES
 * @version 1.0.0
 */
const ManualDelegate = ({ onClose, isOpen, address, selectedStake, contract }) => {
    // ------------------------------ Chakra UI ------------------------------ //
    const bgColor = useColorModeValue("blackAlpha.200", "whiteAlpha.200");
    const toast = useToast();

    // ------------------------------ States --------------------------------- //
    const [delegateAddress, setDelegateAddress] = useState("");
    const [isValidAddress, setIsValidAddress] = useState(false);
    const [ensName, setEnsName] = useState("");
    const [isCheckingEnsName, setIsCheckingEnsName] = useState(false);

    // ---------------------------- Check address ---------------------------- //

    const checkAddress = (address) => {
        try {
            const check = ethers.utils.isAddress(address);
            setIsValidAddress(check);
        } catch (error) {
            setIsValidAddress(false);
        }
    };

    const setAndCheckAddress = (address) => {
        setDelegateAddress(address);
        checkAddress(address);
    };

    // -------------------------- Handle functions -------------------------- //
    // Manual input
    const handleInput = async (e) => {
        const value = e.target.value;

        // Check if is ENS name
        const isEnsName = value.includes(".eth");

        if (isEnsName) setEnsName(isEnsName ? value : "");
        else setAndCheckAddress(value);
    };

    // Delegate to myself
    const handleDelegateMyself = () => {
        setDelegateAddress(address);
        checkAddress(address);
    };

    // Close modal and reset states
    const handleClose = () => {
        setDelegateAddress("");
        setIsValidAddress(false);
        onClose();
    };

    const handleDelegate = async () => {
        if (!isValidAddress) return;
        await callToDelegate({ selectedStake, address: delegateAddress, toast, contract, onClose });
    };

    useEffect(() => {
        const checkEnsName = async () => {
            try {
                setIsCheckingEnsName(true);
                const resolverAddress = await contract.provider.resolveName(ensName);
                setDelegateAddress(resolverAddress);
                checkAddress(resolverAddress);
                setEnsName("");
                setIsCheckingEnsName(false);
            } catch (error) {
                setIsCheckingEnsName(false);
                console.log("🚀 ~ file: ManualDelegate.js:108 ~ checkEnsName ~ error:", error);
            }
        };
        ensName.includes(".eth") && checkEnsName();
    }, [ensName, contract.provider]);

    // ------------------------------ Render ------------------------------ //

    return (
        <Modal size="lg" onClose={handleClose} isOpen={isOpen} isCentered>
            <ModalOverlay bgColor="blackAlpha.900" />
            <ModalContent bgColor="#7D00FF" color="white">
                <ModalHeader />
                <ModalCloseButton />
                <ModalBody>
                    <Heading size="md" textAlign="center">
                        Custom delegate
                    </Heading>
                    <Text textAlign="center">You can delegate to someone not listed, or to yourself</Text>
                    {isCheckingEnsName && (
                        <Text textAlign="center" mt={2}>
                            Checking ENS name...
                        </Text>
                    )}
                    <Input
                        bgColor={bgColor}
                        my={4}
                        size="lg"
                        placeholder="Enter address"
                        onChange={handleInput}
                        value={delegateAddress}
                    />
                    <Center>
                        <Button
                            onClick={handleDelegateMyself}
                            size="sm"
                            variant="outline"
                            isDisabled={address === delegateAddress}>
                            Delegate to myself
                        </Button>
                    </Center>
                </ModalBody>
                <ModalFooter>
                    <SimpleGrid columns={2} w="100%" gap={2}>
                        <Button
                            py={6}
                            w="100%"
                            bgColor="red.400"
                            color="white"
                            onClick={handleClose}
                            _hover={{ fontWeight: "bold" }}>
                            CANCEL
                        </Button>
                        <Button
                            py={6}
                            w="100%"
                            color="white"
                            bgColor="teal.400"
                            onClick={handleDelegate}
                            isDisabled={!isValidAddress}
                            _hover={{ fontWeight: "bold" }}>
                            DELEGATE
                        </Button>
                    </SimpleGrid>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ManualDelegate;
