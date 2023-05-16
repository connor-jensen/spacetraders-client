import Image from 'next/image'
import styles from './page.module.css'
import { useEffect, useState } from 'react'
import { agentsApi } from '@/utils/spacetraders-apis';

// async function getAgentData() {
//   console.log('hello!')
//   const res = await agentsAPI.getMyAgent();

//   if (!res.data) {
//     throw new Error('failed to fetch agent data')
//   }

//   return res.data;
// }



export default async function Home() {

  const { data: agentData } = await agentsApi.getMyAgent()

  return (
    <main className=''>
      <h1 className='text-2xl'>Hello world!</h1>
      <div>accountId: {agentData.accountId}</div>
      <div>credits: {agentData.credits}</div>
      <div>headquarters: {agentData.headquarters}</div>
      <div>symbol: {agentData.symbol}</div>
    </main>
  )
}
