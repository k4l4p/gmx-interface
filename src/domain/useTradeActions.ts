import { gql } from "@apollo/client";
import { USD_DECIMALS } from "config/factors";
import { useMarketsInfoData } from "context/SyntheticsStateContext/hooks/globalsHooks";
import { formatAmount } from "lib/numbers";
import { getByKey } from "lib/objects";
import { buildFiltersBody, getSyntheticsGraphClient } from "lib/subgraph";
import { useCallback } from "react";
import useSWR from "swr";
import { getAddress } from "viem";
import { getOrderTypeLabel } from "./synthetics/orders/utils";
import { parseContractPrice } from "./synthetics/tokens";
import { RawTradeAction } from "./synthetics/tradeHistory";

const useTradeActions = ({
  chainId,
  fromTxTimestamp,
  toTxTimestamp,
}: {
  chainId: number;
  fromTxTimestamp: number;
  toTxTimestamp: number;
}) => {
  const marketsInfo = useMarketsInfoData();

  const filtersStr = buildFiltersBody({
    // and: [
    // {
    // account: forAllAccounts ? undefined : account!.toLowerCase(),
    transaction: {
      timestamp_gte: fromTxTimestamp,
      timestamp_lte: toTxTimestamp,
    },
    // },
    // {
    //   or: !hasPureDirectionFilters
    //     ? undefined
    //     : pureDirectionFilters.map((filter) =>
    //         filter.direction === "swap"
    //           ? {
    //               orderType_in: [OrderType.LimitSwap, OrderType.MarketSwap],
    //             }
    //           : {
    //               isLong: filter.direction === "long",
    //               orderType_not_in: [OrderType.LimitSwap, OrderType.MarketSwap],
    //             }
    //       ),
    // },
    // {
    //   or: orderEventCombinations?.map((combination) => {
    //     let sizeDeltaUsdCondition = {};

    //     if (
    //       combination.orderType !== undefined &&
    //       [OrderType.MarketDecrease, OrderType.MarketIncrease].includes(combination.orderType)
    //     ) {
    //       if (combination.isDepositOrWithdraw) {
    //         sizeDeltaUsdCondition = { sizeDeltaUsd: 0 };
    //       } else {
    //         sizeDeltaUsdCondition = { sizeDeltaUsd_not: 0 };
    //       }
    //     }

    //     return merge(
    //       {
    //         eventName: combination.eventName,
    //         orderType: combination.orderType,
    //       },
    //       sizeDeltaUsdCondition
    //     );
    //   }),
    // },
    // {
    // We do not show create liquidation orders in the trade history, thus we filter it out
    // ... && not (liquidation && orderCreated) === ... && (not liquidation || not orderCreated)
    // or: [{ orderType_not: OrderType.Liquidation }, { eventName_not: TradeActionType.OrderCreated }],
    // },
    // ],
  });

  const whereClause = `where: ${filtersStr}`;

  const runFuc = useCallback(async () => {
    if (!marketsInfo) return;
    const temp = await fetchHistory(chainId, whereClause);
    const outArr = temp.map((value) => {
      const marketAddress = getAddress(value.marketAddress ?? "");
      const market = getByKey(marketsInfo, marketAddress);
      const indexToken = market?.indexToken;
      const longToken = market?.longToken;
      const shortToken = market?.shortToken;
      const marketName = `${indexToken?.symbol ?? ""}/USD [${longToken?.symbol ?? ""}-${shortToken?.symbol ?? ""}]`;

      const executionPrice = indexToken
        ? customFormatUsd(parseContractPrice(BigInt(value.executionPrice ?? ""), indexToken?.decimals))
        : "";
      const indexTokenPriceMin = indexToken
        ? customFormatUsd(parseContractPrice(BigInt(value.indexTokenPriceMin ?? ""), indexToken?.decimals))
        : "";
      const indexTokenPriceMax = indexToken
        ? customFormatUsd(parseContractPrice(BigInt(value.indexTokenPriceMax ?? ""), indexToken?.decimals))
        : "";
      return {
        account: value.account,
        eventName: value.eventName,
        orderType: getOrderTypeLabel(value.orderType),
        sizeDeltaUsd: customFormatUsd(value.sizeDeltaUsd),
        timestamp: value.transaction.timestamp,
        marketName,
        marketAddress: value.marketAddress,
        isLong: value.isLong,
        priceImpactUsd: customFormatUsd(value.priceImpactUsd),
        pnlUsd: customFormatUsd(value.pnlUsd),
        basePnlUsd: customFormatUsd(value.basePnlUsd),
        executionPrice,
        indexTokenPriceMin,
        indexTokenPriceMax,
      };
    });

    return outArr;
  }, [chainId, marketsInfo, whereClause]);

  const { data } = useSWR(["custom-history"], runFuc, {
    errorRetryInterval: 5000,
    refreshInterval: 60000,
  });
  return data;
};

