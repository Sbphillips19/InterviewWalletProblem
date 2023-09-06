'use client';

import { Balance, GetAccountBalanceReply } from '@ankr.com/ankr.js';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import Select, { MultiValue,OnChangeValue, StylesConfig } from 'react-select'

import Button from '@/components/buttons/Button';
import Input from '@/components/inputs/Input';
import UnderlineLink from '@/components/links/UnderlineLink';
import Skeleton from '@/components/Skeleton';

import { ChainOption, chainOptions } from '@/constant/chainOptions';

import { getAccountBalance, getEthPrice } from './api/ankrCalls';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */
import Logo from '~/svg/Logo.svg';


// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.

// I HAVEN'T CHANGED ANY OF THE BASIC CONFIG OR STRIPPED THIS OUT BUT I WOULD IF IT WAS A PROD APP
// PROBABLY WOULD START FROM SCRATCH ALSO
// BUT IN INTEREST OF TIME THIS APP WAS A GOOD STARTER

export default function HomePage() {

  const [sortColumn, setSortColumn] = useState<keyof Balance | 'balanceEth' | null >(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [responseData, setResponseData] = useState<Balance[]>();
  const [sortedAssets, setSortedAssets] = useState<Balance[]>();
  const [error, setError] = useState<any>();
  const [inputError, setInputError] = useState<string>('');
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [blockchainFilter, setBlockchainFilter] = useState<string[]>([]);
  const [selectedBlockchains, setSelectedBlockchains] = useState<string[]>([]);
  const [ethPrice, setEthPrice] = useState<number>();


  // Start on ETH - change to a filter to not have to deal with changing 
  // this everytime there is a new chain
  const [selectedChains, setSelectedChains] = useState<MultiValue<ChainOption>>([chainOptions[3]]);

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWalletAddress(event.target.value);
  };

  const handleChainChange = (options: ChainOption[] | null) => {
    setSelectedChains(options || []);
  };

  // no point in calling the API if it's not a valid address- test for this
  const isEthereumAddress = (address: string): boolean => {
    const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    return ethereumAddressRegex.test(address);
  };


  const fetchWalletInformation = async () => {
    // verify ethereum address- API doesn't care if checksum or not
    if (!isEthereumAddress(walletAddress)) {
      setInputError("*Please use a valid address")
    } else {
      try {
        const selectedChainsToInclude = selectedChains.map((option: { value: any; }) => option.value);
        setLoadingData(true)
        const data: GetAccountBalanceReply = await getAccountBalance(walletAddress, selectedChainsToInclude);

        console.log('data', data)
        setResponseData(data.assets);
        setSortedAssets(data.assets);

        const uniqueBlockchainsSet = new Set(data.assets.map(item => item.blockchain));
        const uniqueBlockchainsArray = Array.from(uniqueBlockchainsSet);
        // filter only based on the blockchains that wallet is in
        setBlockchainFilter(uniqueBlockchainsArray)
        setSelectedBlockchains(uniqueBlockchainsArray)
        setLoadingData(false)
        setError(null);
      } catch (error: any) {
        setLoadingData(false)
        setError(error)
      }
    }
  }

  //  HANDLE TOGGLE FOR BLOCKCHAINS TO FILTER
  const handleBlockchainToggle = (blockchain: string) => {
    if (selectedBlockchains.includes(blockchain)) {
      setSelectedBlockchains(selectedBlockchains.filter((item) => item !== blockchain));
    } else {
      setSelectedBlockchains([...selectedBlockchains, blockchain]);
    }
  };

  // SORT ASSETS BY COLUMN HEADER
  const handleColumnSort = (columnName: keyof Balance | 'balanceEth' | null) => {
    if (sortColumn === columnName) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnName);
      setSortDirection('asc');
    }
  };

  // SELECT STYLES FOR DROWPDOWN
  const customSelectStyles: StylesConfig = {
    option: (styles) => ({ ...styles, display: 'flex', alignItems: 'flex-start', justifyContent: "flex-start" }),
  };

  // SORT TRIANGLE ASC/DESC
  const renderSortIcon = (column: string) => {
    if (sortColumn === column) {
      return sortDirection === 'asc' ? '▲' : '▼';
    }
    return null;
  };

  // Custom comparison function for mixed types
  function customCompare(a: string, b: string) {
    if (!isNaN(parseFloat(a)) && !isNaN(parseFloat(b))) {
      // Both are numbers, compare as numbers
      return parseFloat(a) - parseFloat(b);
    } else {
      // Use default string comparison for other cases
      return a.localeCompare(b);
    }
  }

  // SORT VALUE ON COLUMN CHANGE, ASC/ DESC, COLUMN HEADER
  useEffect(() => {
    if (responseData && sortColumn && sortDirection) {
      const newSortedAssets = responseData.slice().sort((a, b) => {
        const aValue = (a as any)[sortColumn!] as string;
        const bValue = (b as any)[sortColumn!] as string;
        if (sortDirection === 'asc') {
          return customCompare(aValue, bValue);
        } else {
          return customCompare(bValue, aValue);
        }
      });
      setSortedAssets(newSortedAssets);
    }
  }, [responseData, sortColumn, sortDirection]);


  // FETCH ETH PRICE
  useEffect(() => {
    async function fetchEthPrice() {
      try {
        const response = await getEthPrice();
        const ethUSDPrice = response.data.result.usdPrice;
        setEthPrice(parseFloat(ethUSDPrice))
        setError(null);
      } catch (error) {
        setError(error);
      }
    }
    fetchEthPrice();

  }, []);


  return (
    <main>
      <Head>
        <title>Wallet Tracker</title>
      </Head>
      <section className='bg-white'>
        <div className='layout relative flex min-h-screen flex-col items-center justify-start py-12 mt-12 sm:mt-32 text-center'>
          <Logo className='w-16' />
          <h1 className='mt-4'>Wallet Tracker</h1>

          <div className='flex flex-col items-start bg-gray-100 p-6 rounded-xl w-full max-w-[500px] m-4'>
            <div className='flex items-start flex-col mb-2 w-full'>
              <div className='font-bold'>Chain Selector</div>
              <Select
                isMulti
                value={selectedChains as OnChangeValue<ChainOption, true>}
                onChange={(newValue) => handleChainChange(newValue as ChainOption[])}
                options={chainOptions}
                styles={customSelectStyles}
                className='w-full'
              />
            </div>
            {/* 
                This was a custom created input all the other components were in the template
                Also no need to checksum this address- works fine for me
            */}
            <Input label="Wallet Address" variant='outline' classNames={{ inputWrapper: "flex flex-col items-start w-full", input: "w-full", label: 'font-bold' }} onChange={handleAddressChange} error={inputError} />
            {error && <p className="text-red-500 text-sm my-2">{error}</p>}
            <Button variant='primary' className='mt-2 w-full' onClick={fetchWalletInformation}>Submit</Button>
          </div>
          {responseData && <div className="relative">
            <details className="group [&_summary::-webkit-details-marker]:hidden">
              <summary
                className="flex cursor-pointer items-center gap-2 border-b border-gray-400 pb-1 text-gray-900 transition hover:border-gray-600"
              >
                <span className="text-sm font-medium">Chains To Sort By</span>

                <span className="transition group-open:-rotate-180">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </span>
              </summary>
              {responseData && <div
                className="z-50 group-open:absolute group-open:start-0 group-open:top-auto group-open:mt-2"
              >
                <div className="w-96 rounded border border-gray-200 bg-white">
                  <header className="flex items-center justify-between p-4">
                    <span className="text-sm text-gray-700">{selectedBlockchains.length}</span>
                  </header>
                  <ul className="space-y-1 border-t border-gray-200 p-4">
                    {blockchainFilter.map(item =>
                      <li key={item}>
                        <label className="flex items-start flex-start gap-2 mb-2">
                          <input
                            type="checkbox"
                            id={`FilterBlockchain_${item}`}
                            className="h-5 w-5 rounded border-gray-300"
                            checked={selectedBlockchains.includes(item)}
                            onChange={() => handleBlockchainToggle(item)}
                          />
                          <span className="text-sm font-medium text-gray-700">{item}</span>
                        </label>
                      </li>
                    )}
                  </ul>
                </div>
              </div>}
            </details>
          </div>}
          {/* This would end up being a separate component which would be a table with table rows 
              each row would be another component and would design in similar to pancakeswap with cards as well
          */}
          {loadingData &&
            <>
              <Skeleton className='h-12 w-full mt-1' />
              <Skeleton className='h-12 w-full mt-1' />
              <Skeleton className='h-12 w-full mt-1' />
              <Skeleton className='h-12 w-full mt-1' />
              <Skeleton className='h-12 w-full mt-1' />
              <Skeleton className='h-12 w-full mt-1' />
            </>
          }
          {!loadingData && sortedAssets && sortedAssets.length > 0 &&
            <div className='mt-4 min-w-full'>
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th
                      className="px-4 py-2 cursor-pointer"
                      onClick={() => handleColumnSort('blockchain')}
                    >
                      Blockchain {renderSortIcon('blockchain')}
                    </th>
                    <th
                      className="px-4 py-2 cursor-pointer"
                      onClick={() => handleColumnSort('tokenName')}
                    >
                      Token Name {renderSortIcon('tokenName')}
                    </th>
                    <th
                      className="px-4 py-2 cursor-pointer"
                      onClick={() => handleColumnSort('balance')}
                    >
                      Balance {renderSortIcon('balance')}
                    </th>
                    <th
                      className="px-4 py-2 cursor-pointer"
                      onClick={() => handleColumnSort('balanceUsd')}
                    >
                      Balance USD {renderSortIcon('balanceUsd')}
                    </th>
                    <th
                      className="px-4 py-2 cursor-pointer"
                      onClick={() => handleColumnSort('balanceEth')}
                    >
                      Balance ETH {renderSortIcon('balanceEth')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAssets.map((asset, index) => (
                    // I would build a more complex filter but this is just one thing to filter
                    // So this functions fine for now
                    selectedBlockchains.includes(asset.blockchain) &&
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                      <td className="px-4 py-2">{asset.blockchain}</td>
                      <td className="px-4 py-2">{asset.tokenName}</td>
                      <td className="px-4 py-2">{parseFloat(asset.balance).toFixed(6)} {asset.tokenSymbol}</td>
                      <td className="px-4 py-2">${parseFloat(asset.balanceUsd).toFixed(2)}</td>
                      <td className="px-4 py-2">{ ethPrice && `${(parseFloat(asset.balanceUsd)/ethPrice).toFixed(2)}`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>}
          <footer className='absolute bottom-2 text-gray-700'>
            Interview Problem By{' '}
            <UnderlineLink href='https://github.com/Sbphillips19'>
              Stephen Phillips
            </UnderlineLink>
          </footer>
        </div>
      </section>
    </main>
  );
}
