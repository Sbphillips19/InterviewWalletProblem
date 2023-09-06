# WALLET APPLICATION

User can enter their wallet and see all of their tokens across all chains supported by ANKR

Users can sort by all headers- blockchain, token name, balance, balance usd, balance eth

Users can filter by the chains once all the data is pulled down


# SETUP

In the interest of time the project was started via this- https://github.com/theodorusclarence/ts-nextjs-tailwind-starter

The only component created is Input.tsx - I used chatGPT to save me time on this section, although it's not perfect was able to create based off the other components quicker

Other dependencies- react-select for chains- this is my first time using this, but it was super smooth to integrate

# FUTURE ADDITIONS

Can select the specific coins that they want the value shown in
   I wasn't sure if this was the intention?
      If this is the case- users can put in a contract address and chain and then use the same ETH pricing api with those passed in
      Frontend would reflect these changes also, but it would be a 5 minute add

Total wallet value- already included in the API

Actually cleanup the repo and strip everything out that isn't being used