const fetchHistory = async (chainId: number, whereClause: string) => {
  const client = getSyntheticsGraphClient(chainId);

  let fromPage = 0;
  let toPage = 100;
  let currentMax: null | number = null;

  while (fromPage !== toPage) {
    const query = gql(`{
      tradeActions(
          orderBy: transaction__timestamp,
          orderDirection: desc,
          skip: ${toPage * 1000},
          first: ${1000},
          ${whereClause}
      ) {
          id
      }
    }`);

    const result = await client!.query({ query, fetchPolicy: "no-cache" });
    const rawData = (result.data.tradeActions ?? []) as any[];

    if (rawData.length === 1000) {
      fromPage = toPage;
      if (currentMax === null) {
        toPage += 100;
      } else {
        toPage = currentMax;
      }
    } else if (rawData.length === 0) {
      currentMax = toPage;
      toPage = Math.floor((fromPage + toPage) / 2);
    } else {
      fromPage = toPage;
    }
  }

  const test = [...Array(fromPage).keys(), fromPage].map((page) => {
    const query = gql(`{
      tradeActions(
          orderBy: transaction__timestamp,
          orderDirection: desc,
          skip: ${page * 1000},
          first: ${1000},
          ${whereClause}
      ) {
          id
          eventName

          account
          marketAddress
          swapPath
          initialCollateralTokenAddress

          initialCollateralDeltaAmount
          sizeDeltaUsd
          triggerPrice
          acceptablePrice
          executionPrice
          minOutputAmount
          executionAmountOut

          priceImpactUsd
          priceImpactDiffUsd
          positionFeeAmount
          borrowingFeeAmount
          fundingFeeAmount
          liquidationFeeAmount
          pnlUsd
          basePnlUsd

          collateralTokenPriceMax
          collateralTokenPriceMin

          indexTokenPriceMin
          indexTokenPriceMax

          orderType
          orderKey
          isLong
          shouldUnwrapNativeToken

          reason
          reasonBytes

          transaction {
              timestamp
              hash
          }
      }
    }`);
    return client!.query({ query, fetchPolicy: "no-cache" }).then((r) => ({
      page,
      data: (r.data?.tradeActions ?? []) as RawTradeAction[],
    }));
  });
  const result = await Promise.all(test);

  const allActions = result
    .sort((a, b) => a.page - b.page)
    .map((r) => r.data)
    .flat();
  // while (current === 1000) {
  //   const query = gql(`{
  //     tradeActions(
  //         orderBy: transaction__timestamp,
  //         orderDirection: desc,
  //         skip: ${page * 1000},
  //         first: ${1000},
  //         ${whereClause}
  //     ) {
  //         id
  //         eventName

  //         account
  //         marketAddress
  //         swapPath
  //         initialCollateralTokenAddress

  //         initialCollateralDeltaAmount
  //         sizeDeltaUsd
  //         triggerPrice
  //         acceptablePrice
  //         executionPrice
  //         minOutputAmount
  //         executionAmountOut

  //         priceImpactUsd
  //         priceImpactDiffUsd
  //         positionFeeAmount
  //         borrowingFeeAmount
  //         fundingFeeAmount
  //         liquidationFeeAmount
  //         pnlUsd
  //         basePnlUsd

  //         collateralTokenPriceMax
  //         collateralTokenPriceMin

  //         indexTokenPriceMin
  //         indexTokenPriceMax

  //         orderType
  //         orderKey
  //         isLong
  //         shouldUnwrapNativeToken

  //         reason
  //         reasonBytes

  //         transaction {
  //             timestamp
  //             hash
  //         }
  //     }
  //   }`);

  //   const result = await client!.query({ query, fetchPolicy: "no-cache" });
  //   const rawTradeActions = (result.data?.tradeActions || []) as RawTradeAction[];
  //   allActions.push(...rawTradeActions);
  //   current = rawTradeActions.length;
  //   page++;
  // }

  return allActions;
};

export default useTradeActions;

const customFormatUsd = (value?: string | bigint) => formatAmount(BigInt(value ?? ""), USD_DECIMALS, 2, false);
