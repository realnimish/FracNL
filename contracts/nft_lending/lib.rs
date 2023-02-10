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
    pub type Time = u64;

    #[derive(scale::Encode, scale::Decode)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub struct LoanMetadata {
        borrower: AccountId,
        token_id: TokenId,
        shares_locked: Balance,
        amount_asked: Balance,
        security_deposit: Balance,
        loan_period: u128,
        listing_timestamp: Time,
    }

    #[derive(scale::Encode, scale::Decode)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub struct LoanStats {
        start_timestamp: Option<Time>,
        raised: Balance,
        limit_left: Balance,
        interest: Balance,
        repayed: Balance,
        loan_status: LoanStatus,
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

    #[derive(scale::Encode, scale::Decode, PartialEq)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub enum LoanStatus {
        OPEN,
        ACTIVE,
        CLOSED,
        CANCELLED,
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
        offer_phase_duration: Time,
        cooldown_phase_duration: Time,

        credit_score: Mapping<AccountId, u16>,
        loans: Mapping<LoanId, LoanMetadata>,
        loan_stats: Mapping<LoanId, LoanStats>,

        offers_nonce: Mapping<LoanId, OfferId>,
        offers: Mapping<(LoanId, OfferId), OfferMetadata>,
        active_offer_id: Mapping<(LoanId, AccountId), OfferId>,
    }

    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        InsufficientSecurityDeposit,
        FractionalNftTransferFailed,
        ActiveOfferAlreadyExists,
        ExcessiveLendingAmountSent,
        NotOfferPhase,
        NotCooldownPhase,
        NoOfferExists,
        WithdrawFailed,
        InvalidLoanId,
        InvalidOfferId,
        LoanIsNotOpen,
        NotAuthorized,
        ZeroValue,
    }

    impl Contract {
        /// Constructor that initializes the `bool` value to the given `init_value`.
        #[ink(constructor)]
        pub fn new(
            fractionalizer: AccountId,
            offer_phase_duration: Time,
            cooldown_phase_duration: Time,
        ) -> Self {
            Self {
                admin: Self::env().caller(),
                fractionalizer,
                loan_nonce: Default::default(),
                offer_phase_duration,
                cooldown_phase_duration,
                credit_score: Default::default(),
                loans: Default::default(),
                loan_stats: Default::default(),
                offers_nonce: Default::default(),
                offers: Default::default(),
                active_offer_id: Default::default(),
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

            ensure!(amount_asked > 0, Error::ZeroValue);

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
                security_deposit: transferred_value,
                loan_period,
                listing_timestamp: self.env().block_timestamp(),
            };

            let loan_stats = LoanStats {
                start_timestamp: None,
                raised: 0,
                limit_left: amount_asked,
                interest: 0,
                repayed: 0,
                loan_status: LoanStatus::OPEN,
            };

            self.loan_nonce += 1;
            self.loans.insert(&self.loan_nonce, &loan_metadata);
            self.loan_stats.insert(&self.loan_nonce, &loan_stats);

            Ok(self.loan_nonce)
        }

        #[ink(message)]
        pub fn start_loan(&mut self, loan_id: LoanId) -> Result<()> {
            let caller = self.env().caller();
            let loan_metadata = self.ref_get_loan_metadata(&loan_id)?;
            let mut loan_stats = self.ref_get_loan_stats(&loan_id)?;

            ensure!(caller == loan_metadata.borrower, Error::NotAuthorized);
            ensure!(
                loan_stats.loan_status == LoanStatus::OPEN,
                Error::LoanIsNotOpen
            );

            loan_stats.start_timestamp = Some(self.env().block_timestamp());
            loan_stats.loan_status = LoanStatus::ACTIVE;
            self.loan_stats.insert(&loan_id, &loan_stats);

            if self.env().transfer(caller, loan_stats.raised).is_err() {
                return Err(Error::WithdrawFailed);
            }

            // Reject all the PENDING offers
            self.reject_all_pending_offers(loan_id)?;

            Ok(())
        }

        #[ink(message)]
        pub fn cancel_loan(&mut self, loan_id: LoanId) -> Result<()> {
            let caller = self.env().caller();
            let loan_metadata = self.ref_get_loan_metadata(&loan_id)?;
            let mut loan_stats = self.ref_get_loan_stats(&loan_id)?;

            ensure!(caller == loan_metadata.borrower, Error::NotAuthorized);
            ensure!(
                loan_stats.loan_status == LoanStatus::OPEN,
                Error::LoanIsNotOpen
            );

            let loan_metadata = self.ref_get_loan_metadata(&loan_id)?;

            let cancellation_charges = self.get_cancellation_charges();
            let amount = loan_metadata
                .security_deposit
                .saturating_sub(cancellation_charges);

            if amount > 0 && self.env().transfer(caller, amount).is_err() {
                return Err(Error::WithdrawFailed);
            }

            // Reject all the offers
            self.ref_reject_all_offers(&loan_id)?;

            loan_stats.loan_status = LoanStatus::CANCELLED;
            self.loan_stats.insert(&loan_id, &loan_stats);

            Ok(())
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

            let loan_metadata = self.ref_get_loan_metadata(&loan_id)?;
            let mut loan_stats = self.ref_get_loan_stats(&loan_id)?;

            self.ref_is_offer_phase(&loan_metadata, &loan_stats)?;

            ensure!(
                !self.active_offer_id.contains((loan_id, caller)),
                Error::ActiveOfferAlreadyExists
            );
            ensure!(
                amount <= loan_stats.limit_left,
                Error::ExcessiveLendingAmountSent,
            );

            let offer_id = self.get_offer_nonce_or_default(&loan_id);
            let offer = OfferMetadata {
                lender: caller,
                amount,
                interest,
                status: OfferStatus::PENDING,
            };

            self.active_offer_id.insert(&(loan_id, caller), &offer_id);
            self.offers.insert(&(loan_id, offer_id), &offer);
            self.offers_nonce.insert(&loan_id, &(offer_id + 1));

            loan_stats.raised += amount;
            loan_stats.limit_left -= amount;
            loan_stats.interest += interest;

            // TODO if limit_left becomes 0 => start the loan

            self.loan_stats.insert(&loan_id, &loan_stats);

            Ok(offer_id)
        }

        #[ink(message)]
        pub fn withdraw_offer(&mut self, loan_id: LoanId) -> Result<OfferId> {
            let caller = self.env().caller();
            let loan_metadata = self.ref_get_loan_metadata(&loan_id)?;
            let loan_stats = self.ref_get_loan_stats(&loan_id)?;

            self.ref_is_offer_phase(&loan_metadata, &loan_stats)?;

            let offer_id = self.ref_get_active_offer_id(&loan_id, &caller)?;
            let mut offer = self.ref_get_offer_details(&loan_id, &offer_id)?;

            // @discuss: Should we deduct some handling fee to avoid spam
            if self.env().transfer(caller, offer.amount).is_err() {
                return Err(Error::WithdrawFailed);
            }

            offer.status = OfferStatus::WITHDRAWN;
            self.offers.insert(&(loan_id, offer_id), &offer);
            self.active_offer_id.remove(&(loan_id, caller));

            Ok(offer_id)
        }

        #[ink(message)]
        pub fn respond_to_offer(&mut self, _loan_id: LoanId, _offer_id: OfferId) -> Result<()> {
            unimplemented!()
        }

        #[ink(message)]
        pub fn get_offer_nonce(&self, loan_id: LoanId) -> OfferId {
            self.get_offer_nonce_or_default(&loan_id)
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
        pub fn is_offer_phase(&self, loan_id: LoanId) -> Result<()> {
            let loan_metadata = self.ref_get_loan_metadata(&loan_id)?;
            let loan_stats = self.ref_get_loan_stats(&loan_id)?;
            self.ref_is_offer_phase(&loan_metadata, &loan_stats)
        }

        #[ink(message)]
        pub fn is_cooldown_phase(&self, loan_id: LoanId) -> Result<()> {
            let loan_metadata = self.ref_get_loan_metadata(&loan_id)?;
            let loan_stats = self.ref_get_loan_stats(&loan_id)?;
            self.ref_is_cooldown_phase(&loan_metadata, &loan_stats)
        }

        #[ink(message)]
        pub fn get_max_lend_amt(&self, loan_id: LoanId) -> Result<Balance> {
            let stats = self.ref_get_loan_stats(&loan_id)?;
            Ok(stats.limit_left)
        }

        #[ink(message)]
        pub fn get_loan_metadata(&self, loan_id: LoanId) -> Result<LoanMetadata> {
            self.ref_get_loan_metadata(&loan_id)
        }

        #[ink(message)]
        pub fn get_loan_stats(&self, loan_id: LoanId) -> Result<LoanStats> {
            self.ref_get_loan_stats(&loan_id)
        }

        #[ink(message)]
        pub fn reject_all_pending_offers(&self, _loan_id: LoanId) -> Result<()> {
            unimplemented!()
        }

        #[ink(message)]
        pub fn get_cancellation_charges(&self) -> Balance {
            unimplemented!()
        }

        // HELPER FUNCTIONS

        fn get_offer_nonce_or_default(&self, loan_id: &LoanId) -> OfferId {
            self.offers_nonce.get(loan_id).unwrap_or(0)
        }

        fn ref_get_loan_metadata(&self, loan_id: &LoanId) -> Result<LoanMetadata> {
            self.loans.get(loan_id).ok_or(Error::InvalidLoanId)
        }

        fn ref_get_loan_stats(&self, loan_id: &LoanId) -> Result<LoanStats> {
            self.loan_stats.get(loan_id).ok_or(Error::InvalidLoanId)
        }

        fn ref_is_offer_phase(
            &self,
            loan_metadata: &LoanMetadata,
            loan_stats: &LoanStats,
        ) -> Result<()> {
            ensure!(
                loan_stats.loan_status == LoanStatus::OPEN,
                Error::NotOfferPhase
            );

            let current_time = self.env().block_timestamp();

            ensure!(
                current_time <= loan_metadata.listing_timestamp + self.offer_phase_duration,
                Error::NotOfferPhase
            );
            Ok(())
        }

        fn ref_is_cooldown_phase(
            &self,
            loan_metadata: &LoanMetadata,
            loan_stats: &LoanStats,
        ) -> Result<()> {
            ensure!(
                loan_stats.loan_status == LoanStatus::OPEN,
                Error::NotOfferPhase
            );

            let current_time = self.env().block_timestamp();
            let offer_duration = loan_metadata.listing_timestamp + self.offer_phase_duration;
            let cooldown_duration = offer_duration + self.cooldown_phase_duration;

            ensure!(
                offer_duration < current_time && current_time <= cooldown_duration,
                Error::NotCooldownPhase
            );
            Ok(())
        }

        fn ref_get_active_offer_id(&self, loan_id: &LoanId, caller: &AccountId) -> Result<OfferId> {
            self.active_offer_id
                .get((loan_id, caller))
                .ok_or(Error::NoOfferExists)
        }

        fn ref_get_offer_details(
            &self,
            loan_id: &LoanId,
            offer_id: &OfferId,
        ) -> Result<OfferMetadata> {
            self.offers
                .get((loan_id, offer_id))
                .ok_or(Error::InvalidOfferId)
        }
    
        fn ref_reject_all_offers(&mut self, _loan_id: &LoanId) -> Result<()> {
            unimplemented!()
        }
    }
}
