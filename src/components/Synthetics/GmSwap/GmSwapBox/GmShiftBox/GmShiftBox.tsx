import { t } from "@lingui/macro";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useCallback, useEffect, useMemo, useState } from "react";

import { HIGH_PRICE_IMPACT_BPS } from "config/factors";
import { useSettings } from "context/SettingsContext/SettingsContextProvider";
import { useMarketsInfoData, useTokensData, useUiFeeFactor } from "context/SyntheticsStateContext/hooks/globalsHooks";
import {
  selectAccount,
  selectChainId,
  selectGasLimits,
  selectGasPrice,
} from "context/SyntheticsStateContext/selectors/globalSelectors";
import { useSelector } from "context/SyntheticsStateContext/utils";
import { useHasOutdatedUi } from "domain/legacy";
import {
  FeeItem,
  estimateExecuteShiftGasLimit,
  getExecutionFee,
  getFeeItem,
  getTotalFeeItem,
} from "domain/synthetics/fees";
import { estimateShiftOraclePriceCount } from "domain/synthetics/fees/utils/estimateOraclePriceCount";
import { MarketInfo, getMarketIndexName } from "domain/synthetics/markets";
import { useMarketTokensData } from "domain/synthetics/markets/useMarketTokensData";
import { useGmTokensFavorites } from "domain/synthetics/tokens/useGmTokensFavorites";
import { GmSwapFees } from "domain/synthetics/trade/types";
import useSortedPoolsWithIndexToken from "domain/synthetics/trade/useSortedPoolsWithIndexToken";
import { getShiftAmounts } from "domain/synthetics/trade/utils/shift";
import { getCommonError, getGmShiftError } from "domain/synthetics/trade/utils/validation";
import { bigMath } from "lib/bigmath";
import { formatAmountFree, formatTokenAmount, formatUsd, parseValue } from "lib/numbers";
import { getByKey } from "lib/objects";
import { Operation } from "../types";
import { useShiftAvailableMarkets } from "./useShiftAvailableMarkets";
import { useShiftAvailableRelatedMarkets } from "./useShiftAvailableRelatedMarkets";
import { useUpdateMarkets } from "./useUpdateMarkets";

import Button from "components/Button/Button";
import BuyInputSection from "components/BuyInputSection/BuyInputSection";
import { ExchangeInfo } from "components/Exchange/ExchangeInfo";
import { PoolSelector } from "components/MarketSelector/PoolSelector";
import { NetworkFeeRow } from "components/Synthetics/NetworkFeeRow/NetworkFeeRow";
import { GmConfirmationBox } from "../../GmConfirmationBox/GmConfirmationBox";
import { GmFees } from "../../GmFees/GmFees";
import { Swap } from "../Swap";

