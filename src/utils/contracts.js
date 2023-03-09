import { errorToast, infoToast, successToast } from "./toastify";

export const callToDelegate = async ({ selectedStake, address, toast, contract, onClose }) => {
    try {
        let tx;
        if (selectedStake) tx = await contract.delegateVoting(selectedStake.idStake, address);
        else tx = await contract.delegate(address);
        infoToast("Transaction sent", "Please wait for the transaction", toast);
        onClose();
        await tx.wait();
        successToast("Transaction confirmed", "Your votes has been delegated", toast);
    } catch (error) {
        errorToast("Transaction failed", "Please try again", toast);
        console.log("🚀 ~ file: DelegateModal.js:26 ~ handleDelegate ~ error", error);
    }
};