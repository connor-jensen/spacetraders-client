"use client";

import { Contract } from "@/spacetraders-sdk-old/src";
import { Card } from "./ui/card";
import { useAcceptContract } from "@/hooks/contractHooks";
import { useCountdown } from "@/hooks/useCountdown";

export function AvailableContractCard({ contract }: { contract: Contract }) {

  const { mutate: acceptContract} = useAcceptContract(contract.id)

  return (
    <Card>
      <div>{`${contract.type} Contract`}</div>
      <div>
        <strong>{`$${contract.terms.payment.onAccepted.toLocaleString(
          "en-US"
        )} `}</strong>
        up front
      </div>
      <div>
        <strong>{`$${contract.terms.payment.onFulfilled.toLocaleString(
          "en-US"
        )} `}</strong>
        on completion
      </div>
      {contract.terms.deliver && (
        <ul>
          {contract.terms.deliver.map((good) => (
            <li
              key={good.tradeSymbol + good.destinationSymbol}
            >{`${good.tradeSymbol} ${good.unitsRequired} to ${good.destinationSymbol}`}</li>
          ))}
        </ul>
      )}
      <button className="bg-goldstar px-4 py-2 self-end rounded-md" onClick={() => acceptContract()}>Accept</button>
    </Card>
  );
}

export function AcceptedContractCard({ contract }: { contract: Contract }) {

  const timeLeft = useCountdown(contract.expiration)

  return (
    <Card>
      <div>{`${contract.type} Contract`}</div>
      <div>Expires: {timeLeft}</div>
      <div>
        <strong>{`$${contract.terms.payment.onFulfilled.toLocaleString(
          "en-US"
        )} `}</strong>
        on completion
      </div>
      {contract.terms.deliver && (
        <ul>
          {contract.terms.deliver.map((good) => (
            <li
              key={good.tradeSymbol + good.destinationSymbol}
            >{`${good.tradeSymbol} ${good.unitsRequired - good.unitsFulfilled} to ${good.destinationSymbol}`}</li>
          ))}
        </ul>
      )}
    </Card>
  );
}
