import { t } from "@lingui/macro";

import { getPageTitle } from "lib/legacy";

import SEO from "components/Common/SEO";
import Footer from "components/Footer/Footer";
import PageTitle from "components/PageTitle/PageTitle";
import TokenCard from "components/TokenCard/TokenCard";

import useTradeActions from "domain/useTradeActions";
import { useChainId } from "lib/chains";
import { downloadAsCsv } from "lib/csv";
import "./Buy.css";

export default function BuyGMXGLP() {
  const { chainId } = useChainId();
  const to = 1739157928;
  const from = 1735689600;
  // const from = to - 60 * 60;
  const data = useTradeActions({
    chainId,
    fromTxTimestamp: from,
    toTxTimestamp: to,
  });
  return (
    <SEO title={getPageTitle(t`Buy GLP or GMX`)}>
      <div className="BuyGMXGLP page-layout">
        <div className="default-container">
          <div className="BuyGMXGLP-container">
            {data && (
              <button
                onClick={() => {
                  downloadAsCsv(`rawData_${to}`, data, [], undefined, 5);
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
