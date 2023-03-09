import { errorToast, infoToast, successToast } from "./toastify";

export const callToDelegate = async ({ selectedStake, selectedUser, toast, contract, onClose }) => {
    try {
        let tx;
        if (selectedStake) tx = await contract.delegate(selectedStake.idStake, selectedUser.address);
        else tx = await contract.delegate(selectedUser.address);
        infoToast("Transaction sent", "Please wait for the transaction", toast);
        onClose();
        await tx.wait();
        successToast("Transaction confirmed", "Your votes has been delegated", toast);
    } catch (error) {
        errorToast("Transaction failed", "Please try again", toast);
        console.log("🚀 ~ file: DelegateModal.js:26 ~ handleDelegate ~ error", error);
    }
};
