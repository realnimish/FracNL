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

        #[ink(message, payable)]
        pub fn list_advertisement(
            &mut self,
            token_id: TokenId,
            shares_to_lock: Balance,
            amount_asked: Balance,
            loan_period: u128,
        ) -> Result<ListingId> {
            let caller = self.env().caller();

            // Ensure sufficient security-deposit is transferred
            let required_deposit = self.get_collateral_required(caller, amount_asked, loan_period);

            let transferred_value = self.env().transferred_value();
            ensure!(
                transferred_value >= required_deposit,
                Error::InsufficientSecurityDeposit
            );

            // Lock the shares of the token (safe_transfer_from)
            // @dev This is disabled during tests due to the use of `invoke_contract()` not being
            // supported (tests end up panicking).
            #[cfg(not(test))]
            {
                use ink::env::call::{build_call, ExecutionInput, Selector};

                const SAFE_TRANSFER_FROM_SELECTOR: [u8; 4] = [0x0B, 0x39, 0x6F, 0x18];
                let result = build_call::<Environment>()
                    .call(self.fractionalizer)
                    .exec_input(
                        ExecutionInput::new(Selector::new(SAFE_TRANSFER_FROM_SELECTOR))
                            .push_arg(caller)
                            .push_arg(self.env().account_id())
                            .push_arg(token_id)
                            .push_arg(shares_to_lock)
                            .push_arg::<Vec<u8>>(vec![]),
                    )
                    .returns::<core::result::Result<(), u32>>()
                    .params()
                    .invoke();

                ensure!(result.is_ok(), Error::FractionalNftTransferFailed);
            }

            let listing_metadata = ListingMetadata {
                borrower: caller,
                token_id,
                shares_locked: shares_to_lock,
                amount_asked,
                loan_period,
                listing_timestamp: self.env().block_timestamp(),
            };

            self.listing_nonce += 1;
            self.listing.insert(&self.listing_nonce, &listing_metadata);

            Ok(self.listing_nonce)
        }

        #[ink(message)]
        pub fn get_collateral_required(
            &self,
            _account: AccountId,
            _borrow_amount: Balance,
            _loan_period: u128,
        ) -> Balance {
            unimplemented!()
        }
    }
}
