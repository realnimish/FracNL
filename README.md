# FracNL (Fractional NFT Lending)

FracNL [(https://fracnl.vercel.app)](https://fracnl.vercel.app) is a DeFi NFT lending platform where borrowers can lock some fraction of their NFTs as collateral and multiple users can participate as lender against any given listing.  
The platform maintains a credit score system for borrowers and requires them to submit some additional tokens (amount based on their credit score) as security during the listing. The security is used to pay the lenders incase of a default, otherwise it goes to the platform as fees if the loan is executed.  
The borrower doesn't lose complete ownership of their collateral in case the loan is defaulted, they get back some amount of their locked shares back based on the percentage of principal amount returned (only after full interest is paid within the loan period).

## Project Flow

### Borrowers' user flow

![borrower-user-flow](./user_flow_borrower.png)

### Lenders' user flow

![lender-user-flow](./user_flow_lender.png)

## Economic Model

* Borrowers pays a security fee during loan listing, This value depends on the loan-amount, loan-period, & credit score.
* If the loan is cancelled, Platform charges a flat cancellation fee and remaining collateral is released.
* If the loan is executed, The security fee is used as a collateral in case of default and the remaining amount is charged as the platform handling fees.
* A credit score is maintained which tells the lender about the borrowers' creditability and impacts the security fee charged during loan listing.

## Novelty/Originality
  
* FracNL provides one of a kind lending platform for fractional NFTs
* Multiple lenders can jointly lend in a single listing with their own expected returns.
* Borrower doesn't lose complete ownership of their collateral on partial repayment of principal loan.

## Technical complexity

There are three contracts in our project:

* NFT contract (ERC721 compliant):
A demo erc721 contract which accepts URI field during mint.

* NFT Fractionalizer contract (ERC1155 compliant):
The contract allows to fractionalize multiple NFTs in a single contract because of the ERC1155 standard. The contract additionally implements `fractionalizer`, `defractionalizer`and `total_supply`.

* NFT Lending contract (supports ERC1155TokenReceiver):
This is the main contract which deals with loan creation, offer management & loan settlement.

We need to use low-level call-builder to do cross-contract calls as there were events in all the contracts so we couldn't directly include the depenedant contract in the other one.

## Daily/mass usability

Our project widens the scope of DeFi with the introduction of fractional NFT lending with unique features like 1-to-many relation between borrower and lenders, collateral protection for borrowers on partial repayment; protection of lenders on loan default.

The platform can possibly be extended to allow lenders to access/rent the locked collateral during the loan period and benefit from the given NFT's utility (e.g. equipable game items).

## Impact of project

* The project is build using ink v4 which utilises both NFT & DeFi specs. It also makes use of advance feature like low-level cross-contract calls. Therefore, We believe that our project will act as a great source of reference for future builders and projects utilizing the given tech stack.

* Never seen before features(1-to-many relation, borrower protection) have been introduced in our F-NFT Lending platform.

* Develop the NFT & DeFi space in the polkadot ecosystem

## Future work

* **Heterogeneous F-NFT as collateral:** Borrower can provide multiple fracional NFTs in different proportions as collateral for loan.

* **Improve credit score function:** Formulating better credit score function to evaluate borrowers' credit line.

* Incorporate the following features in frontend:

    * Refine the frontend & Improve the UX.
    * Search and sort feature for finding listed loans.
    * Add off-chain notification system to notify users on updates.
    * Improved analytics

    and many more???

* Support **PSP-34** and **PSP-37** standards.

## Tech Stack

* Ink! v4.0 smart contract
* PolkadotJS library
* React
* MUI (Material UI)

## Deployment 

Link : [https://fracnl.vercel.app](https://fracnl.vercel.app)

## Pitch Video

Link: [Video](https://www.youtube.com/watch?v=<TODO>)

## Team Members

1. Nimish Agrawal - realnimish@gmail.com

2. Sayan Kar - sayankar1308@gmail.com

3. Soumyajit Deb - debsoumyajit100@gmail.com
