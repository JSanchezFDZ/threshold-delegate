import { Stack } from "@chakra-ui/react";

// Components
import Delegates from "../Delegate/Delegates";
import Stats from "../Delegate/Stats";

const MainContainer = ({data, stakes, setSelectedStake, handleClick, borderColor}) => {
    return (
        <Stack direction="column" spacing={4} my={4} border="1px" borderColor={borderColor} rounded="md" shadow="sm">
            <Stats data={data} stakes={stakes} setSelectedStake={setSelectedStake} />
            {data.delegates !== "loading..." && <Delegates delegators={data.delegators} handleClick={handleClick} />}
        </Stack>
    );
};

export default MainContainer;
