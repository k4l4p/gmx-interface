import { gql } from "@apollo/client";
import { USD_DECIMALS } from "config/factors";
import { useMarketsInfoData } from "context/SyntheticsStateContext/hooks/globalsHooks";
import { formatAmount } from "lib/numbers";
import { getByKey } from "lib/objects";
import { buildFiltersBody, getSyntheticsGraphClient } from "lib/subgraph";
import { useCallback, useState } from "react";
import { getAddress } from "viem";
import { getOrderTypeLabel } from "./synthetics/orders/utils";
import { parseContractPrice } from "./synthetics/tokens";
import { RawTradeAction } from "./synthetics/tradeHistory";

const useTradeActions = () => {
  const marketsInfo = useMarketsInfoData();

  const filterFun = useCallback((arr: RawTradeAction[]) => {
    if (!marketsInfo) return;
    const outArr = arr.map((value) => {
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
  }, [marketsInfo])

  const [data, setData] = useState<ReturnType<typeof filterFun>>([])


  const runFuc = useCallback(async ({
    chainId,
    fromTxTimestamp,
    toTxTimestamp,
  }: {
    chainId: number;
    fromTxTimestamp: number;
    toTxTimestamp: number;
  }) => {
    if (!marketsInfo) return;
    setData([])
    const filtersStr = buildFiltersBody({
      transaction: {
        timestamp_gte: fromTxTimestamp,
        timestamp_lt: toTxTimestamp,
      },
    });
  
    const whereClause = `where: ${filtersStr}`;
    const temp = await fetchHistory(chainId, whereClause);
    const outArr = filterFun(temp)
    console.log(`converted: ${outArr?.length}`)

    setData(outArr)
    return outArr
  }, [filterFun, marketsInfo]);


  return {runFuc, data};
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
    console.log({fromPage, toPage, currentMax})

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
    
    return async () => {
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
    }
  });

  const result:Array<{
    page: number;
    data: RawTradeAction[];
}> = []

  const chunkSize = 10;
  for (let i = 0; i < test.length; i += chunkSize) {
    const chunk = test.slice(i, i + chunkSize);

    let success = false
    while (!success) {
      try {
        console.time(i.toString())
        const tempResult = await Promise.all(chunk.map(fn => fn()))
        console.log(`fetched chunk ${ i + chunk.length } out of ${test.length}`)
        console.timeEnd(i.toString())
        result.push(...tempResult)
        success = true
      } catch (err) {
        console.log(err)
        console.log('retry')
        console.timeEnd(i.toString())
        await timeout(5000)
      }
    }
  }

  // const result = await Promise.all(test);

  const allActions = result
    .sort((a, b) => a.page - b.page)
    .map((r) => r.data)
    .flat();

  return allActions;
};

export default useTradeActions;

const customFormatUsd = (value?: string | bigint) => formatAmount(BigInt(value ?? ""), USD_DECIMALS, 2, false);

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
