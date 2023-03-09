// React
import { useState } from "react";

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

    // ---------------------------- Check address ---------------------------- //

    const checkAddress = (address) => {
        try {
            const check = ethers.utils.isAddress(address);
            console.log("🚀 ~ file: ManualDelegate.js:54 ~ checkAddress ~ check:", check)
            setIsValidAddress(check);
        } catch (error) {
            setIsValidAddress(false);
        }
    };

    // -------------------------- Handle functions -------------------------- //
    // Manual input
    const handleInput = (e) => {
        setDelegateAddress(e.target.value);
        checkAddress(e.target.value);
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
        await callToDelegate({ selectedStake, selectedUser: delegateAddress, toast, contract, onClose })
    };

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
