export type ChainOption = {
    label: string;
    value: string;
};

export const chainOptions: ChainOption[] = [
    { label: 'Arbitrum', value: 'arbitrum' },
    { label: 'Avalanche', value: 'avalanche' },
    { label: 'Base', value: 'base' },
    { label: 'BSC', value: 'bsc' },
    { label: 'Ethereum', value: 'eth' },
    { label: 'Fantom', value: 'fantom' },
    { label: 'Optimism', value: 'optimism' },
    { label: 'Polygon', value: 'polygon' },
    { label: 'Polygon ZkSync', value: 'polygon_zksync' },
    { label: 'Rollux', value: 'rollux' },
    { label: 'Syscoin', value: 'syscoin' },
    { label: 'ZkSync Era', value: 'zksync_era' },
    { label: 'Avalanche Fuji', value: 'avalanche_fuji' },
    { label: 'Ethereum Goerli', value: 'eth_goerli' },
    { label: 'Optimism Testnet', value: 'optimism_testnet' },
    { label: 'Polygon Mumbai', value: 'polygon_mumbai' },
];
