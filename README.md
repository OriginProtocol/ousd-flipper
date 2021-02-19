# OSUD Flipper

The flipper provides a cheap way to swap OUSD and stablecoins 1:1.

This is a quick dirty UI for the flipper.


### Local testing 

To develop

    yarn install
    yarn run dev

For a forked local sandbox, use a brownie fork console you have laying around, and:

    TEST_USER = '0x555C7B993e988700a82b31ea9a430A9b4A032812'

    USDT = '0xdAC17F958D2ee523a2206206994597C13D831ec7'
    USDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
    DAI = '0x6b175474e89094c44da98b954eedeac495271d0f'
    OUSD = '0x2A8e1E676Ec238d8A992307B495b45B3fEAa5e86'
    FLIPPER = '0xcecaD69d7D4Ed6D52eFcFA028aF8732F27e08F70'
    BINANCE = '0xbe0eb53f46cd790cd13851d5eff43d12404d33e8'

    ousd = Contract.from_explorer(OUSD)
    usdt = Contract.from_explorer(USDT)
    usdc = Contract.from_explorer(USDC)
    dai = Contract.from_explorer(DAI)
    flipper = Contract.from_explorer(FLIPPER)


    dai.transfer(TEST_USER, int(1000 * int(1e18)), {'from': BINANCE})
    usdt.transfer(TEST_USER, int(1000 * int(1e6)), {'from': BINANCE})
    usdc.transfer(TEST_USER, int(1000 * int(1e6)), {'from': BINANCE})
    accounts[0].transfer(TEST_USER, int(10 * int(1e18)))
