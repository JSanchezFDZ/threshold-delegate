import { Center, Spinner, Text } from "@chakra-ui/react";

const Loader = () => {
    return (
        <>
            <Text textAlign="center" fontWeight="bold" my={4}>
                Loading...
            </Text>
            <Center>
                <Spinner size="lg" my={6} />
            </Center>
        </>
    );
};

export default Loader;
