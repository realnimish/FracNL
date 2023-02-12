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
    pub type CreditScore = u16;
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
        loan_period: Time,
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
        repaid: Balance,
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

    #[derive(scale::Encode, scale::Decode, PartialEq)]
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
        time_factor: Time,

        credit_score: Mapping<AccountId, CreditScore>,
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
        LoanIsNotActive,
        LoanHasNotExpired,
        LoanHasExpired,
        LoanRepaymentPeriodAlreadyOver,
        NotAuthorized,
        ZeroValue,
        OfferNotInPendingState,
        LoanLimitExceeding,
        OfferIsNotAccepted,
    }

    impl Contract {
        /// Constructor that initializes the `bool` value to the given `init_value`.
        #[ink(constructor)]
        pub fn new(
            fractionalizer: AccountId,
            offer_phase_duration: Time,
            cooldown_phase_duration: Time,
            time_factor: Time,
        ) -> Self {
            let time_factor = match time_factor {
                0 => 1,
                _ => time_factor,
            };

            Self {
                admin: Self::env().caller(),
                fractionalizer,
                loan_nonce: Default::default(),
                offer_phase_duration,
                cooldown_phase_duration,
                time_factor,
                credit_score: Default::default(),
                loans: Default::default(),
                loan_stats: Default::default(),
                offers_nonce: Default::default(),
                offers: Default::default(),
                active_offer_id: Default::default(),
            }
        }

        /// This contract supportz receiving single ERC1155 token transfer
        #[ink(message, selector = 0xF23A6E61)]
        pub fn signal_erc1155_support(
            &mut self,
            operator: AccountId,
            _from: AccountId,
            _token_id: TokenId,
            _value: Balance,
            _data: Vec<u8>,
        ) -> Vec<u8> {
            assert!(operator == self.env().account_id());
            [0xF2, 0x3A, 0x6E, 0x61].to_vec()
        }

        #[ink(message, payable)]
        pub fn list_advertisement(
            &mut self,
            token_id: TokenId,
            shares_to_lock: Balance,
            amount_asked: Balance,
            loan_period: Time,
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
            self.transfer_fractional_nft(
                &caller,
                &self.env().account_id(),
                &token_id,
                &shares_to_lock,
            )?;

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
                repaid: 0,
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
            ensure!(loan_stats.raised > 0, Error::ZeroValue);

            let time = self.env().block_timestamp();
            let cooldown_time = loan_metadata.listing_timestamp
                + self.offer_phase_duration
                + self.cooldown_phase_duration;
            ensure!(time <= cooldown_time, Error::LoanHasExpired);

            self.ref_start_loan(&loan_id, &mut loan_stats, &caller)
        }

        #[ink(message)]
        pub fn cancel_loan(&mut self, loan_id: LoanId) -> Result<()> {
            let caller = self.env().caller();
            let loan_metadata = self.ref_get_loan_metadata(&loan_id)?;
            let mut loan_stats = self.ref_get_loan_stats(&loan_id)?;

            let time = self.env().block_timestamp();
            let cooldown_time = loan_metadata.listing_timestamp
                + self.offer_phase_duration
                + self.cooldown_phase_duration;

            // If the cooldown_time has not elapsed, only the borrower can cancel the loan
            ensure!(
                time > cooldown_time || caller == loan_metadata.borrower,
                Error::NotAuthorized
            );
            ensure!(
                loan_stats.loan_status == LoanStatus::OPEN,
                Error::LoanIsNotOpen
            );

            let loan_metadata = self.ref_get_loan_metadata(&loan_id)?;

            let cancellation_charges = self.get_cancellation_charges();
            let amount = loan_metadata
                .security_deposit
                .saturating_sub(cancellation_charges);

            if amount > 0 && self.env().transfer(loan_metadata.borrower, amount).is_err() {
                return Err(Error::WithdrawFailed);
            }

            // Reject all the offers
            self.ref_reject_all_offers(&loan_id)?;

            // Unlock the shares
            self.transfer_fractional_nft(
                &self.env().account_id(),
                &loan_metadata.borrower,
                &loan_metadata.token_id,
                &loan_metadata.shares_locked,
            )?;

            loan_stats.loan_status = LoanStatus::CANCELLED;
            self.loan_stats.insert(&loan_id, &loan_stats);

            Ok(())
        }

        #[ink(message, payable)]
        pub fn repay_loan(&mut self, loan_id: LoanId) -> Result<()> {
            let loan_metadata = self.ref_get_loan_metadata(&loan_id)?;
            let mut loan_stats = self.ref_get_loan_stats(&loan_id)?;

            ensure!(
                loan_stats.loan_status == LoanStatus::ACTIVE,
                Error::LoanIsNotActive
            );

            let time = self.env().block_timestamp();
            let loan_expiry = loan_stats.start_timestamp.unwrap() + loan_metadata.loan_period;
            ensure!(time <= loan_expiry, Error::LoanRepaymentPeriodAlreadyOver);

            loan_stats.repaid += self.env().transferred_value();

            if loan_stats.repaid >= loan_stats.raised + loan_stats.interest {
                self.ref_settle_loan(&loan_id, &loan_metadata, &loan_stats)?;
                self.inc_credit_score(&loan_metadata.borrower);
                loan_stats.loan_status = LoanStatus::CLOSED;
            }

            self.loan_stats.insert(&loan_id, &loan_stats);
            Ok(())
        }

        #[ink(message)]
        pub fn claim_loan_default(&mut self, loan_id: LoanId) -> Result<()> {
            let loan_metadata = self.ref_get_loan_metadata(&loan_id)?;
            let mut loan_stats = self.ref_get_loan_stats(&loan_id)?;

            ensure!(
                loan_stats.loan_status == LoanStatus::ACTIVE,
                Error::LoanIsNotActive
            );

            let time = self.env().block_timestamp();
            let loan_expiry = loan_stats.start_timestamp.unwrap() + loan_metadata.loan_period;
            ensure!(time > loan_expiry, Error::LoanHasNotExpired);

            self.ref_settle_loan(&loan_id, &loan_metadata, &loan_stats)?;
            self.dec_credit_score(&loan_metadata.borrower);
            loan_stats.loan_status = LoanStatus::CLOSED;
            self.loan_stats.insert(&loan_id, &loan_stats);
            Ok(())
        }

        #[ink(message, payable)]
        pub fn make_offer(&mut self, loan_id: LoanId, interest: Balance) -> Result<OfferId> {
            let caller = self.env().caller();
            let amount = self.env().transferred_value();
            ensure!(amount > 0, Error::ZeroValue);

            let loan_metadata = self.ref_get_loan_metadata(&loan_id)?;
            let loan_stats = self.ref_get_loan_stats(&loan_id)?;

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

            ensure!(
                offer.status == OfferStatus::PENDING,
                Error::OfferNotInPendingState
            );

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
        pub fn respond_to_offer(
            &mut self,
            loan_id: LoanId,
            offer_id: OfferId,
            response: bool,
        ) -> Result<()> {
            let caller = self.env().caller();
            let loan_metadata = self.ref_get_loan_metadata(&loan_id)?;
            let mut loan_stats = self.ref_get_loan_stats(&loan_id)?;

            ensure!(caller == loan_metadata.borrower, Error::NotAuthorized);
            ensure!(
                loan_stats.loan_status == LoanStatus::OPEN,
                Error::LoanIsNotOpen
            );

            let time = self.env().block_timestamp();
            let cooldown_time = loan_metadata.listing_timestamp
                + self.offer_phase_duration
                + self.cooldown_phase_duration;
            ensure!(time <= cooldown_time, Error::LoanHasExpired);

            let mut offer = self.ref_get_offer_details(&loan_id, &offer_id)?;
            ensure!(
                offer.status == OfferStatus::PENDING,
                Error::OfferNotInPendingState
            );

            match response {
                false => self.ref_reject_offer(&loan_id, &offer_id, &mut offer)?,
                true => {
                    ensure!(
                        offer.amount <= loan_stats.limit_left,
                        Error::LoanLimitExceeding
                    );
                    offer.status = OfferStatus::ACCEPTED;
                    self.offers.insert(&(loan_id, offer_id), &offer);

                    loan_stats.raised += offer.amount;
                    loan_stats.limit_left -= offer.amount;
                    loan_stats.interest += offer.interest;

                    if loan_stats.limit_left == 0 {
                        self.ref_start_loan(&loan_id, &mut loan_stats, &caller)?
                    } else {
                        self.loan_stats.insert(&loan_id, &loan_stats);
                    }
                }
            }

            Ok(())
        }

        #[ink(message)]
        pub fn get_offer_nonce(&self, loan_id: LoanId) -> OfferId {
            self.get_offer_nonce_or_default(&loan_id)
        }

        #[ink(message)]
        pub fn get_collateral_required(
            &self,
            account: AccountId,
            borrow_amount: Balance,
            loan_period: Time,
        ) -> Balance {
            let credit_score = self.get_credit_score_or_default(&account);
            if credit_score < 100 {
                return borrow_amount;
            }

            const DECIMALS: Balance = 10000;
            const PER_DAY_CHARGE: Balance = 1; // 1/10000 unit => 0.01% per day
            let day = 86400 * self.time_factor as u128;

            let borrow_percent: Balance = (100 * (4000 - 3 * credit_score) / credit_score).into();
            let period_percent = (loan_period as u128) * PER_DAY_CHARGE / day;

            // @discuss: Should we put an upper bound on it?
            let total_percent = borrow_percent + period_percent;

            let security = borrow_amount * total_percent / DECIMALS;
            security
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
        pub fn reject_all_pending_offers(&mut self, loan_id: LoanId) -> Result<()> {
            let total_offers = self.get_offer_nonce_or_default(&loan_id);

            for offer_id in 0..total_offers {
                let mut offer = self.ref_get_offer_details(&loan_id, &offer_id)?;
                if offer.status == OfferStatus::PENDING {
                    self.ref_reject_offer(&loan_id, &offer_id, &mut offer)?;
                }
            }
            Ok(())
        }

        #[ink(message)]
        pub fn get_cancellation_charges(&self) -> Balance {
            let decimals = 6;
            let charges = 1;

            charges * 10_u128.pow(decimals)
        }

        // Just for testing purposes
        #[ink(message)]
        pub fn drain_funds(&mut self, to: AccountId, amount: Balance) -> Result<()> {
            let caller = self.env().caller();
            ensure!(caller == self.admin, Error::NotAuthorized);
            ensure!(
                self.env().transfer(to, amount).is_ok(),
                Error::WithdrawFailed
            );
            Ok(())
        }

        #[ink(message)]
        pub fn get_borrowers_settlement(&self, loan_id: LoanId) -> Result<Balance> {
            let loan_metadata = self.ref_get_loan_metadata(&loan_id)?;
            let loan_stats = self.ref_get_loan_stats(&loan_id)?;

            let time = self.env().block_timestamp();
            let loan_expiry = loan_stats.start_timestamp.ok_or(Error::LoanIsNotActive)?
                + loan_metadata.loan_period;
            match loan_stats.loan_status {
                LoanStatus::CLOSED => (),
                LoanStatus::ACTIVE if time > loan_expiry => (),
                _ => Err(Error::LoanHasNotExpired)?,
            };

            let res = self.ref_get_borrower_settlement(&loan_stats, &loan_metadata.shares_locked);
            Ok(res)
        }

        #[ink(message)]
        pub fn get_lenders_settlement(
            &self,
            loan_id: LoanId,
            offer_id: OfferId,
        ) -> Result<(Balance, Balance)> {
            let loan_metadata = self.ref_get_loan_metadata(&loan_id)?;
            let loan_stats = self.ref_get_loan_stats(&loan_id)?;
            let borrower_unlocked_shares =
                self.ref_get_borrower_settlement(&loan_stats, &loan_metadata.shares_locked);

            let offer = self.ref_get_offer_details(&loan_id, &offer_id)?;
            ensure!(
                offer.status == OfferStatus::ACCEPTED,
                Error::OfferIsNotAccepted
            );

            let time = self.env().block_timestamp();
            let loan_expiry = loan_stats.start_timestamp.ok_or(Error::LoanIsNotActive)?
                + loan_metadata.loan_period;
            match loan_stats.loan_status {
                LoanStatus::CLOSED => (),
                LoanStatus::ACTIVE if time > loan_expiry => (),
                _ => Err(Error::LoanHasNotExpired)?,
            };

            let res = self.ref_get_lender_settlement(
                &loan_metadata,
                &loan_stats,
                &offer,
                &borrower_unlocked_shares,
            );
            Ok(res)
        }

        #[ink(message)]
        pub fn get_credit_score(&self, account: AccountId) -> CreditScore {
            self.get_credit_score_or_default(&account)
        }

        // HELPER FUNCTIONS

        fn get_credit_score_or_default(&self, account: &AccountId) -> CreditScore {
            self.credit_score.get(account).unwrap_or(500)
        }

        fn inc_credit_score(&mut self, account: &AccountId) {
            let mut credit_score = self.get_credit_score_or_default(account);
            credit_score += 20;
            if credit_score > 1000 {
                credit_score = 1000;
            }
            self.credit_score.insert(&account, &credit_score);
        }

        fn dec_credit_score(&mut self, account: &AccountId) {
            let credit_score = self.get_credit_score_or_default(account);
            let credit_score = credit_score.saturating_sub(100);
            self.credit_score.insert(&account, &credit_score);
        }

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

        fn ref_reject_all_offers(&mut self, loan_id: &LoanId) -> Result<()> {
            let total_offers = self.get_offer_nonce_or_default(loan_id);

            for offer_id in 0..total_offers {
                let mut offer = self.ref_get_offer_details(loan_id, &offer_id)?;
                match offer.status {
                    OfferStatus::PENDING | OfferStatus::ACCEPTED => {
                        self.ref_reject_offer(&loan_id, &offer_id, &mut offer)?
                    }
                    _ => (),
                };
            }
            Ok(())
        }

        fn ref_reject_offer(
            &mut self,
            loan_id: &LoanId,
            offer_id: &OfferId,
            offer: &mut OfferMetadata,
        ) -> Result<()> {
            if self.env().transfer(offer.lender, offer.amount).is_err() {
                return Err(Error::WithdrawFailed);
            }

            offer.status = OfferStatus::REJECTED;
            self.active_offer_id.remove((loan_id, offer.lender));
            self.offers.insert((loan_id, offer_id), offer);
            Ok(())
        }

        // @dev Doesn't do any check
        fn ref_start_loan(
            &mut self,
            loan_id: &LoanId,
            loan_stats: &mut LoanStats,
            borrower: &AccountId,
        ) -> Result<()> {
            loan_stats.start_timestamp = Some(self.env().block_timestamp());
            loan_stats.loan_status = LoanStatus::ACTIVE;
            self.loan_stats.insert(loan_id, loan_stats);

            if self.env().transfer(*borrower, loan_stats.raised).is_err() {
                return Err(Error::WithdrawFailed);
            }

            // Reject all the PENDING offers
            self.reject_all_pending_offers(*loan_id)?;

            Ok(())
        }

        fn ref_get_borrower_settlement(
            &self,
            loan_stats: &LoanStats,
            shares_locked: &Balance,
        ) -> Balance {
            if loan_stats.raised == 0u128 {
                return *shares_locked;
            }

            let mut principal_repaid = loan_stats.repaid.saturating_sub(loan_stats.interest);

            // User could have over-paid the loan amount
            if loan_stats.raised < principal_repaid {
                principal_repaid = loan_stats.raised;
            }

            let shares_to_unlock = (shares_locked * principal_repaid) / loan_stats.raised;
            shares_to_unlock
        }

        fn ref_get_lender_settlement(
            &self,
            loan_metadata: &LoanMetadata,
            loan_stats: &LoanStats,
            offer: &OfferMetadata,
            borrower_unlocked_shares: &Balance,
        ) -> (Balance, Balance) {
            if loan_stats.raised == 0u128 {
                return (offer.amount, 0);
            }

            let principal_repaid = loan_stats.repaid.saturating_sub(loan_stats.interest);
            let interest_repaid = loan_stats.repaid - principal_repaid;

            // Include security-deposit incase complete principle in not repaid by the borrower
            let mut principal_repaid =
                principal_repaid - interest_repaid + loan_metadata.security_deposit;
            if loan_stats.raised < principal_repaid {
                principal_repaid = loan_stats.raised;
            }

            let interest = (interest_repaid * offer.interest)
                .checked_div(loan_stats.interest)
                .unwrap_or(0);
            let pricipal = (principal_repaid * offer.amount) / loan_stats.raised;

            let funds = pricipal + interest;
            let lenders_share = (loan_metadata.shares_locked - borrower_unlocked_shares)
                * offer.amount
                / loan_stats.raised;

            (funds, lenders_share)
        }

        fn ref_settle_loan(
            &mut self,
            loan_id: &LoanId,
            loan_metadata: &LoanMetadata,
            loan_stats: &LoanStats,
        ) -> Result<()> {
            let total_offers = self.get_offer_nonce_or_default(loan_id);
            let mut remaining_shares = loan_metadata.shares_locked;
            let borrower_unlocked_shares =
                self.ref_get_borrower_settlement(&loan_stats, &loan_metadata.shares_locked);

            for offer_id in 0..total_offers {
                let offer = self.ref_get_offer_details(loan_id, &offer_id)?;
                if offer.status == OfferStatus::ACCEPTED {
                    let (funds, nft_shares) = self.ref_get_lender_settlement(
                        &loan_metadata,
                        &loan_stats,
                        &offer,
                        &borrower_unlocked_shares,
                    );
                    remaining_shares -= nft_shares;

                    ensure!(
                        self.env().transfer(offer.lender, funds).is_ok(),
                        Error::WithdrawFailed
                    );

                    self.transfer_fractional_nft(
                        &self.env().account_id(),
                        &offer.lender,
                        &loan_metadata.token_id,
                        &nft_shares,
                    )?;
                }
            }

            self.transfer_fractional_nft(
                &self.env().account_id(),
                &loan_metadata.borrower,
                &loan_metadata.token_id,
                &remaining_shares,
            )
        }

        fn transfer_fractional_nft(
            &mut self,
            from: &AccountId,
            to: &AccountId,
            token_id: &TokenId,
            amount: &Balance,
        ) -> Result<()> {
            if amount == &0u128 {
                return Ok(());
            }

            // @dev This is disabled during tests due to the use of `invoke_contract()` not being
            // supported (tests end up panicking).
            #[cfg(not(test))]
            {
                use ink::env::call::{build_call, ExecutionInput, Selector};

                const SAFE_TRANSFER_FROM_SELECTOR: [u8; 4] = [0x53, 0x24, 0xD5, 0x56];
                let result = build_call::<Environment>()
                    .call(self.fractionalizer)
                    .call_flags(ink::env::CallFlags::default().set_allow_reentry(true))
                    .exec_input(
                        ExecutionInput::new(Selector::new(SAFE_TRANSFER_FROM_SELECTOR))
                            .push_arg(from)
                            .push_arg(to)
                            .push_arg(token_id)
                            .push_arg(amount)
                            .push_arg::<Vec<u8>>(vec![]),
                    )
                    .returns::<core::result::Result<(), u8>>()
                    .params()
                    .invoke();

                ensure!(result.is_ok(), Error::FractionalNftTransferFailed);
            }
            Ok(())
        }
    }
}
