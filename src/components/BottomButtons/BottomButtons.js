import { Button, Center, Stack } from "@chakra-ui/react";

const BottomButtons = ({ handleManualDelegation, disconnect }) => {
    return (
        <Center>
            <Stack direction="row" spacing={8}>
                <Button variant="ghost" onClick={handleManualDelegation}>
                    Custom delegate
                </Button>
                <Button variant="ghost" onClick={disconnect}>
                    Disconnect
                </Button>
            </Stack>
        </Center>
    );
};

export default BottomButtons;
