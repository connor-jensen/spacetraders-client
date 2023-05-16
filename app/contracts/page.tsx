"use client"

import { AcceptedContractCard, AvailableContractCard } from "@/components/ContractCard";
import { useContracts } from "@/hooks/contractHooks";

export default function ContractsPage() {
  const {data: contractList} = useContracts();

  const acceptedContracts = contractList?.filter(contract => contract.accepted)
  const availableContracts = contractList?.filter(contract => !contract.accepted)


  return (
    <>
      <h2 className="text-2xl text-goldstar">Active Contracts:</h2>
      <div className="flex">
      {acceptedContracts?.map(contract => <AcceptedContractCard key={contract.id} contract={contract} />)}
      </div>
      <h2 className="text-2xl text-goldstar">Available Contracts:</h2>
      <div className="flex h-52">
        {availableContracts?.map(contract => <AvailableContractCard key={contract.id} contract={contract} />)}
      </div>
    </>
  );
}
