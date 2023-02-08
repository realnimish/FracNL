#![cfg_attr(not(feature = "std"), no_std)]

/// Evaluate `$x:expr` and if not true return `Err($y:expr)`.
///
/// Used as `ensure!(expression_to_ensure, expression_to_return_on_false)`.
macro_rules! ensure {
    ( $condition:expr, $error:expr $(,)? ) => {{
        if !$condition {
            return ::core::result::Result::Err(::core::convert::Into::into($error));
        }
    }};
}

#[ink::contract]
mod nft_lending {
    use ink::prelude::vec;
    use ink::prelude::vec::Vec;
    use ink::storage::Mapping;

    pub type Result<T> = core::result::Result<T, Error>;
    pub type TokenId = u32;
    pub type ListingId = u128;
    pub type OfferId = u128;

    #[derive(scale::Encode, scale::Decode)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    struct ListingMetadata {
        borrower: AccountId,
        token_id: TokenId,
        shares_locked: Balance,
        amount_asked: Balance,
        loan_period: u128,
        listing_timestamp: u64,
    }

    #[derive(scale::Encode, scale::Decode)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub struct OfferMetadata {
        lender: AccountId,
        amount: Balance,
        interest: u16,
        status: OfferStatus,
    }

    #[derive(scale::Encode, scale::Decode)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub enum OfferStatus {
        PENDING,
        ACCEPTED,
        REJECTED,
        WITHDRAWN,
    }

    #[ink(storage)]
    pub struct Contract {
        // Global state variables
        admin: AccountId,
        fractionalizer: AccountId,
        listing_nonce: ListingId,

        credit_score: Mapping<AccountId, u16>,
        listing: Mapping<ListingId, ListingMetadata>,

        offers_nonce: Mapping<ListingId, OfferId>,
        offers: Mapping<(ListingId, OfferId), OfferMetadata>,
        active_offer: Mapping<(ListingId, AccountId), OfferId>,
    }

    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        InsufficientSecurityDeposit,
        FractionalNftTransferFailed,
    }

    impl Contract {
        /// Constructor that initializes the `bool` value to the given `init_value`.
        #[ink(constructor)]
        pub fn new(fractionalizer: AccountId) -> Self {
            Self {
                admin: Self::env().caller(),
                fractionalizer,
                listing_nonce: Default::default(),
                credit_score: Default::default(),
                listing: Default::default(),
                offers_nonce: Default::default(),
                offers: Default::default(),
                active_offer: Default::default(),
            }
        }

}
