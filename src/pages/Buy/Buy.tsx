import { t } from "@lingui/macro";

import { getPageTitle } from "lib/legacy";

import SEO from "components/Common/SEO";
import Footer from "components/Footer/Footer";
import PageTitle from "components/PageTitle/PageTitle";
import TokenCard from "components/TokenCard/TokenCard";

import useTradeActions from "domain/useTradeActions";
import { useChainId } from "lib/chains";
import { downloadAsCsv } from "lib/csv";
import { useState } from "react";
import "./Buy.css";

const months = [1704067200, 1706745600, 1709251200, 1711929600, 1714521600, 1717200000, 1719792000, 1722470400, 1725148800, 1727740800, 1730419200, 1733011200]

export default function BuyGMXGLP() {
  const { chainId } = useChainId();
  const to = 1739157928;
  const [month, setMonth] = useState<null | number>(null)
  // const from = 1735689600;

  const {data, runFuc} = useTradeActions();
  return (
    <SEO title={getPageTitle(t`Buy GLP or GMX`)}>
      <div className="BuyGMXGLP page-layout">
        <div className="default-container">
          <div className="BuyGMXGLP-container">
            <div className="flex gap-3">

            
          {
            months.map((m, idx) => {

                return( <button className="border rounded-10 p-5 px-10" key={m} onClick={() => {
                  setMonth(idx + 1)
                  runFuc({
                    chainId,
                    fromTxTimestamp: m,
                    toTxTimestamp: months?.[idx + 1] ?? 1735689600
                  })
                }}>
                  {idx  +1}
                </button>)
              
            })
          }</div>
            {data && (
              <button
                onClick={() => {
                  downloadAsCsv(`rawData_${month}`, data, []);
                }}
                className="rounded-12 border px-8 py-4 text-12 text-white"
              >
                download
              </button>
            )}
            <PageTitle showNetworkIcon={false} isTop title={t`Protocol Tokens`} qa="buy-page" />
            <TokenCard />
          </div>
        </div>
        <Footer />
      </div>
    </SEO>
  );
}