export function GmShiftBox({
  selectedMarketAddress,
  onSelectMarket,
}: {
  selectedMarketAddress: string | undefined;
  onSelectMarket: (marketAddress: string) => void;
}) {
  const [toMarketAddress, setToMarketAddress] = useState<string | undefined>(undefined);
  const [selectedMarketText, setSelectedMarketText] = useState("");
  const [toMarketText, setToMarketText] = useState("");
  const gmTokenFavoritesContext = useGmTokensFavorites();
  const [focusedInput, setFocusedInput] = useState<"selectedMarket" | "toMarket" | undefined>(undefined);
  const [isConfirmationBoxVisible, setIsConfirmationBoxVisible] = useState(false);
  const { openConnectModal } = useConnectModal();

  const chainId = useSelector(selectChainId);
  const account = useSelector(selectAccount);
  const uiFeeFactor = useUiFeeFactor();
  const gasLimits = useSelector(selectGasLimits);
  const gasPrice = useSelector(selectGasPrice);
  const marketsInfoData = useMarketsInfoData();
  const tokensData = useTokensData();
  const { marketTokensData: depositMarketTokensData } = useMarketTokensData(chainId, { isDeposit: true });
  const { marketsInfo: sortedMarketsInfoByIndexToken } = useSortedPoolsWithIndexToken(
    marketsInfoData,
    depositMarketTokensData
  );
  const shiftAvailableMarkets = useShiftAvailableMarkets(sortedMarketsInfoByIndexToken);
  const shiftAvailableRelatedMarkets = useShiftAvailableRelatedMarkets(
    marketsInfoData,
    sortedMarketsInfoByIndexToken,
    selectedMarketAddress
  );
  const { shouldDisableValidationForTesting } = useSettings();
  const { data: hasOutdatedUi } = useHasOutdatedUi();

  const selectedMarketInfo = getByKey(marketsInfoData, selectedMarketAddress);
  const selectedIndexName = selectedMarketInfo ? getMarketIndexName(selectedMarketInfo) : "...";
  const selectedToken = getByKey(depositMarketTokensData, selectedMarketAddress);
  const toMarketInfo = getByKey(marketsInfoData, toMarketAddress);
  const toIndexName = toMarketInfo ? getMarketIndexName(toMarketInfo) : "...";
  const toToken = getByKey(depositMarketTokensData, toMarketAddress);

  const amounts = useMemo(() => {
    if (!selectedMarketInfo || !selectedToken || !toMarketInfo || !toToken) {
      return;
    }

    let fromTokenAmount = parseValue(selectedMarketText, selectedToken.decimals) ?? 0n;

    let toTokenAmount = parseValue(toMarketText, toToken.decimals) ?? 0n;

    const amounts = getShiftAmounts({
      fromMarketInfo: selectedMarketInfo,
      fromToken: selectedToken,
      fromTokenAmount,
      toMarketInfo,
      toToken: toToken,
      toTokenAmount,
      strategy: focusedInput === "selectedMarket" ? "byFromToken" : "byToToken",
      uiFeeFactor,
    });

    return amounts;
  }, [
    focusedInput,
    selectedMarketInfo,
    selectedMarketText,
    selectedToken,
    toMarketInfo,
    toMarketText,
    toToken,
    uiFeeFactor,
  ]);

  const { fees, executionFee } = useMemo(() => {
    if (!gasLimits || gasPrice === undefined || !tokensData || !amounts) {
      return {};
    }

    const basisUsd = amounts.fromTokenUsd;

    const swapPriceImpact = getFeeItem(amounts.swapPriceImpactDeltaUsd, basisUsd);
    const uiFee = getFeeItem(amounts.uiFeeUsd * -1n, basisUsd, {
      shouldRoundUp: true,
    });
    const shiftFee = getFeeItem(0n, basisUsd);

    const totalFees = getTotalFeeItem([swapPriceImpact, uiFee].filter(Boolean) as FeeItem[]);
    const fees: GmSwapFees = {
      swapPriceImpact,
      totalFees,
      uiFee,
      shiftFee,
    };

    const gasLimit = estimateExecuteShiftGasLimit(gasLimits, {
      callbackGasLimit: 0n,
    });

    const oraclePriceCount = estimateShiftOraclePriceCount();

    const executionFee = getExecutionFee(chainId, gasLimits, tokensData, gasLimit, gasPrice, oraclePriceCount);

    return {
      fees,
      executionFee,
    };
  }, [amounts, chainId, gasLimits, gasPrice, tokensData]);

  const isHighPriceImpact =
    (fees?.swapPriceImpact?.deltaUsd ?? 0) < 0 &&
    bigMath.abs(fees?.swapPriceImpact?.bps ?? 0n) >= HIGH_PRICE_IMPACT_BPS;

  const submitState = useMemo(() => {
    if (!account) {
      return {
        text: t`Connect Wallet`,
        onSubmit: () => openConnectModal?.(),
      };
    }

    const commonError = getCommonError({
      chainId,
      isConnected: true,
      hasOutdatedUi,
    })[0];

    const swapError = getGmShiftError({
      fromMarketInfo: selectedMarketInfo,
      fromToken: selectedToken,
      fromTokenAmount: amounts?.fromTokenAmount,
      fromTokenUsd: amounts?.fromTokenUsd,
      toMarketInfo: toMarketInfo,
      toToken: toToken,
      toTokenAmount: amounts?.toTokenAmount,
      fees,
      isHighPriceImpact: isHighPriceImpact,
      isHighPriceImpactAccepted: true,
      priceImpactUsd: amounts?.swapPriceImpactDeltaUsd,
    })[0];

    const error = commonError || swapError;

    const onSubmit = () => {
      setIsConfirmationBoxVisible(true);
    };

    if (error) {
      return {
        text: error,
        error,
        isDisabled: !shouldDisableValidationForTesting,
        onSubmit,
      };
    }

    return {
      text: t`Shift GM`,
      onSubmit,
    };
  }, [
    account,
    chainId,
    hasOutdatedUi,
    selectedMarketInfo,
    selectedToken,
    amounts?.fromTokenAmount,
    amounts?.fromTokenUsd,
    amounts?.toTokenAmount,
    amounts?.swapPriceImpactDeltaUsd,
    toMarketInfo,
    toToken,
    fees,
    isHighPriceImpact,
    openConnectModal,
    shouldDisableValidationForTesting,
  ]);

  useUpdateMarkets({
    marketsInfoData,
    selectedMarketAddress,
    shiftAvailableMarkets,
    onSelectMarket,
    toMarketAddress,
    toMarketInfo,
    selectedMarketInfo,
    setToMarketAddress,
  });

  useEffect(
    function updateTokens() {
      if (!amounts || !selectedToken || !toToken) {
        return;
      }

      if (focusedInput === "selectedMarket") {
        if (amounts.toTokenAmount === 0n) {
          setToMarketText("");
        } else {
          setToMarketText(formatAmountFree(amounts.toTokenAmount, toToken.decimals));
        }
      } else {
        if (amounts.fromTokenAmount === 0n) {
          setSelectedMarketText("");
        } else {
          setSelectedMarketText(formatAmountFree(amounts.fromTokenAmount, selectedToken.decimals));
        }
      }
    },
    [amounts, focusedInput, selectedToken, toToken]
  );

  const handleFormSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      submitState.onSubmit();
    },
    [submitState]
  );

  const handleSelectedTokenClickTopRightLabel = useCallback(() => {
    if (!selectedToken || selectedToken.balance === undefined) return;
    setSelectedMarketText(formatAmountFree(selectedToken.balance, selectedToken.decimals));
  }, [selectedToken]);

  const handleSelectedTokenInputValueChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => setSelectedMarketText(event.target.value),
    []
  );

  const handleSelectedTokenFocus = useCallback(() => setFocusedInput("selectedMarket"), []);

  const handleSelectedTokenSelectMarket = useCallback(
    (marketInfo: MarketInfo): void => onSelectMarket(marketInfo.marketTokenAddress),
    [onSelectMarket]
  );

  return (
    <>
      <form className="flex flex-col" onSubmit={handleFormSubmit}>
        <BuyInputSection
          topLeftLabel={t`Pay`}
          topLeftValue={formatUsd(amounts?.fromTokenUsd)}
          topRightLabel={t`Balance`}
          topRightValue={formatTokenAmount(selectedToken?.balance, selectedToken?.decimals, "", {
            useCommas: true,
          })}
          onClickTopRightLabel={handleSelectedTokenClickTopRightLabel}
          inputValue={selectedMarketText}
          onInputValueChange={handleSelectedTokenInputValueChange}
          onFocus={handleSelectedTokenFocus}
        >
          <PoolSelector
            selectedMarketAddress={selectedMarketAddress}
            markets={shiftAvailableMarkets}
            onSelectMarket={handleSelectedTokenSelectMarket}
            selectedIndexName={selectedIndexName}
            showAllPools
            isSideMenu
            showIndexIcon
            showBalances
            marketTokensData={depositMarketTokensData}
            {...gmTokenFavoritesContext}
          />
        </BuyInputSection>
        <Swap
          onSwitchSide={() => {
            onSelectMarket(toMarketAddress!);
            setToMarketAddress(selectedMarketAddress);
          }}
        />
        <BuyInputSection
          topLeftLabel={t`Receive`}
          topLeftValue={formatUsd(amounts?.toTokenUsd)}
          topRightLabel={t`Balance`}
          topRightValue={formatTokenAmount(toToken?.balance, toToken?.decimals, "", {
            useCommas: true,
          })}
          inputValue={toMarketText}
          onInputValueChange={(event) => setToMarketText(event.target.value)}
          onFocus={() => setFocusedInput("toMarket")}
        >
          <PoolSelector
            selectedMarketAddress={toMarketAddress}
            markets={shiftAvailableRelatedMarkets}
            onSelectMarket={(marketInfo) => setToMarketAddress(marketInfo.marketTokenAddress)}
            selectedIndexName={toIndexName}
            showAllPools
            isSideMenu
            showIndexIcon
            showBalances
            marketTokensData={depositMarketTokensData}
            {...gmTokenFavoritesContext}
          />
        </BuyInputSection>
        <ExchangeInfo className="mb-6">
          <ExchangeInfo.Group>
            <GmFees
              isDeposit={true}
              totalFees={fees?.totalFees}
              swapPriceImpact={fees?.swapPriceImpact}
              uiFee={fees?.uiFee}
              shiftFee={fees?.shiftFee}
            />
            <NetworkFeeRow executionFee={executionFee} />
          </ExchangeInfo.Group>
        </ExchangeInfo>
        <div className="Exchange-swap-button-container">
          <Button className="w-full" variant="primary-action" type="submit" disabled={submitState.isDisabled}>
            {submitState.text}
          </Button>
        </div>
      </form>

      <GmConfirmationBox
        isVisible={isConfirmationBoxVisible}
        fromMarketToken={selectedToken}
        fromMarketTokenAmount={amounts?.fromTokenAmount ?? 0n}
        fromMarketTokenUsd={amounts?.fromTokenUsd ?? 0n}
        marketToken={toToken}
        marketTokenAmount={amounts?.toTokenAmount ?? 0n}
        marketTokenUsd={amounts?.toTokenUsd ?? 0n}
        fees={fees!}
        error={submitState.error}
        operation={Operation.Shift}
        executionFee={executionFee}
        onSubmitted={() => {
          setIsConfirmationBoxVisible(false);
        }}
        onClose={() => {
          setIsConfirmationBoxVisible(false);
        }}
        shouldDisableValidation={shouldDisableValidationForTesting}
      />
    </>
  );
}
