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
    pub type LoanId = u128;
    pub type OfferId = u128;

    #[derive(scale::Encode, scale::Decode)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    struct LoanMetadata {
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
        interest: Balance,
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
        loan_nonce: LoanId,

        credit_score: Mapping<AccountId, u16>,
        loans: Mapping<LoanId, LoanMetadata>,

        offers_nonce: Mapping<LoanId, OfferId>,
        offers: Mapping<(LoanId, OfferId), OfferMetadata>,
        active_offer: Mapping<(LoanId, AccountId), OfferId>,
    }

    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        InsufficientSecurityDeposit,
        FractionalNftTransferFailed,
        NotAcceptingNewOffer,
        ActiveOfferAlreadyExists,
        ExcessiveLendingAmountSent,
    }

    impl Contract {
        /// Constructor that initializes the `bool` value to the given `init_value`.
        #[ink(constructor)]
        pub fn new(fractionalizer: AccountId) -> Self {
            Self {
                admin: Self::env().caller(),
                fractionalizer,
                loan_nonce: Default::default(),
                credit_score: Default::default(),
                loans: Default::default(),
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
        ) -> Result<LoanId> {
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

            let loan_metadata = LoanMetadata {
                borrower: caller,
                token_id,
                shares_locked: shares_to_lock,
                amount_asked,
                loan_period,
                listing_timestamp: self.env().block_timestamp(),
            };

            self.loan_nonce += 1;
            self.loans.insert(&self.loan_nonce, &loan_metadata);

            Ok(self.loan_nonce)
        }

        #[ink(message)]
        pub fn start_loan(&mut self, _loan_id: LoanId) -> Result<()> {
            unimplemented!()
        }

        #[ink(message)]
        pub fn cancel_loan(&mut self, _loan_id: LoanId) -> Result<()> {
            unimplemented!()
        }

        #[ink(message)]
        pub fn repay_loan(&mut self, _loan_id: LoanId) -> Result<()> {
            unimplemented!()
        }

        #[ink(message)]
        pub fn default_loan(&mut self, _loan_id: LoanId) -> Result<()> {
            unimplemented!()
        }

        #[ink(message, payable)]
        pub fn make_offer(&mut self, loan_id: LoanId, interest: Balance) -> Result<OfferId> {
            let caller = self.env().caller();
            let amount = self.env().transferred_value();

            ensure!(
                self.is_accepting_offer(loan_id),
                Error::NotAcceptingNewOffer
            );
            ensure!(
                !self.active_offer.contains((loan_id, caller)),
                Error::ActiveOfferAlreadyExists
            );
            ensure!(
                amount <= self.get_max_lend_amt(loan_id),
                Error::ExcessiveLendingAmountSent,
            );

            let offer_id = self.get_offer_nonce(loan_id);
            let offer = OfferMetadata {
                lender: caller,
                amount,
                interest,
                status: OfferStatus::PENDING,
            };

            self.active_offer.insert(&(loan_id, caller), &offer_id);
            self.offers.insert(&(loan_id, offer_id), &offer);
            self.offers_nonce.insert(&loan_id, &(offer_id + 1));

            Ok(offer_id)
        }

        #[ink(message)]
        pub fn withdraw_offer(&mut self, _loan_id: LoanId) -> Result<OfferId> {
            unimplemented!()
        }

        #[ink(message)]
        pub fn respond_to_offer(&mut self, _loan_id: LoanId, _offer_id: OfferId) -> Result<()> {
            unimplemented!()
        }

        #[ink(message)]
        pub fn get_offer_nonce(&self, loan_id: LoanId) -> OfferId {
            self.offers_nonce.get(&loan_id).unwrap_or(0)
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

        #[ink(message)]
        pub fn is_accepting_offer(&self, _loan_id: LoanId) -> bool {
            unimplemented!()
        }

        #[ink(message)]
        pub fn get_max_lend_amt(&self, _loan_id: LoanId) -> Balance {
            unimplemented!()
        }
    }
}
